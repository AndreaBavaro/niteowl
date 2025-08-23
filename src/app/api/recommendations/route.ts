import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Bar, UserProfile, MusicGenre, DayOfWeek, CapacitySize } from '@/lib/types';

// Server-side recommendation logic
async function getRecommendationsForUser(supabase: any, user: UserProfile): Promise<{
  perfectForTonight: Bar[];
  yourVibe: Bar[];
  quickEntry: Bar[];
  trendingInArea: Bar[];
}> {
  // Get all bars first
  const { data: allBars, error } = await supabase
    .from('bars')
    .select('*');

  if (error || !allBars) {
    console.error('Error fetching bars:', error);
    return {
      perfectForTonight: [],
      yourVibe: [],
      quickEntry: [],
      trendingInArea: []
    };
  }

  const bars: Bar[] = allBars;

  // Perfect for Tonight - High-rated bars with good service
  const perfectForTonight = bars
    .filter(bar => bar.service_rating >= 4.0)
    .sort((a, b) => b.service_rating - a.service_rating)
    .slice(0, 10);

  // Your Vibe - Bars matching user's music preferences
  const yourVibe = user.preferred_music && user.preferred_music.length > 0
    ? bars.filter(bar => 
        bar.top_music.some(genre => 
          user.preferred_music!.includes(genre as MusicGenre)
        )
      ).slice(0, 10)
    : [];

  // Quick Entry - Bars with minimal wait times
  const quickEntry = bars
    .filter(bar => bar.typical_lineup_min === '0-10 min')
    .slice(0, 10);

  // Trending in Area - Filter bars by user's neighborhood preferences
  const userNeighborhoods = [user.first_neighbourhood, user.second_neighbourhood, user.third_neighbourhood].filter(Boolean);
  const trendingInArea = userNeighborhoods.length > 0
    ? bars.filter(bar => bar.neighbourhood && userNeighborhoods.includes(bar.neighbourhood)).slice(0, 10)
    : bars.slice(0, 10); // Fallback to top bars

  return {
    perfectForTonight,
    yourVibe,
    quickEntry,
    trendingInArea
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Return mock data when in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('MOCK MODE: Returning mock recommendations');
      
      const mockBars: Bar[] = [
        {
          id: 'mock-bar-1',
          name: 'The Rooftop',
          slug: 'the-rooftop',
          neighbourhood: 'King West',
          address: '123 King St W, Toronto',
          description: 'Trendy rooftop bar with city views',
          typical_lineup_min: '0-10 min',
          longest_line_days: ['Fri', 'Sat'],
          cover_frequency: 'Sometimes',
          cover_amount: '$10-$20',
          typical_vibe: 'Upscale and trendy',
          top_music: ['House', 'EDM'],
          age_group_min: '22-25',
          service_rating: 4.5,
          // Enhanced attributes
          live_music_days: ['Fri', 'Sat'] as DayOfWeek[],
          has_patio: true,
          has_rooftop: true,
          has_dancefloor: true,
          karaoke_nights: [] as DayOfWeek[],
          has_food: true,
          capacity_size: 'Large (150-300)' as CapacitySize,
          has_pool_table: false,
          has_arcade_games: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'mock-bar-2',
          name: 'Bass Club',
          slug: 'bass-club',
          neighbourhood: 'Entertainment District',
          address: '456 Richmond St W, Toronto',
          description: 'Underground club with heavy bass music',
          typical_lineup_min: '15-30 min',
          longest_line_days: ['Thu', 'Fri', 'Sat'],
          cover_frequency: 'Yes-always',
          cover_amount: 'Over $20',
          typical_vibe: 'High energy dance floor',
          top_music: ['Rap', 'Hip-hop'],
          age_group_min: '18-21',
          service_rating: 4.2,
          // Enhanced attributes
          live_music_days: ['Thu', 'Fri', 'Sat'] as DayOfWeek[],
          has_patio: false,
          has_rooftop: false,
          has_dancefloor: true,
          karaoke_nights: [] as DayOfWeek[],
          has_food: false,
          capacity_size: 'Very Large (300+)' as CapacitySize,
          has_pool_table: false,
          has_arcade_games: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'mock-bar-3',
          name: 'Chill Lounge',
          slug: 'chill-lounge',
          neighbourhood: 'King West',
          address: '789 Adelaide St W, Toronto',
          description: 'Relaxed atmosphere with craft cocktails',
          typical_lineup_min: '0-10 min',
          longest_line_days: ['Sat'],
          cover_frequency: 'No cover',
          typical_vibe: 'Laid back and social',
          top_music: ['Top 40', 'Pop'],
          age_group_min: '25-30',
          service_rating: 4.8,
          // Enhanced attributes
          live_music_days: ['Wed', 'Thu'] as DayOfWeek[],
          has_patio: true,
          has_rooftop: false,
          has_dancefloor: false,
          karaoke_nights: ['Tue', 'Wed'] as DayOfWeek[],
          has_food: true,
          capacity_size: 'Medium (50-150)' as CapacitySize,
          has_pool_table: true,
          has_arcade_games: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      const mockRecommendations = {
        perfectForTonight: [mockBars[2], mockBars[0]], // High-rated bars
        yourVibe: [mockBars[0], mockBars[1]], // Matching user's music preferences
        quickEntry: [mockBars[0], mockBars[2]], // Quick entry bars
        trendingInArea: [mockBars[0], mockBars[2]] // Bars in King West
      };

      return NextResponse.json({
        bars: mockBars,
        recommendations: mockRecommendations
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user profile with preferences
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        user_preferences (
          first_neighbourhood,
          second_neighbourhood,
          third_neighbourhood,
          preferred_music,
          age
        )
      `)
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Construct user profile
    const preferences = userData.user_preferences || {};
    const userProfile: UserProfile = {
      id: userData.id,
      email: userData.email,
      phone: userData.phone,
      full_name: userData.full_name,
      avatar_url: userData.avatar_url,
      first_neighbourhood: preferences.first_neighbourhood,
      second_neighbourhood: preferences.second_neighbourhood,
      third_neighbourhood: preferences.third_neighbourhood,
      preferred_music: preferences.preferred_music,
      age: preferences.age,
      access_status: userData.access_status || 'pending',
      loyalty_points: userData.loyalty_points || 0,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    // Check access status
    if (userProfile.access_status !== 'approved') {
      return NextResponse.json({ error: 'Access not approved' }, { status: 403 });
    }

    // Get recommendations
    const recommendations = await getRecommendationsForUser(supabase, userProfile);

    // Return all bars in a flat structure for the client to organize
    const allRecommendedBars = [
      ...recommendations.perfectForTonight,
      ...recommendations.yourVibe,
      ...recommendations.quickEntry,
      ...recommendations.trendingInArea
    ];

    // Remove duplicates
    const uniqueBars = allRecommendedBars.filter((bar, index, self) => 
      index === self.findIndex(b => b.id === bar.id)
    );

    return NextResponse.json({
      bars: uniqueBars,
      recommendations: recommendations
    });

  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
