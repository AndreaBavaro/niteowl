import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';
    
    // Return mock data in mock mode
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const mockAnalytics = {
        totalSubmissions: 47,
        pendingSubmissions: 8,
        approvedSubmissions: 32,
        rejectedSubmissions: 7,
        submissionsThisWeek: 12,
        
        totalReviews: 156,
        reviewsThisWeek: 34,
        avgReviewsPerSubmission: 4.2,
        avgReviewTime: 18.5,
        
        totalUsers: 1247,
        activeReviewers: 23,
        newUsersThisWeek: 18,
        topReviewers: [
          { id: '1', name: 'Alex Chen', total_reviews: 45, accuracy_score: 4.8 },
          { id: '2', name: 'Sarah Kim', total_reviews: 38, accuracy_score: 4.7 },
          { id: '3', name: 'Mike Johnson', total_reviews: 32, accuracy_score: 4.6 },
          { id: '4', name: 'Emma Wilson', total_reviews: 29, accuracy_score: 4.9 },
          { id: '5', name: 'David Lee', total_reviews: 26, accuracy_score: 4.5 }
        ],
        
        approvalRate: 78.5,
        avgConfidenceScore: 4.3,
        duplicateDetectionRate: 12.8,
        
        recentSubmissions: [
          { id: '1', name: 'The Underground', neighbourhood: 'King West', status: 'pending', created_at: '2024-01-30T10:30:00Z', review_count: 3 },
          { id: '2', name: 'Rooftop Lounge', neighbourhood: 'Entertainment District', status: 'pending', created_at: '2024-01-30T09:15:00Z', review_count: 2 },
          { id: '3', name: 'Jazz Corner', neighbourhood: 'Queen West', status: 'approved', created_at: '2024-01-29T16:45:00Z', review_count: 5 },
          { id: '4', name: 'Dance Floor', neighbourhood: 'King West', status: 'rejected', created_at: '2024-01-29T14:20:00Z', review_count: 5 }
        ],
        
        recentReviews: [
          { id: '1', reviewer_name: 'Alex Chen', submission_name: 'The Underground', decision: 'approve', created_at: '2024-01-30T11:00:00Z' },
          { id: '2', reviewer_name: 'Sarah Kim', submission_name: 'Rooftop Lounge', decision: 'approve', created_at: '2024-01-30T10:45:00Z' },
          { id: '3', reviewer_name: 'Mike Johnson', submission_name: 'The Underground', decision: 'needs_changes', created_at: '2024-01-30T10:30:00Z' },
          { id: '4', reviewer_name: 'Emma Wilson', submission_name: 'Jazz Corner', decision: 'approve', created_at: '2024-01-29T17:15:00Z' }
        ]
      };
      
      return NextResponse.json(mockAnalytics);
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

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date('2020-01-01'); // All time
    }

    // Get submission metrics
    const { data: submissions } = await supabase
      .from('bar_submissions')
      .select('*');

    const { data: submissionsInRange } = await supabase
      .from('bar_submissions')
      .select('*')
      .gte('created_at', startDate.toISOString());

    // Get review metrics
    const { data: reviews } = await supabase
      .from('submission_reviews')
      .select('*');

    const { data: reviewsInRange } = await supabase
      .from('submission_reviews')
      .select('*')
      .gte('created_at', startDate.toISOString());

    // Get user metrics
    const { data: users } = await supabase
      .from('users')
      .select('*');

    const { data: activeReviewers } = await supabase
      .from('users')
      .select('*')
      .eq('reviewer_status', 'approved');

    // Get top reviewers
    const { data: topReviewers } = await supabase
      .from('users')
      .select('id, full_name, total_reviews, review_accuracy_score')
      .eq('reviewer_status', 'approved')
      .order('total_reviews', { ascending: false })
      .limit(5);

    // Get recent submissions with review counts
    const { data: recentSubmissions } = await supabase
      .from('bar_submissions')
      .select(`
        id, 
        name, 
        neighbourhood, 
        status, 
        created_at,
        submission_reviews(count)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent reviews with reviewer and submission info
    const { data: recentReviews } = await supabase
      .from('submission_reviews')
      .select(`
        id,
        decision,
        created_at,
        users(full_name),
        bar_submissions(name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    // Calculate metrics
    const totalSubmissions = submissions?.length || 0;
    const pendingSubmissions = submissions?.filter(s => s.status === 'pending').length || 0;
    const approvedSubmissions = submissions?.filter(s => s.status === 'approved').length || 0;
    const rejectedSubmissions = submissions?.filter(s => s.status === 'rejected').length || 0;
    const submissionsThisRange = submissionsInRange?.length || 0;

    const totalReviews = reviews?.length || 0;
    const reviewsThisRange = reviewsInRange?.length || 0;
    const avgReviewsPerSubmission = totalSubmissions > 0 ? totalReviews / totalSubmissions : 0;

    const approvalRate = totalSubmissions > 0 ? (approvedSubmissions / (approvedSubmissions + rejectedSubmissions)) * 100 : 0;
    const avgConfidenceScore = reviews?.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / (reviews?.length || 1);

    // Format response
    const analyticsData = {
      totalSubmissions,
      pendingSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
      submissionsThisWeek: submissionsThisRange,
      
      totalReviews,
      reviewsThisWeek: reviewsThisRange,
      avgReviewsPerSubmission: Math.round(avgReviewsPerSubmission * 10) / 10,
      avgReviewTime: 18.5, // This would need more complex calculation
      
      totalUsers: users?.length || 0,
      activeReviewers: activeReviewers?.length || 0,
      newUsersThisWeek: users?.filter(u => new Date(u.created_at) >= startDate).length || 0,
      topReviewers: topReviewers?.map(r => ({
        id: r.id,
        name: r.full_name,
        total_reviews: r.total_reviews || 0,
        accuracy_score: r.review_accuracy_score || 0
      })) || [],
      
      approvalRate: Math.round(approvalRate * 10) / 10,
      avgConfidenceScore: Math.round(avgConfidenceScore * 10) / 10,
      duplicateDetectionRate: 12.8, // This would need more complex calculation
      
      recentSubmissions: recentSubmissions?.map(s => ({
        id: s.id,
        name: s.name,
        neighbourhood: s.neighbourhood,
        status: s.status,
        created_at: s.created_at,
        review_count: s.submission_reviews?.[0]?.count || 0
      })) || [],
      
      recentReviews: recentReviews?.map((r: any) => ({
        id: r.id,
        reviewer_name: r.users?.full_name || 'Unknown',
        submission_name: r.bar_submissions?.name || 'Unknown',
        decision: r.decision,
        created_at: r.created_at
      })) || []
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
