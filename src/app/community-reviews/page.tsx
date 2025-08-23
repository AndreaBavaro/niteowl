'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import TopNavigation from '@/components/TopNavigation';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users, 
  Music, 
  Star,
  TreePine,
  Building2,
  Disc3,
  Mic,
  UtensilsCrossed,
  Circle,
  Gamepad2,
  MessageSquare,
  Award,
  Loader2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Edit3
} from 'lucide-react';
import { 
  SubmissionWithReviews,
  BarSubmission,
  SubmissionReview,
  CreateSubmissionReviewInput,
  ReviewDecision
} from '@/lib/types';

interface ReviewFormData {
  decision: ReviewDecision;
  review_notes: string;
  name_accurate: boolean;
  location_accurate: boolean;
  details_accurate: boolean;
  features_accurate: boolean;
  confidence_level: number;
}

export default function CommunityReviewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [pendingSubmissions, setPendingSubmissions] = useState<BarSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<BarSubmission | null>(null);
  const [submissionReviews, setSubmissionReviews] = useState<SubmissionReview[]>([]);
  const [reviewStats, setReviewStats] = useState({
    review_count: 0,
    approval_count: 0,
    rejection_count: 0,
    needs_changes_count: 0,
    reviews_needed: 5
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    decision: 'approve',
    review_notes: '',
    name_accurate: true,
    location_accurate: true,
    details_accurate: true,
    features_accurate: true,
    confidence_level: 5
  });

  // Redirect if not authenticated or not a reviewer
  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    
    if (user.reviewer_status !== 'approved') {
      router.push('/for-you');
      return;
    }
    
    loadPendingSubmissions();
  }, [user, router]);

  const loadPendingSubmissions = async () => {
    try {
      const response = await fetch('/api/bar-submissions?status=pending');
      const data = await response.json();
      
      if (response.ok) {
        setPendingSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubmissionReviews = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/submission-reviews?submissionId=${submissionId}`);
      const data = await response.json();
      
      if (response.ok) {
        setSubmissionReviews(data.reviews || []);
        setReviewStats({
          review_count: data.review_count || 0,
          approval_count: data.approval_count || 0,
          rejection_count: data.rejection_count || 0,
          needs_changes_count: data.needs_changes_count || 0,
          reviews_needed: data.reviews_needed || 5
        });
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleSubmissionSelect = (submission: BarSubmission) => {
    setSelectedSubmission(submission);
    loadSubmissionReviews(submission.id);
    setShowReviewForm(false);
    // Reset form
    setReviewForm({
      decision: 'approve',
      review_notes: '',
      name_accurate: true,
      location_accurate: true,
      details_accurate: true,
      features_accurate: true,
      confidence_level: 5
    });
  };

  const handleReviewSubmit = async () => {
    if (!selectedSubmission) return;

    setIsSubmittingReview(true);
    
    try {
      const reviewData: CreateSubmissionReviewInput = {
        submission_id: selectedSubmission.id,
        ...reviewForm
      };

      const response = await fetch('/api/submission-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh data
        await loadSubmissionReviews(selectedSubmission.id);
        await loadPendingSubmissions();
        setShowReviewForm(false);
        
        // Show success message
        alert(`Review submitted successfully! You earned ${result.points_earned} loyalty points.`);
      } else {
        alert(result.error || 'Failed to submit review');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getFeatureIcons = (submission: BarSubmission) => {
    const features = [];
    
    if (submission.has_patio) features.push({ icon: TreePine, label: 'Patio', color: 'text-green-400' });
    if (submission.has_rooftop) features.push({ icon: Building2, label: 'Rooftop', color: 'text-blue-400' });
    if (submission.has_dancefloor) features.push({ icon: Disc3, label: 'Dancefloor', color: 'text-purple-400' });
    if (submission.live_music_days && submission.live_music_days.length > 0) features.push({ icon: Music, label: `Live Music (${submission.live_music_days.length}d)`, color: 'text-orange-400' });
    if (submission.karaoke_nights && submission.karaoke_nights.length > 0) features.push({ icon: Mic, label: `Karaoke (${submission.karaoke_nights.length}d)`, color: 'text-pink-400' });
    if (submission.has_food) features.push({ icon: UtensilsCrossed, label: 'Food', color: 'text-yellow-400' });
    if (submission.has_pool_table) features.push({ icon: Circle, label: 'Pool', color: 'text-cyan-400' });
    if (submission.has_arcade_games) features.push({ icon: Gamepad2, label: 'Games', color: 'text-red-400' });
    
    return features;
  };

  const getDecisionIcon = (decision: ReviewDecision) => {
    switch (decision) {
      case 'approve': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'reject': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'needs_changes': return <Edit3 className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getDecisionColor = (decision: ReviewDecision) => {
    switch (decision) {
      case 'approve': return 'text-green-400';
      case 'reject': return 'text-red-400';
      case 'needs_changes': return 'text-yellow-400';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <TopNavigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Award className="w-8 h-8 text-green-400" />
            Community Reviews
          </h1>
          <p className="text-zinc-400">
            Help maintain data quality by reviewing new bar submissions from the community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Submissions List */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800 rounded-xl border border-zinc-700">
              <div className="p-4 border-b border-zinc-700">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Pending Submissions ({pendingSubmissions.length})
                </h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {pendingSubmissions.length === 0 ? (
                  <div className="p-6 text-center text-zinc-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                    <p>No pending submissions!</p>
                    <p className="text-sm">All caught up with reviews.</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {pendingSubmissions.map(submission => (
                      <button
                        key={submission.id}
                        onClick={() => handleSubmissionSelect(submission)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedSubmission?.id === submission.id
                            ? 'bg-green-900/20 border-green-500/30'
                            : 'bg-zinc-700/50 border-zinc-600 hover:bg-zinc-700'
                        }`}
                      >
                        <h3 className="font-medium text-white mb-1">{submission.name}</h3>
                        <p className="text-sm text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {submission.neighbourhood}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submission Details & Review */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <div className="space-y-6">
                {/* Submission Details */}
                <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedSubmission.name}</h2>
                      <p className="text-zinc-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedSubmission.neighbourhood}
                        {selectedSubmission.address && ` • ${selectedSubmission.address}`}
                      </p>
                    </div>
                    
                    {/* Review Progress */}
                    <div className="text-right">
                      <div className="bg-zinc-700 rounded-lg px-3 py-2 mb-2">
                        <p className="text-sm text-zinc-300">Reviews Progress</p>
                        <p className="text-lg font-bold text-white">
                          {reviewStats.review_count}/5
                        </p>
                        {reviewStats.reviews_needed > 0 && (
                          <p className="text-xs text-zinc-400">
                            {reviewStats.reviews_needed} more needed
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2 text-xs">
                        <span className="text-green-400">✓ {reviewStats.approval_count}</span>
                        <span className="text-red-400">✗ {reviewStats.rejection_count}</span>
                        <span className="text-yellow-400">⚠ {reviewStats.needs_changes_count}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSubmission.description && (
                    <p className="text-zinc-300 mb-4">{selectedSubmission.description}</p>
                  )}

                  {/* Bar Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-zinc-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-zinc-400">Wait Time</span>
                      </div>
                      <p className="text-sm text-white">{selectedSubmission.typical_lineup_min}</p>
                    </div>
                    
                    <div className="bg-zinc-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-zinc-400">Age Group</span>
                      </div>
                      <p className="text-sm text-white">{selectedSubmission.age_group_min}</p>
                    </div>
                    
                    <div className="bg-zinc-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Music className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-zinc-400">Music</span>
                      </div>
                      <p className="text-sm text-white">{selectedSubmission.top_music.slice(0, 2).join(', ')}</p>
                    </div>
                    
                    <div className="bg-zinc-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-zinc-400">Cover</span>
                      </div>
                      <p className="text-sm text-white">{selectedSubmission.cover_frequency}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-zinc-300 mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {getFeatureIcons(selectedSubmission).map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                          <div key={index} className="flex items-center gap-1 bg-zinc-700/50 rounded-full px-2 py-1">
                            <IconComponent className={`w-3 h-3 ${feature.color}`} />
                            <span className="text-xs text-zinc-300">{feature.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review Action */}
                  {!showReviewForm && reviewStats.reviews_needed > 0 && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Review This Submission
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Submit Your Review</h3>
                    
                    <div className="space-y-4">
                      {/* Decision */}
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Review Decision *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'approve', label: 'Approve', icon: CheckCircle, color: 'green' },
                            { value: 'reject', label: 'Reject', icon: XCircle, color: 'red' },
                            { value: 'needs_changes', label: 'Needs Changes', icon: Edit3, color: 'yellow' }
                          ].map(option => {
                            const IconComponent = option.icon;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setReviewForm(prev => ({ ...prev, decision: option.value as ReviewDecision }))}
                                className={`p-3 rounded-lg border transition-all flex items-center gap-2 ${
                                  reviewForm.decision === option.value
                                    ? `bg-${option.color}-900/20 border-${option.color}-500/30 text-${option.color}-400`
                                    : 'bg-zinc-700/50 border-zinc-600 text-zinc-300 hover:bg-zinc-700'
                                }`}
                              >
                                <IconComponent className="w-4 h-4" />
                                <span className="text-sm font-medium">{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Accuracy Checks */}
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Information Accuracy
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: 'name_accurate', label: 'Name & Branding' },
                            { key: 'location_accurate', label: 'Location & Address' },
                            { key: 'details_accurate', label: 'Hours & Details' },
                            { key: 'features_accurate', label: 'Features & Amenities' }
                          ].map(check => (
                            <label key={check.key} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(reviewForm as any)[check.key]}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, [check.key]: e.target.checked }))}
                                className="rounded border-zinc-600 text-green-500 focus:ring-green-500"
                              />
                              <span className="text-sm text-zinc-300">{check.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Confidence Level */}
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Confidence Level: {reviewForm.confidence_level}/5
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={reviewForm.confidence_level}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, confidence_level: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-zinc-500 mt-1">
                          <span>Not Sure</span>
                          <span>Very Confident</span>
                        </div>
                      </div>

                      {/* Review Notes */}
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Review Notes (Optional)
                        </label>
                        <textarea
                          value={reviewForm.review_notes}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, review_notes: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Any additional comments or concerns..."
                        />
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={handleReviewSubmit}
                          disabled={isSubmittingReview}
                          className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {isSubmittingReview ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Submit Review
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Existing Reviews */}
                {submissionReviews.length > 0 && (
                  <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Community Reviews ({submissionReviews.length})
                    </h3>
                    
                    <div className="space-y-3">
                      {submissionReviews.map(review => (
                        <div key={review.id} className="bg-zinc-700/50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getDecisionIcon(review.decision)}
                              <span className={`font-medium capitalize ${getDecisionColor(review.decision)}`}>
                                {review.decision.replace('_', ' ')}
                              </span>
                              {review.confidence_level && (
                                <span className="text-xs text-zinc-400">
                                  (Confidence: {review.confidence_level}/5)
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-zinc-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {review.review_notes && (
                            <p className="text-sm text-zinc-300 mb-2">{review.review_notes}</p>
                          )}
                          
                          <div className="flex gap-4 text-xs text-zinc-400">
                            {review.name_accurate && <span>✓ Name</span>}
                            {review.location_accurate && <span>✓ Location</span>}
                            {review.details_accurate && <span>✓ Details</span>}
                            {review.features_accurate && <span>✓ Features</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-12 text-center">
                <Eye className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Select a Submission</h3>
                <p className="text-zinc-400">
                  Choose a pending submission from the list to start reviewing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
