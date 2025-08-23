import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(ip: string): string {
  return `rate_limit:${ip}`;
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '10');

  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (current.count >= maxRequests) {
    return true;
  }

  current.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip') || 'unknown';

    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, phone, age, neighborhood, musicGenres, referralCode } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create Supabase client with anon key (more secure for public endpoints)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('niteowl_waitlist')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered for waitlist' },
        { status: 409 }
      );
    }

    // Insert new signup with security measures
    const { data: newSignup, error } = await supabase
      .from('niteowl_waitlist')
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        age_group: age || null,
        neighborhood: neighborhood || null,
        music_genres: musicGenres || [],
        referral_code: referralCode?.trim() || null,
        ip_address: ip,
        user_agent: headersList.get('user-agent') || null,
      })
      .select('id, name, email, created_at')
      .single();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json(
        { error: 'Failed to join waitlist', debug: error.message },
        { status: 500 }
      );
    }

    // Return success response (minimal data for security)
    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        id: newSignup.id,
        name: newSignup.name,
        email: newSignup.email,
        joined_at: newSignup.created_at
      }
    });

  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Remove GET endpoint for security - no public stats access
