import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { UserBarVisitSchema } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.headers.get('x-user-id');
    const barId = searchParams.get('bar_id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }
    
    // Return mock data in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const mockVisits = [
        {
          id: 'visit-1',
          user_id: userId,
          bar_id: 'bar-1',
          visit_date: '2024-01-20',
          experience_rating: 8,
          comment: 'Great night! Amazing rooftop views and good music.',
          reported_wait_time: '15-30 min',
          reported_cover_charge: '$10-$20',
          reported_music_genres: ['House', 'EDM'],
          reported_vibe: 'Trendy and energetic',
          reported_age_group: '22-25',
          reported_service_rating: 7,
          time_of_visit: 'peak_night',
          group_size: 'small_group',
          special_event: 'DJ Night',
          photos: [],
          created_at: '2024-01-21T10:30:00Z',
          updated_at: '2024-01-21T10:30:00Z',
          bar: {
            id: 'bar-1',
            name: 'The Hoxton',
            slug: 'the-hoxton',
            neighbourhood: 'King West',
            address: '303 King St W'
          }
        },
        {
          id: 'visit-2',
          user_id: userId,
          bar_id: 'bar-2',
          visit_date: '2024-01-15',
          experience_rating: 9,
          comment: 'Incredible energy! Best EDM night I\'ve experienced.',
          reported_wait_time: '30+ min',
          reported_cover_charge: 'Over $20',
          reported_music_genres: ['EDM'],
          reported_vibe: 'High-energy dance club',
          reported_age_group: '18-21',
          reported_service_rating: 8,
          time_of_visit: 'peak_night',
          group_size: 'couple',
          special_event: 'Deadmau5 Concert',
          photos: [],
          created_at: '2024-01-16T09:15:00Z',
          updated_at: '2024-01-16T09:15:00Z',
          bar: {
            id: 'bar-2',
            name: 'Rebel Nightclub',
            slug: 'rebel-nightclub',
            neighbourhood: 'Entertainment District',
            address: '11 Polson St'
          }
        }
      ];
      
      let filteredVisits = mockVisits;
      if (barId) {
        filteredVisits = mockVisits.filter(v => v.bar_id === barId);
      }
      
      return NextResponse.json({ visits: filteredVisits });
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

    let query = supabase
      .from('user_bar_visits')
      .select(`
        id,
        user_id,
        bar_id,
        visit_date,
        experience_rating,
        comment,
        reported_wait_time,
        reported_cover_charge,
        reported_music_genres,
        reported_vibe,
        reported_age_group,
        reported_service_rating,
        time_of_visit,
        group_size,
        special_event,
        photos,
        created_at,
        updated_at,
        bars (
          id,
          name,
          slug,
          neighbourhood,
          address
        )
      `)
      .eq('user_id', userId)
      .order('visit_date', { ascending: false });

    if (barId) {
      query = query.eq('bar_id', barId);
    }

    const { data: visits, error } = await query;

    if (error) {
      console.error('Error fetching visits:', error);
      return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 });
    }

    return NextResponse.json({ visits: visits || [] });

  } catch (error) {
    console.error('Error in visits GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = UserBarVisitSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const visitData = validationResult.data;

    // Handle mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const mockVisit = {
        id: `visit-${Date.now()}`,
        user_id: userId,
        ...visitData,
        photos: [], // Photos would be handled separately
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return NextResponse.json({ visit: mockVisit });
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

    const { data: visit, error } = await supabase
      .from('user_bar_visits')
      .insert({
        user_id: userId,
        ...visitData,
        photos: [] // Photos would be handled separately via file upload
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating visit:', error);
      return NextResponse.json({ error: 'Failed to create visit' }, { status: 500 });
    }

    // TODO: Process crowd-sourced data for potential bar updates
    // This would involve checking if the reported data conflicts with current bar data
    // and creating entries in the bar_data_conflicts table for admin review

    return NextResponse.json({ visit });

  } catch (error) {
    console.error('Error in visits POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visit_id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    if (!visitId) {
      return NextResponse.json({ error: 'Visit ID is required' }, { status: 400 });
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = UserBarVisitSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }

    const visitData = validationResult.data;

    // Handle mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const mockVisit = {
        id: visitId,
        user_id: userId,
        ...visitData,
        photos: [],
        created_at: '2024-01-21T10:30:00Z',
        updated_at: new Date().toISOString()
      };
      
      return NextResponse.json({ visit: mockVisit });
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

    const { data: visit, error } = await supabase
      .from('user_bar_visits')
      .update({
        ...visitData,
        updated_at: new Date().toISOString()
      })
      .eq('id', visitId)
      .eq('user_id', userId) // Ensure user can only update their own visits
      .select()
      .single();

    if (error) {
      console.error('Error updating visit:', error);
      return NextResponse.json({ error: 'Failed to update visit' }, { status: 500 });
    }

    return NextResponse.json({ visit });

  } catch (error) {
    console.error('Error in visits PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visit_id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 401 });
    }

    if (!visitId) {
      return NextResponse.json({ error: 'Visit ID is required' }, { status: 400 });
    }

    // Handle mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return NextResponse.json({ success: true });
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
      .from('user_bar_visits')
      .delete()
      .eq('id', visitId)
      .eq('user_id', userId); // Ensure user can only delete their own visits

    if (error) {
      console.error('Error deleting visit:', error);
      return NextResponse.json({ error: 'Failed to delete visit' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in visits DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
