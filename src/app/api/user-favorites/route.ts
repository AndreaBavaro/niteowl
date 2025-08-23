import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { 
  getMockUserFavorites, 
  saveMockFavorite, 
  removeMockFavorite,
  mockUserFavorites 
} from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }
    
    // Return mock data in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('MOCK MODE: Returning mock favorites');
      
      // Try to get saved favorites from localStorage simulation
      let favorites = getMockUserFavorites(userId);
      
      // If no saved favorites, use default mock data
      if (favorites.length === 0) {
        favorites = mockUserFavorites.filter(fav => fav.user_id === userId);
      }
      
      return NextResponse.json({ 
        favorites,
        count: favorites.length 
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

    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        user_id,
        bar_id,
        created_at,
        bars (
          id,
          name,
          slug,
          neighbourhood,
          address,
          description,
          typical_lineup_min,
          cover_frequency,
          typical_vibe,
          top_music,
          age_group_min,
          has_rooftop,
          has_patio,
          has_dancefloor,
          live_music_days,
          has_food,
          capacity_size
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    return NextResponse.json({ favorites: favorites || [] });

  } catch (error) {
    console.error('Error in favorites GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    const { bar_id } = await request.json();
    
    if (!bar_id) {
      return NextResponse.json({ error: 'Bar ID is required' }, { status: 400 });
    }

    // Handle mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('MOCK MODE: Adding mock favorite');
      
      // Check if already favorited
      const existingFavorites = getMockUserFavorites(userId);
      if (existingFavorites.some(fav => fav.bar_id === bar_id)) {
        return NextResponse.json(
          { error: 'Bar is already in favorites' },
          { status: 400 }
        );
      }
      
      // Create new favorite with mock bar data
      const mockFavorite = {
        id: `fav-${Date.now()}`,
        user_id: userId,
        bar_id: bar_id,
        created_at: new Date().toISOString(),
        bar: {
          id: bar_id,
          name: 'Mock Bar',
          slug: 'mock-bar',
          neighbourhood: 'King West',
          address: '123 Mock St, Toronto, ON',
          description: 'A mock bar for testing.',
          typical_vibe: 'Testing vibes',
          top_music: ['House'],
          has_rooftop: false,
          has_patio: false,
          has_dancefloor: true
        }
      };
      
      // Save to mock storage
      saveMockFavorite(mockFavorite);
      
      return NextResponse.json({ 
        message: 'Favorite added successfully' 
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

    // Check if already favorited
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('bar_id', bar_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Bar already in favorites' }, { status: 409 });
    }

    const { data: favorite, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        bar_id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite:', error);
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }

    return NextResponse.json({ favorite });

  } catch (error) {
    console.error('Error in favorites POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const barId = searchParams.get('bar_id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    if (!barId) {
      return NextResponse.json({ error: 'Bar ID is required' }, { status: 400 });
    }

    // Handle mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('MOCK MODE: Removing mock favorite for user:', userId, 'bar:', barId);
      
      try {
        // Remove from mock storage
        removeMockFavorite(userId, barId);
        console.log('MOCK MODE: Successfully removed favorite');
        
        return NextResponse.json({ 
          success: true,
          message: 'Favorite removed successfully' 
        });
      } catch (mockError) {
        console.error('MOCK MODE: Error removing favorite:', mockError);
        return NextResponse.json({ 
          error: 'Failed to remove favorite in mock mode',
          details: mockError instanceof Error ? mockError.message : 'Unknown error'
        }, { status: 500 });
      }
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

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('bar_id', barId);

    if (error) {
      console.error('Error removing favorite:', error);
      return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in favorites DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
