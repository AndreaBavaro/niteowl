import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Format phone number - remove + sign for database consistency
    const cleanPhone = phone.replace(/^\+/, '');

    // Use service role key for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Query user with preferences using service role client
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        phone,
        full_name,
        access_status,
        last_active_at,
        user_preferences (
          location_neighbourhood,
          preferred_music,
          age
        )
      `)
      .eq('phone', cleanPhone)
      .maybeSingle();

    if (userError) {
      console.error('Error querying user:', userError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const userExists = !!userData;
    const hasRecentSession = userData?.last_active_at ? 
      (new Date().getTime() - new Date(userData.last_active_at).getTime()) < (15 * 60 * 1000) : // 15 minutes
      false;
    
    const hasPreferences = userData?.user_preferences && userData.user_preferences.length > 0;
    const accessStatus = userData?.access_status || 'pending';

    // Determine next step based on user state
    let nextStep = 'new'; // Default for new users
    
    if (userExists) {
      if (accessStatus === 'pending') {
        // Pending users: preferences -> waiting
        nextStep = hasPreferences ? 'waiting' : 'preferences';
      } else if (accessStatus === 'approved') {
        // Approved users: preferences -> for-you (access status doesn't matter for routing)
        nextStep = hasPreferences ? 'for-you' : 'preferences';
      } else if (accessStatus === 'rejected') {
        nextStep = 'rejected';
      }
    }

    return NextResponse.json({
      userExists,
      accessStatus,
      hasRecentSession,
      hasPreferences,
      nextStep,
      skipOTP: hasRecentSession, // Skip OTP if user has recent session
      user: userData ? {
        id: userData.id,
        phone: userData.phone,
        full_name: userData.full_name,
        access_status: userData.access_status,
      } : null
    });

  } catch (error) {
    console.error('Error in check-phone API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
