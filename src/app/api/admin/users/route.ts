import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all users for admin panel
export async function GET() {
  try {
    // Simple localhost check - in production, you'd want proper admin auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Get all users with their preferences
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        user_preferences (
          location_neighbourhood,
          preferred_music,
          age
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({ users: users || [] });

  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update user status
export async function PATCH(request: NextRequest) {
  try {
    const { userId, status } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ error: 'Missing userId or status' }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Update user status
    const { error } = await supabase
      .from('users')
      .update({ 
        access_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user status:', error);
      return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in admin users PATCH API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
