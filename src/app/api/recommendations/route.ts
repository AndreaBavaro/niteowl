import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Bar, UserProfile, MusicGenre } from '@/lib/types';

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

  // Trending in Area - Bars in user's neighbourhood
  const trendingInArea = user.location_neighbourhood
    ? bars.filter(bar => 
        bar.neighbourhood?.toLowerCase().includes(user.location_neighbourhood!.toLowerCase())
      ).slice(0, 10)
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
          location_neighbourhood,
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
      location_neighbourhood: preferences.location_neighbourhood,
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
