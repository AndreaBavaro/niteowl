import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { CreateSubmissionReviewSchema, CreateSubmissionReviewInput } from '@/lib/types';

// Helper function to check if user can review submissions
async function canUserReview(supabase: any, userId: string): Promise<boolean> {
  const { data: user } = await supabase
    .from('users')
    .select('reviewer_status')
    .eq('id', userId)
    .single();
    
  return user?.reviewer_status === 'approved';
}

// Helper function to check if user already reviewed this submission
async function hasUserReviewed(supabase: any, submissionId: string, userId: string): Promise<boolean> {
  const { data: existingReview } = await supabase
    .from('submission_reviews')
    .select('id')
    .eq('submission_id', submissionId)
    .eq('reviewer_id', userId)
    .single();
    
  return !!existingReview;
}

// Helper function to update submission status based on reviews
async function updateSubmissionStatus(supabase: any, submissionId: string) {
  // Get all reviews for this submission
  const { data: reviews } = await supabase
    .from('submission_reviews')
    .select('decision')
    .eq('submission_id', submissionId);

  if (!reviews || reviews.length < 5) {
    // Not enough reviews yet, keep pending
    return;
  }

  // Count decisions
  const approvals = reviews.filter((r: any) => r.decision === 'approve').length;
  const rejections = reviews.filter((r: any) => r.decision === 'reject').length;
  
  let newStatus = 'pending';
  
  if (approvals >= 3) {
    // Majority approval (3 out of 5)
    newStatus = 'approved';
  } else if (rejections >= 3) {
    // Majority rejection (3 out of 5)
    newStatus = 'rejected';
  }
  // If no clear majority, keep pending for admin review

  if (newStatus !== 'pending') {
    await supabase
      .from('bar_submissions')
      .update({ 
        status: newStatus,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', submissionId);
      
    // Create notification for submitter
    const { data: submission } = await supabase
      .from('bar_submissions')
      .select('user_id, name')
      .eq('id', submissionId)
      .single();
      
    if (submission) {
      await supabase
        .from('review_notifications')
        .insert({
          user_id: submission.user_id,
          submission_id: submissionId,
          notification_type: newStatus === 'approved' ? 'submission_approved' : 'submission_rejected',
          message: `Your submission "${submission.name}" has been ${newStatus} by the community.`
        });
    }
  }
}

// Helper function to award badges and update reviewer stats
async function updateReviewerStats(supabase: any, reviewerId: string) {
  // Increment review count
  await supabase
    .from('users')
    .update({ 
      total_reviews_completed: supabase.raw('total_reviews_completed + 1'),
      loyalty_points: supabase.raw('loyalty_points + 10') // 10 points per review
    })
    .eq('id', reviewerId);

  // Check for badge eligibility
  const { data: user } = await supabase
    .from('users')
    .select('total_reviews_completed')
    .eq('id', reviewerId)
    .single();

  if (user) {
    const reviewCount = user.total_reviews_completed + 1;
    let badgeToAward = null;

    if (reviewCount === 1) {
      badgeToAward = { type: 'first_review', name: 'First Review', description: 'Completed your first community review' };
    } else if (reviewCount === 10) {
      badgeToAward = { type: 'helpful_reviewer', name: 'Helpful Reviewer', description: 'Completed 10 community reviews' };
    } else if (reviewCount === 50) {
      badgeToAward = { type: 'community_champion', name: 'Community Champion', description: 'Completed 50 community reviews' };
    } else if (reviewCount === 100) {
      badgeToAward = { type: 'review_master', name: 'Review Master', description: 'Completed 100 community reviews' };
    }

    if (badgeToAward) {
      await supabase
        .from('user_badges')
        .insert({
          user_id: reviewerId,
          badge_type: badgeToAward.type,
          badge_name: badgeToAward.name,
          badge_description: badgeToAward.description
        });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = CreateSubmissionReviewSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data: CreateSubmissionReviewInput = validationResult.data;

    // Return mock response in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('MOCK MODE: Simulating submission review');
      
      const mockReview = {
        id: 'mock-review-' + Date.now(),
        submission_id: data.submission_id,
        reviewer_id: 'mock-user-id-12345',
        decision: data.decision,
        review_notes: data.review_notes,
        name_accurate: data.name_accurate,
        location_accurate: data.location_accurate,
        details_accurate: data.details_accurate,
        features_accurate: data.features_accurate,
        confidence_level: data.confidence_level,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        message: 'Review submitted successfully! Thank you for helping the community.',
        review: mockReview,
        points_earned: 10
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

    // Check if user can review
    const canReview = await canUserReview(supabase, userId);
    if (!canReview) {
      return NextResponse.json({ 
        error: 'Reviewer access required',
        message: 'You need reviewer status to review submissions. Contact an admin to request access.'
      }, { status: 403 });
    }

    // Check if user already reviewed this submission
    const alreadyReviewed = await hasUserReviewed(supabase, data.submission_id, userId);
    if (alreadyReviewed) {
      return NextResponse.json({ 
        error: 'Already reviewed',
        message: 'You have already reviewed this submission.'
      }, { status: 409 });
    }

    // Check if submission exists and is pending
    const { data: submission } = await supabase
      .from('bar_submissions')
      .select('status, user_id')
      .eq('id', data.submission_id)
      .single();

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Submission not reviewable',
        message: 'This submission has already been processed.'
      }, { status: 409 });
    }

    // Prevent users from reviewing their own submissions
    if (submission.user_id === userId) {
      return NextResponse.json({ 
        error: 'Cannot review own submission',
        message: 'You cannot review your own submission.'
      }, { status: 409 });
    }

    // Insert review
    const { data: review, error } = await supabase
      .from('submission_reviews')
      .insert({
        submission_id: data.submission_id,
        reviewer_id: userId,
        decision: data.decision,
        review_notes: data.review_notes,
        name_accurate: data.name_accurate,
        location_accurate: data.location_accurate,
        details_accurate: data.details_accurate,
        features_accurate: data.features_accurate,
        confidence_level: data.confidence_level
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }

    // Update reviewer stats and award badges
    await updateReviewerStats(supabase, userId);

    // Check if submission should be approved/rejected
    await updateSubmissionStatus(supabase, data.submission_id);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully! Thank you for helping the community.',
      review,
      points_earned: 10
    });

  } catch (error) {
    console.error('Error in submission reviews API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const userId = searchParams.get('userId');
    
    // Return mock data in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('MOCK MODE: Returning mock reviews');
      
      const mockReviews = [
        {
          id: 'mock-review-1',
          submission_id: submissionId || 'mock-submission-1',
          reviewer_id: 'mock-reviewer-1',
          decision: 'approve',
          review_notes: 'Looks good, I know this place!',
          name_accurate: true,
          location_accurate: true,
          details_accurate: true,
          features_accurate: true,
          confidence_level: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'mock-review-2',
          submission_id: submissionId || 'mock-submission-1',
          reviewer_id: 'mock-reviewer-2',
          decision: 'approve',
          review_notes: 'Accurate information, been there recently.',
          name_accurate: true,
          location_accurate: true,
          details_accurate: true,
          features_accurate: true,
          confidence_level: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return NextResponse.json({
        reviews: submissionId ? mockReviews.filter(r => r.submission_id === submissionId) : mockReviews,
        review_count: 2,
        approval_count: 2,
        rejection_count: 0,
        needs_changes_count: 0,
        reviews_needed: 3
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from('submission_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (submissionId) {
      query = query.eq('submission_id', submissionId);
    }

    if (userId) {
      query = query.eq('reviewer_id', userId);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    // Calculate review statistics if filtering by submission
    let stats = {};
    if (submissionId && reviews) {
      const approvals = reviews.filter(r => r.decision === 'approve').length;
      const rejections = reviews.filter(r => r.decision === 'reject').length;
      const needsChanges = reviews.filter(r => r.decision === 'needs_changes').length;
      
      stats = {
        review_count: reviews.length,
        approval_count: approvals,
        rejection_count: rejections,
        needs_changes_count: needsChanges,
        reviews_needed: Math.max(0, 5 - reviews.length)
      };
    }

    return NextResponse.json({ 
      reviews: reviews || [],
      ...stats
    });

  } catch (error) {
    console.error('Error in reviews GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
