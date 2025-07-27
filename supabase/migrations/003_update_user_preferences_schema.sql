-- Migration to update user_preferences schema
-- Handle existing NULL values before making columns NOT NULL

-- First, update any existing NULL values with default values
UPDATE user_preferences 
SET location_neighbourhood = 'Not Set' 
WHERE location_neighbourhood IS NULL;

UPDATE user_preferences 
SET preferred_music = ARRAY[]::music_genre[] 
WHERE preferred_music IS NULL;

-- Add the age column with a default value for existing rows
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS age INTEGER DEFAULT 18;

-- Update existing rows to have a reasonable default age
UPDATE user_preferences 
SET age = 25 
WHERE age IS NULL OR age = 18;

-- Now make the columns NOT NULL (after handling existing data)
ALTER TABLE user_preferences 
ALTER COLUMN location_neighbourhood SET NOT NULL,
ALTER COLUMN preferred_music SET NOT NULL,
ALTER COLUMN age SET NOT NULL;

-- Remove the default constraint on age (we want it required for new users)
ALTER TABLE user_preferences 
ALTER COLUMN age DROP DEFAULT;

-- Update users table to have access_status default
ALTER TABLE users 
ALTER COLUMN access_status SET DEFAULT 'pending';

-- Update any existing users without access_status
UPDATE users 
SET access_status = 'pending' 
WHERE access_status IS NULL;

-- Make access_status NOT NULL
ALTER TABLE users 
ALTER COLUMN access_status SET NOT NULL;
