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
    const { name, email, phone, age, neighborhood, musicGenres, referredBy } = body;

    // Input validation and sanitization
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Sanitize and validate inputs
    const sanitizedName = name.trim().replace(/[<>\"'&]/g, '');
    const sanitizedEmail = email.toLowerCase().trim().replace(/[<>\"'&]/g, '');
    const sanitizedReferredBy = referredBy ? referredBy.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') : null;

    // Length validation
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (sanitizedEmail.length > 254) {
      return NextResponse.json(
        { error: 'Email address too long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone number formatting and validation
    let formattedPhone = null;
    if (phone) {
      const phoneDigits = phone.replace(/\D/g, '');
      
      if (phoneDigits.length === 10) {
        formattedPhone = `${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}`;
      } else if (phoneDigits.length === 11 && phoneDigits.startsWith('1')) {
        const tenDigits = phoneDigits.slice(1);
        formattedPhone = `${tenDigits.slice(0, 3)}-${tenDigits.slice(3, 6)}-${tenDigits.slice(6)}`;
      } else {
        return NextResponse.json(
          { error: 'Invalid phone number format. Please enter a 10-digit North American phone number' },
          { status: 400 }
        );
      }
    }

    // Create Supabase client with anon key (more secure for public endpoints)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check for existing user
    const { data: existingUser } = await supabase
      .from('waitlist_signups')
      .select('email')
      .eq('email', sanitizedEmail)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered for waitlist' },
        { status: 409 }
      );
    }

    // Validate referral code if provided
    let referrerData = null;
    if (sanitizedReferredBy) {
      const { data: referrer } = await supabase
        .from('waitlist_signups')
        .select('id, email, referral_count')
        .eq('referral_code', sanitizedReferredBy)
        .single();

      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code' },
          { status: 400 }
        );
      }
      referrerData = referrer;
    }

    // Generate unique referral code
    const generateReferralCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const userReferralCode = generateReferralCode();

    // Insert new signup with sanitized data
    const { data: newSignup, error } = await supabase
      .from('waitlist_signups')
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: formattedPhone,
        referral_code: userReferralCode,
        referred_by: referrerData?.id || null,
      })
      .select('id, name, email, created_at, referral_code')
      .single();

    // If signup successful and there was a referrer, increment their referral count
    if (!error && referrerData) {
      await supabase
        .from('waitlist_signups')
        .update({ 
          referral_count: (referrerData.referral_count || 0) + 1 
        })
        .eq('id', referrerData.id);
    }

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return NextResponse.json(
        { error: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      );
    }

    // Send welcome email via Edge Function
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-waitlist-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSignup.name,
          email: newSignup.email,
          phone: formattedPhone,
          referral_code: newSignup.referral_code,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send welcome email:', await emailResponse.text());
        // Don't fail the signup if email fails
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the signup if email fails
    }

    // Return success response (minimal data for security)
    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        referral_code: newSignup.referral_code
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
