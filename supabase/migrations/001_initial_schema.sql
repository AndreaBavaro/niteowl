-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE lineup_time_range AS ENUM ('0-10 min', '15-30 min', '30+ min');
CREATE TYPE cover_frequency AS ENUM ('No cover', 'Sometimes', 'Yes-always');
CREATE TYPE cover_amount AS ENUM ('Under $10', '$10-$20', 'Over $20');
CREATE TYPE age_group AS ENUM ('18-21', '22-25', '25-30');
CREATE TYPE music_genre AS ENUM ('House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz');
CREATE TYPE day_of_week AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    provider_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bars table
CREATE TABLE bars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    canonical_name TEXT,
    neighbourhood TEXT,
    address TEXT,
    description TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geo_coords GEOGRAPHY(POINT),
    -- Bar characteristics with min/max ranges
    typical_lineup_min lineup_time_range NOT NULL,
    typical_lineup_max lineup_time_range,
    longest_line_days day_of_week[] DEFAULT '{}',
    cover_frequency cover_frequency NOT NULL,
    cover_amount cover_amount,
    typical_vibe TEXT NOT NULL,
    top_music music_genre[] DEFAULT '{}',
    age_group_min age_group NOT NULL,
    age_group_max age_group,
    service_rating DECIMAL(3, 1) CHECK (service_rating >= 1 AND service_rating <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_age_group age_group,
    preferred_music music_genre[] DEFAULT '{}',
    preferred_vibe TEXT,
    cover_tolerance cover_amount,
    preferred_days day_of_week[] DEFAULT '{}',
    location_neighbourhood TEXT,
    location_geo_coords GEOGRAPHY(POINT),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bar_id UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wait_time_category lineup_time_range NOT NULL,
    cover_frequency cover_frequency NOT NULL,
    cover_amount_bucket cover_amount,
    vibe TEXT NOT NULL,
    music_genres music_genre[] DEFAULT '{}',
    days_long_lines day_of_week[] DEFAULT '{}',
    age_group age_group NOT NULL,
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favourite bars table
CREATE TABLE favourite_bars (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bar_id UUID NOT NULL REFERENCES bars(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, bar_id)
);

-- Create indexes for performance
CREATE INDEX idx_bars_slug ON bars(slug);
CREATE INDEX idx_bars_neighbourhood ON bars(neighbourhood);
CREATE INDEX idx_bars_geo_coords ON bars USING GIST(geo_coords);
CREATE INDEX idx_submissions_bar_id ON submissions(bar_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Create function to update geo_coords from lat/lng
CREATE OR REPLACE FUNCTION update_geo_coords()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geo_coords = ST_Point(NEW.longitude, NEW.latitude)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update geo_coords
CREATE TRIGGER trigger_update_geo_coords
    BEFORE INSERT OR UPDATE ON bars
    FOR EACH ROW
    EXECUTE FUNCTION update_geo_coords();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_bars_updated_at
    BEFORE UPDATE ON bars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create aggregated view for bar metrics
CREATE OR REPLACE VIEW bar_metrics_view AS
SELECT 
    b.id as bar_id,
    b.name as bar_name,
    b.slug as bar_slug,
    b.neighbourhood,
    b.typical_lineup_min,
    b.typical_lineup_max,
    b.cover_frequency,
    b.cover_amount,
    b.typical_vibe,
    b.top_music,
    b.age_group_min,
    b.age_group_max,
    b.service_rating as base_service_rating,
    -- Aggregated metrics from submissions
    COALESCE(AVG(s.service_rating::DECIMAL), b.service_rating) as avg_service_rating,
    COUNT(s.id) as total_submissions,
    MAX(s.created_at) as last_submission_at,
    -- Most common values from submissions (only when submissions exist)
    CASE WHEN COUNT(s.id) > 0 THEN MODE() WITHIN GROUP (ORDER BY s.wait_time_category) END as most_common_wait_time,
    CASE WHEN COUNT(s.id) > 0 THEN MODE() WITHIN GROUP (ORDER BY s.cover_frequency) END as most_common_cover_frequency,
    CASE WHEN COUNT(s.id) > 0 THEN MODE() WITHIN GROUP (ORDER BY s.age_group) END as most_common_age_group
FROM bars b
LEFT JOIN submissions s ON b.id = s.bar_id
GROUP BY b.id, b.name, b.slug, b.neighbourhood, b.typical_lineup_min, b.typical_lineup_max, 
         b.cover_frequency, b.cover_amount, b.typical_vibe, b.top_music, 
         b.age_group_min, b.age_group_max, b.service_rating;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourite_bars ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can only see and update their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Bars: Public read access, admin write access
CREATE POLICY "Anyone can view bars" ON bars
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify bars" ON bars
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.email LIKE '%@admin.torontobartracker.com'
        )
    );

-- User preferences: Users can only access their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Submissions: Users can view all, but only create/update their own
CREATE POLICY "Anyone can view submissions" ON submissions
    FOR SELECT USING (true);

CREATE POLICY "Users can create own submissions" ON submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions" ON submissions
    FOR UPDATE USING (auth.uid() = user_id);

-- Favourite bars: Users can only access their own favourites
CREATE POLICY "Users can view own favourites" ON favourite_bars
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favourites" ON favourite_bars
    FOR ALL USING (auth.uid() = user_id);
