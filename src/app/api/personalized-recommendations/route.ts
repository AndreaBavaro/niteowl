import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Bar, UserProfile, UserBarVisit, UserFavorite, MusicGenre } from '@/lib/types';

interface RecommendationScore {
  bar: Bar;
  totalScore: number;
  musicMatchScore: number;
  neighborhoodMatchScore: number;
  similarityScore: number;
  explorationBonus: number;
  communityScore: number;
  reasoning: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.headers.get('x-user-id');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }
    
    // Return mock recommendations in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const mockRecommendations: RecommendationScore[] = [
        {
          bar: {
            id: 'bar-3',
            name: 'TOYBOX',
            slug: 'toybox',
            neighbourhood: 'King West',
            address: '473 Adelaide St W',
            description: 'Underground techno club with immersive sound system',
            typical_lineup_min: '15-30 min',
            longest_line_days: ['Fri', 'Sat'],
            cover_frequency: 'Yes-always',
            cover_amount: '$10-$20',
            typical_vibe: 'Underground techno scene',
            top_music: ['House', 'EDM'],
            age_group_min: '22-25',
            service_rating: 8.2,
            live_music_days: [],
            has_patio: false,
            has_rooftop: false,
            has_dancefloor: true,
            karaoke_nights: [],
            has_food: false,
            capacity_size: 'Medium (50-150)',
            has_pool_table: false,
            has_arcade_games: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          totalScore: 8.7,
          musicMatchScore: 9.5,
          neighborhoodMatchScore: 9.0,
          similarityScore: 8.5,
          explorationBonus: 7.0,
          communityScore: 8.2,
          reasoning: [
            'Perfect music match: House and EDM',
            'Located in your preferred King West area',
            'Similar vibe to your favorite bars',
            'Highly rated by community (8.2/10)'
          ]
        },
        {
          bar: {
            id: 'bar-4',
            name: 'Coda',
            slug: 'coda',
            neighbourhood: 'Entertainment District',
            address: '794 Bathurst St',
            description: 'Intimate cocktail lounge with live jazz',
            typical_lineup_min: '0-10 min',
            longest_line_days: ['Thu', 'Fri'],
            cover_frequency: 'Sometimes',
            cover_amount: 'Under $10',
            typical_vibe: 'Sophisticated and intimate',
            top_music: ['Jazz', 'City-pop'],
            age_group_min: '25-30',
            service_rating: 9.1,
            live_music_days: ['Wed', 'Thu', 'Fri'],
            has_patio: true,
            has_rooftop: false,
            has_dancefloor: false,
            karaoke_nights: [],
            has_food: true,
            capacity_size: 'Intimate (<50)',
            has_pool_table: false,
            has_arcade_games: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          totalScore: 7.8,
          musicMatchScore: 6.0,
          neighborhoodMatchScore: 8.0,
          similarityScore: 6.5,
          explorationBonus: 9.5,
          communityScore: 9.1,
          reasoning: [
            'Different music style for exploration (Jazz)',
            'In your secondary preferred area',
            'Excellent service rating (9.1/10)',
            'Intimate setting - new experience type'
          ]
        }
      ];
      
      return NextResponse.json({ 
        recommendations: mockRecommendations.slice(0, limit),
        algorithm_version: 'weighted_scoring_v1'
      });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Get user profile and preferences
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's favorites
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('bar_id, bars(*)')
      .eq('user_id', userId);

    // Get user's visits (especially high-rated ones)
    const { data: visits } = await supabase
      .from('user_bar_visits')
      .select('bar_id, experience_rating, bars(*)')
      .eq('user_id', userId)
      .gte('experience_rating', 7); // Only consider good experiences

    // Get all bars that user hasn't visited
    const visitedBarIds = visits?.map(v => v.bar_id) || [];
    const favoriteBarIds = favorites?.map(f => f.bar_id) || [];
    const excludeBarIds = [...new Set([...visitedBarIds, ...favoriteBarIds])];

    let barsQuery = supabase
      .from('bars')
      .select('*');
    
    if (excludeBarIds.length > 0) {
      barsQuery = barsQuery.not('id', 'in', `(${excludeBarIds.join(',')})`);
    }

    const { data: candidateBars } = await barsQuery;

    if (!candidateBars || candidateBars.length === 0) {
      return NextResponse.json({ 
        recommendations: [],
        message: 'No new bars to recommend'
      });
    }

    // Calculate recommendations using weighted scoring algorithm
    const recommendations = calculateRecommendations(
      candidateBars,
      userProfile,
      favorites?.map(f => f.bars) || [],
      visits?.map(v => ({ ...v.bars, rating: v.experience_rating })) || []
    );

    // Sort by total score and return top results
    const sortedRecommendations = recommendations
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);

    return NextResponse.json({ 
      recommendations: sortedRecommendations,
      algorithm_version: 'weighted_scoring_v1'
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateRecommendations(
  candidateBars: Bar[],
  userProfile: UserProfile,
  favoritesBars: any[],
  highRatedVisits: any[]
): RecommendationScore[] {
  return candidateBars.map(bar => {
    const reasoning: string[] = [];
    
    // 1. Music Match Score (30% weight)
    const musicMatchScore = calculateMusicMatch(bar, userProfile, reasoning);
    
    // 2. Neighborhood Match Score (25% weight)
    const neighborhoodMatchScore = calculateNeighborhoodMatch(bar, userProfile, reasoning);
    
    // 3. Similarity Score (20% weight)
    const similarityScore = calculateSimilarityScore(bar, favoritesBars, highRatedVisits, reasoning);
    
    // 4. Exploration Bonus (15% weight)
    const explorationBonus = calculateExplorationBonus(bar, favoritesBars, reasoning);
    
    // 5. Community Score (10% weight)
    const communityScore = bar.service_rating || 5;
    if (communityScore >= 8) {
      reasoning.push(`Highly rated by community (${communityScore}/10)`);
    }
    
    // Calculate weighted total score
    const totalScore = (
      musicMatchScore * 0.30 +
      neighborhoodMatchScore * 0.25 +
      similarityScore * 0.20 +
      explorationBonus * 0.15 +
      communityScore * 0.10
    );

    return {
      bar,
      totalScore: Math.round(totalScore * 10) / 10,
      musicMatchScore,
      neighborhoodMatchScore,
      similarityScore,
      explorationBonus,
      communityScore,
      reasoning
    };
  });
}

function calculateMusicMatch(bar: Bar, userProfile: UserProfile, reasoning: string[]): number {
  if (!userProfile.preferred_music || !bar.top_music) return 5;
  
  const userGenres = userProfile.preferred_music;
  const barGenres = bar.top_music;
  
  const matchingGenres = userGenres.filter(genre => barGenres.includes(genre));
  const matchPercentage = matchingGenres.length / userGenres.length;
  
  if (matchPercentage >= 0.5) {
    reasoning.push(`Great music match: ${matchingGenres.join(', ')}`);
    return 8 + (matchPercentage * 2); // 8-10 range
  } else if (matchPercentage > 0) {
    reasoning.push(`Some music overlap: ${matchingGenres.join(', ')}`);
    return 6 + (matchPercentage * 2); // 6-8 range
  } else {
    reasoning.push(`Different music style for exploration (${barGenres.join(', ')})`);
    return 4; // Still some points for exploration
  }
}

function calculateNeighborhoodMatch(bar: Bar, userProfile: UserProfile, reasoning: string[]): number {
  if (!bar.neighbourhood) return 5;
  
  if (bar.neighbourhood === userProfile.first_neighbourhood) {
    reasoning.push(`Located in your primary area: ${bar.neighbourhood}`);
    return 10;
  } else if (bar.neighbourhood === userProfile.second_neighbourhood) {
    reasoning.push(`Located in your secondary area: ${bar.neighbourhood}`);
    return 8;
  } else if (bar.neighbourhood === userProfile.third_neighbourhood) {
    reasoning.push(`Located in your third preferred area: ${bar.neighbourhood}`);
    return 6;
  } else {
    return 4; // Still some points for exploration
  }
}

function calculateSimilarityScore(
  bar: Bar, 
  favoritesBars: any[], 
  highRatedVisits: any[], 
  reasoning: string[]
): number {
  if (favoritesBars.length === 0 && highRatedVisits.length === 0) return 5;
  
  const allLikedBars = [...favoritesBars, ...highRatedVisits];
  let totalSimilarity = 0;
  let matches = 0;
  
  // Check for similar features
  const barFeatures = {
    has_patio: bar.has_patio,
    has_rooftop: bar.has_rooftop,
    has_dancefloor: bar.has_dancefloor,
    has_food: bar.has_food,
    capacity_size: bar.capacity_size,
    cover_frequency: bar.cover_frequency
  };
  
  allLikedBars.forEach(likedBar => {
    let similarity = 0;
    let featureMatches = [];
    
    // Compare features
    if (barFeatures.has_patio === likedBar.has_patio && barFeatures.has_patio) {
      similarity += 1;
      featureMatches.push('patio');
    }
    if (barFeatures.has_rooftop === likedBar.has_rooftop && barFeatures.has_rooftop) {
      similarity += 1;
      featureMatches.push('rooftop');
    }
    if (barFeatures.has_dancefloor === likedBar.has_dancefloor && barFeatures.has_dancefloor) {
      similarity += 1;
      featureMatches.push('dancefloor');
    }
    if (barFeatures.capacity_size === likedBar.capacity_size) {
      similarity += 1;
      featureMatches.push('similar size');
    }
    
    if (featureMatches.length > 0) {
      reasoning.push(`Similar features to your favorites: ${featureMatches.join(', ')}`);
    }
    
    totalSimilarity += similarity;
    matches++;
  });
  
  const avgSimilarity = matches > 0 ? totalSimilarity / matches : 0;
  return Math.min(avgSimilarity * 2 + 4, 10); // Scale to 4-10 range
}

function calculateExplorationBonus(bar: Bar, favoritesBars: any[], reasoning: string[]): number {
  // Encourage trying different types of venues
  const favoriteVibes = favoritesBars.map(b => b.typical_vibe || '').filter(Boolean);
  const favoriteCapacities = favoritesBars.map(b => b.capacity_size || '').filter(Boolean);
  
  let explorationScore = 5; // Base score
  
  // Bonus for different vibe
  if (!favoriteVibes.includes(bar.typical_vibe)) {
    explorationScore += 2;
    reasoning.push(`New experience: ${bar.typical_vibe}`);
  }
  
  // Bonus for different capacity
  if (!favoriteCapacities.includes(bar.capacity_size)) {
    explorationScore += 1;
  }
  
  // Bonus for unique features
  if (bar.has_rooftop && !favoritesBars.some(b => b.has_rooftop)) {
    explorationScore += 1;
    reasoning.push('New feature: rooftop');
  }
  
  if (bar.live_music_days.length > 0 && !favoritesBars.some(b => b.live_music_days?.length > 0)) {
    explorationScore += 1;
    reasoning.push('New feature: live music');
  }
  
  return Math.min(explorationScore, 10);
}
