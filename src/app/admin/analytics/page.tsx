'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TopNavigation from '@/components/TopNavigation';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  TrendingUp, 
  Activity,
  Star,
  MessageSquare,
  Calendar,
  Target,
  Loader2
} from 'lucide-react';

interface AnalyticsData {
  // Submission metrics
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  submissionsThisWeek: number;
  
  // Review metrics
  totalReviews: number;
  reviewsThisWeek: number;
  avgReviewsPerSubmission: number;
  avgReviewTime: number; // hours
  
  // User metrics
  totalUsers: number;
  activeReviewers: number;
  newUsersThisWeek: number;
  topReviewers: Array<{
    id: string;
    name: string;
    total_reviews: number;
    accuracy_score: number;
  }>;
  
  // Quality metrics
  approvalRate: number;
  avgConfidenceScore: number;
  duplicateDetectionRate: number;
  
  // Recent activity
  recentSubmissions: Array<{
    id: string;
    name: string;
    neighbourhood: string;
    status: string;
    created_at: string;
    review_count: number;
  }>;
  
  recentReviews: Array<{
    id: string;
    reviewer_name: string;
    submission_name: string;
    decision: string;
    created_at: string;
  }>;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    
    // For now, check if user has admin privileges (you can adjust this logic)
    if (user.reviewer_status !== 'approved') {
      router.push('/for-you');
      return;
    }
    
    loadAnalytics();
  }, [user, router, timeRange]);

  const loadAnalytics = async () => {
    try {
      // In mock mode, return mock analytics data
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        const mockAnalytics: AnalyticsData = {
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
        
        setAnalytics(mockAnalytics);
        setIsLoading(false);
        return;
      }

      // Real API call would go here
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      const data = await response.json();
      
      if (response.ok) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-zinc-400';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approve': return 'text-green-400';
      case 'reject': return 'text-red-400';
      case 'needs_changes': return 'text-yellow-400';
      default: return 'text-zinc-400';
    }
  };

  if (!user || user.reviewer_status !== 'approved') {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <TopNavigation />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <TopNavigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-zinc-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" />
            <p>Unable to load analytics data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <TopNavigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-green-400" />
                Community Analytics
              </h1>
              <p className="text-zinc-400">
                Monitor community engagement and submission quality
              </p>
            </div>
            
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-green-600 text-white'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  {range === 'all' ? 'All Time' : `This ${range.charAt(0).toUpperCase() + range.slice(1)}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-400">Total Submissions</h3>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analytics.totalSubmissions}</p>
            <p className="text-sm text-green-400">+{analytics.submissionsThisWeek} this week</p>
          </div>
          
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-400">Approval Rate</h3>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analytics.approvalRate}%</p>
            <p className="text-sm text-zinc-400">{analytics.approvedSubmissions} approved</p>
          </div>
          
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-400">Active Reviewers</h3>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analytics.activeReviewers}</p>
            <p className="text-sm text-zinc-400">{analytics.totalReviews} total reviews</p>
          </div>
          
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-400">Avg Review Time</h3>
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analytics.avgReviewTime}h</p>
            <p className="text-sm text-zinc-400">Per submission</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Submission Status Breakdown */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Submission Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-zinc-300">Pending</span>
                </div>
                <span className="text-white font-medium">{analytics.pendingSubmissions}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-zinc-300">Approved</span>
                </div>
                <span className="text-white font-medium">{analytics.approvedSubmissions}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-zinc-300">Rejected</span>
                </div>
                <span className="text-white font-medium">{analytics.rejectedSubmissions}</span>
              </div>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Quality Metrics
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-400">Avg Confidence Score</span>
                  <span className="text-white font-medium">{analytics.avgConfidenceScore}/5</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full" 
                    style={{ width: `${(analytics.avgConfidenceScore / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-400">Duplicate Detection</span>
                  <span className="text-white font-medium">{analytics.duplicateDetectionRate}%</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full" 
                    style={{ width: `${analytics.duplicateDetectionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-400">Reviews per Submission</span>
                  <span className="text-white font-medium">{analytics.avgReviewsPerSubmission}</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-purple-400 h-2 rounded-full" 
                    style={{ width: `${(analytics.avgReviewsPerSubmission / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Reviewers */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-400" />
              Top Reviewers
            </h3>
            
            <div className="space-y-3">
              {analytics.topReviewers.map((reviewer, index) => (
                <div key={reviewer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-black' :
                      index === 1 ? 'bg-zinc-400 text-black' :
                      index === 2 ? 'bg-orange-400 text-black' :
                      'bg-zinc-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{reviewer.name}</p>
                      <p className="text-xs text-zinc-400">{reviewer.total_reviews} reviews</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-sm text-white">{reviewer.accuracy_score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              Recent Activity
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analytics.recentReviews.map(review => (
                <div key={review.id} className="flex items-start gap-3 p-2 bg-zinc-700/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-white">
                      <span className="font-medium">{review.reviewer_name}</span>
                      <span className={`ml-2 ${getDecisionColor(review.decision)}`}>
                        {review.decision.replace('_', ' ')}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-400">{review.submission_name}</p>
                    <p className="text-xs text-zinc-500">{formatDate(review.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
