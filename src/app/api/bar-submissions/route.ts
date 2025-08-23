import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { CreateBarSubmissionSchema, CreateBarSubmissionInput } from '@/lib/types';

// Helper function to generate URL-friendly slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Helper function to check for duplicates
async function checkForDuplicates(supabase: any, name: string, neighbourhood: string, address?: string) {
  const normalizedName = name.toLowerCase().trim();
  const normalizedNeighbourhood = neighbourhood.toLowerCase().trim();
  
  // Check existing bars
  const { data: existingBars } = await supabase
    .from('bars')
    .select('id, name, neighbourhood, address')
    .ilike('name', `%${normalizedName}%`)
    .ilike('neighbourhood', `%${normalizedNeighbourhood}%`);

  // Check pending submissions
  const { data: pendingSubmissions } = await supabase
    .from('bar_submissions')
    .select('id, name, neighbourhood, address, status')
    .ilike('name', `%${normalizedName}%`)
    .ilike('neighbourhood', `%${normalizedNeighbourhood}%`)
    .in('status', ['pending', 'approved']);

  const duplicates = {
    existingBars: existingBars || [],
    pendingSubmissions: pendingSubmissions || []
  };

  // More sophisticated duplicate detection
  const isDuplicate = (item: any) => {
    const itemName = item.name.toLowerCase().trim();
    const itemNeighbourhood = item.neighbourhood?.toLowerCase().trim() || '';
    
    // Exact name match in same neighbourhood
    if (itemName === normalizedName && itemNeighbourhood === normalizedNeighbourhood) {
      return true;
    }
    
    // Similar name (Levenshtein distance or contains)
    if (itemName.includes(normalizedName) || normalizedName.includes(itemName)) {
      if (itemNeighbourhood === normalizedNeighbourhood) {
        return true;
      }
    }
    
    return false;
  };

  const duplicateBar = duplicates.existingBars.find(isDuplicate);
  const duplicateSubmission = duplicates.pendingSubmissions.find(isDuplicate);

  return {
    isDuplicate: !!(duplicateBar || duplicateSubmission),
    duplicateBar,
    duplicateSubmission,
    allDuplicates: duplicates
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = CreateBarSubmissionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data: CreateBarSubmissionInput = validationResult.data;

    // Return mock response in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('MOCK MODE: Simulating bar submission');
      
      // Simulate duplicate check
      const mockDuplicates = [
        { name: 'rebel nightclub', neighbourhood: 'entertainment district' },
        { name: 'toybox', neighbourhood: 'king west' },
        { name: 'rebel', neighbourhood: 'entertainment district' }
      ];
      
      const normalizedName = data.name.toLowerCase().trim();
      const normalizedNeighbourhood = data.neighbourhood.toLowerCase().trim();
      
      const isDuplicate = mockDuplicates.some(mock => 
        (mock.name.includes(normalizedName) || normalizedName.includes(mock.name)) &&
        mock.neighbourhood === normalizedNeighbourhood
      );

      if (isDuplicate) {
        return NextResponse.json({
          error: 'Duplicate detected',
          message: `A bar similar to "${data.name}" already exists in ${data.neighbourhood}. Please check existing bars before submitting.`,
          duplicates: {
            existingBars: [{ id: 'mock-bar-1', name: 'Similar Bar', neighbourhood: data.neighbourhood }],
            pendingSubmissions: []
          }
        }, { status: 409 });
      }

      // Simulate successful submission
      const mockSubmission = {
        id: 'mock-submission-' + Date.now(),
        user_id: 'mock-user-id-12345',
        ...data,
        slug: generateSlug(data.name),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        message: 'Bar submission received! We\'ll review it and add it to the app if approved.',
        submission: mockSubmission
      });
    }

    // Get user ID from request headers (set by auth middleware)
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check for duplicates
    const duplicateCheck = await checkForDuplicates(
      supabase, 
      data.name, 
      data.neighbourhood, 
      data.address
    );

    if (duplicateCheck.isDuplicate) {
      return NextResponse.json({
        error: 'Duplicate detected',
        message: `A bar similar to "${data.name}" already exists in ${data.neighbourhood}. Please check existing bars before submitting.`,
        duplicates: duplicateCheck.allDuplicates
      }, { status: 409 });
    }

    // Generate slug
    const slug = generateSlug(data.name);

    // Insert submission
    const { data: submission, error } = await supabase
      .from('bar_submissions')
      .insert({
        user_id: userId,
        ...data,
        slug,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating bar submission:', error);
      return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Bar submission received! We\'ll review it and add it to the app if approved.',
      submission
    });

  } catch (error) {
    console.error('Error in bar submissions API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    // Return mock data in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('MOCK MODE: Returning mock submissions');
      
      const mockSubmissions = [
        {
          id: 'mock-submission-1',
          user_id: 'mock-user-id-12345',
          name: 'Cool New Bar',
          slug: 'cool-new-bar',
          neighbourhood: 'Queen West',
          address: '123 Queen St W',
          description: 'A trendy new spot with great vibes',
          typical_lineup_min: '0-10 min',
          longest_line_days: [],
          cover_frequency: 'Sometimes',
          typical_vibe: 'Trendy and energetic',
          top_music: ['House', 'EDM'],
          age_group_min: '22-25',
          live_music_days: ['Fri', 'Sat'],
          has_patio: true,
          has_rooftop: false,
          has_dancefloor: true,
          karaoke_nights: [],
          has_food: true,
          capacity_size: 'Medium (50-150)',
          has_pool_table: false,
          has_arcade_games: false,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-submission-2',
          user_id: 'mock-user-id-67890',
          name: 'Underground Lounge',
          slug: 'underground-lounge',
          neighbourhood: 'King West',
          address: '456 King St W',
          description: 'Intimate underground venue with craft cocktails',
          typical_lineup_min: '15-30 min',
          longest_line_days: ['Fri', 'Sat'],
          cover_frequency: 'Yes-always',
          cover_amount: '$10-$20',
          typical_vibe: 'Intimate and sophisticated',
          top_music: ['Jazz', 'City-pop'],
          age_group_min: '25-30',
          live_music_days: ['Wed', 'Thu'],
          has_patio: false,
          has_rooftop: false,
          has_dancefloor: false,
          karaoke_nights: [],
          has_food: true,
          capacity_size: 'Intimate (<50)',
          has_pool_table: false,
          has_arcade_games: false,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      let filteredSubmissions = mockSubmissions;
      
      if (userId) {
        filteredSubmissions = filteredSubmissions.filter(s => s.user_id === userId);
      }
      
      if (status) {
        filteredSubmissions = filteredSubmissions.filter(s => s.status === status);
      }
      
      return NextResponse.json({
        submissions: filteredSubmissions
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from('bar_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    return NextResponse.json({ submissions: submissions || [] });

  } catch (error) {
    console.error('Error in submissions GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
