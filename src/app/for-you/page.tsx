import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ForYouPageClient from '@/components/ForYouPageClient';
import { 
  Bar, 
  LineupTimeRange, 
  DayOfWeek, 
  CoverFrequency, 
  CoverAmount, 
  MusicGenre, 
  AgeGroup 
} from '@/lib/types';

// Server component to get user and recommendations
async function getUserAndRecommendations() {
  // Handle mock mode
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const mockUser = {
      id: 'mock-user-id-12345',
      email: 'mock.user@example.com',
      phone: '+11234567890',
      full_name: 'Mock User',
      avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=mock-user`,
      first_neighbourhood: 'King West',
      second_neighbourhood: 'Entertainment District',
      third_neighbourhood: 'Queen West',
      preferred_music: ['House', 'Rap'],
      age: 25,
      access_status: 'approved',
      loyalty_points: 100,
      last_active_at: new Date().toISOString(),
      created_at: new Date('2023-01-01T00:00:00Z').toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockRecommendations = {
      // Legacy sections (keeping for compatibility)
      perfectForTonight: [],
      yourVibe: [],
      quickEntry: [],
      trendingInArea: [],
      // New discovery-focused sections
      discoverTonight: [
        {
          id: 'bar-1',
          name: 'Rebel Nightclub',
          slug: 'rebel-nightclub',
          neighbourhood: 'Entertainment District',
          address: '69 Polson St, Toronto, ON',
          description: 'Toronto\'s largest nightclub with world-class DJs.',
          typical_lineup_min: '30+ min' as LineupTimeRange,
          longest_line_days: ['Fri', 'Sat'] as DayOfWeek[],
          cover_frequency: 'Yes-always' as CoverFrequency,
          cover_amount: 'Over $20' as CoverAmount,
          typical_vibe: 'High-energy dance club',
          top_music: ['House', 'EDM'] as MusicGenre[],
          age_group_min: '18-21' as AgeGroup,
          age_group_max: '25-30' as AgeGroup,
          service_rating: 4.2,
          live_music_days: [] as DayOfWeek[],
          has_patio: false,
          has_rooftop: false,
          has_dancefloor: true,
          karaoke_nights: [],
          has_food: true,
          has_pool_table: false,
          has_arcade_games: false,
          // Real-time data
          current_wait_time: '25 min',
          live_events: ['Live DJ until 3AM', 'VIP tables available'],
          crowd_level: 'busy' as const,
          special_offers: ['$8 shots until midnight'],
          booking_url: 'https://rebelnightclub.com/reservations',
          is_featured: true,
          visit_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'bar-3',
          name: 'The Hoxton',
          slug: 'the-hoxton',
          neighbourhood: 'King West',
          address: '69 Bathurst St, Toronto, ON',
          description: 'Trendy rooftop bar with craft cocktails and city views.',
          typical_lineup_min: '15-30 min' as LineupTimeRange,
          longest_line_days: ['Thu', 'Fri', 'Sat'] as DayOfWeek[],
          cover_frequency: 'No cover' as CoverFrequency,
          typical_vibe: 'Trendy rooftop vibes',
          top_music: ['House', 'Mixed/Variety'] as MusicGenre[],
          age_group_min: '22-25' as AgeGroup,
          age_group_max: '25-30' as AgeGroup,
          service_rating: 4.6,
          live_music_days: ['Wed', 'Thu'] as DayOfWeek[],
          has_patio: true,
          has_rooftop: true,
          has_dancefloor: false,
          karaoke_nights: [],
          has_food: true,
          has_pool_table: false,
          has_arcade_games: false,
          // Real-time data
          current_wait_time: 'No wait',
          live_events: ['Happy Hour until 8PM', 'Live acoustic set 9PM'],
          crowd_level: 'moderate' as const,
          special_offers: ['2-for-1 cocktails until 8PM'],
          booking_url: 'https://thehoxtonbar.com/book',
          is_featured: false,
          visit_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      hiddenGems: [
        {
          id: 'bar-4',
          name: 'Lost & Found',
          slug: 'lost-and-found',
          neighbourhood: 'Kensington Market',
          address: '577 College St, Toronto, ON',
          description: 'Hidden speakeasy with craft cocktails and intimate vibes.',
          typical_lineup_min: '0-10 min' as LineupTimeRange,
          longest_line_days: ['Sat'] as DayOfWeek[],
          cover_frequency: 'No cover' as CoverFrequency,
          typical_vibe: 'Intimate speakeasy',
          top_music: ['Jazz', 'Mixed/Variety'] as MusicGenre[],
          age_group_min: '25-30' as AgeGroup,
          service_rating: 4.8,
          live_music_days: ['Fri', 'Sat'] as DayOfWeek[],
          has_patio: false,
          has_rooftop: false,
          has_dancefloor: false,
          karaoke_nights: [],
          has_food: true,
          has_pool_table: false,
          has_arcade_games: false,
          // Real-time data
          current_wait_time: 'No wait',
          live_events: ['Jazz trio tonight 10PM', 'Cocktail masterclass 8PM'],
          crowd_level: 'quiet' as const,
          special_offers: ['$12 signature cocktails'],
          is_featured: true,
          visit_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ],
      yourRegulars: [
        {
          id: 'bar-2',
          name: 'TOYBOX',
          slug: 'toybox',
          neighbourhood: 'King West',
          address: '473 Adelaide St W, Toronto, ON',
          description: 'Upscale nightclub with VIP bottle service.',
          typical_lineup_min: '15-30 min' as LineupTimeRange,
          longest_line_days: ['Fri', 'Sat'] as DayOfWeek[],
          cover_frequency: 'Sometimes' as CoverFrequency,
          cover_amount: '$10-$20' as CoverAmount,
          typical_vibe: 'Upscale and exclusive',
          top_music: ['Hip-hop', 'Top 40'] as MusicGenre[],
          age_group_min: '22-25' as AgeGroup,
          age_group_max: '25-30' as AgeGroup,
          service_rating: 4.5,
          live_music_days: [] as DayOfWeek[],
          has_patio: false,
          has_rooftop: false,
          has_dancefloor: true,
          karaoke_nights: [],
          has_food: false,
          has_pool_table: false,
          has_arcade_games: false,
          // Real-time data
          current_wait_time: '20 min',
          live_events: ['Guest DJ tonight'],
          crowd_level: 'busy' as const,
          visit_count: 3,
          last_visited: '2024-07-15T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      ]
    };

    return { user: mockUser, recommendations: mockRecommendations };
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    // Get current user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      console.error('Auth error:', authError);
      return { user: null, recommendations: null };
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !userProfile) {
      console.error('Profile error:', profileError);
      return { user: null, recommendations: null };
    }

    // Fetch recommendations
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/recommendations?userId=${userProfile.id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    let recommendations = {
      // Legacy sections
      perfectForTonight: [],
      yourVibe: [],
      quickEntry: [],
      trendingInArea: [],
      // New discovery-focused sections
      discoverTonight: [],
      hiddenGems: [],
      yourRegulars: []
    };

    if (response.ok) {
      const data = await response.json();
      recommendations = data.recommendations || recommendations;
    }

    return { user: userProfile, recommendations };
  } catch (error) {
    console.error('Error in getUserAndRecommendations:', error);
    return { user: null, recommendations: null };
  }
}

export default async function ForYouPage() {
  const { user, recommendations } = await getUserAndRecommendations();

  // User will be redirected by middleware if not authenticated
  // or if access_status is not approved
  if (!user || !recommendations) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your personalized experience...</div>
      </div>
    );
  }

  return <ForYouPageClient user={user} initialRecommendations={recommendations} />;
}
