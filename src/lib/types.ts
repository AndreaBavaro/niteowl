import { z } from 'zod';

// Enums for bar data
export type LineupTimeRange = '0-10 min' | '15-30 min' | '30+ min';
export type CoverFrequency = 'No cover' | 'Sometimes' | 'Yes-always';
export type CoverAmount = 'Under $10' | '$10-$20' | 'Over $20';
export type AgeGroup = '18-21' | '22-25' | '25-30';
export type MusicGenre = 'House' | 'EDM' | 'Hip-hop' | 'Rap' | 'Top 40' | 'Pop' | 'Mixed/Variety' | 'Live bands' | 'City-pop' | 'Jazz';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type CapacitySize = 'Intimate (<50)' | 'Medium (50-150)' | 'Large (150-300)' | 'Very Large (300+)';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'duplicate';
export type ReviewerStatus = 'none' | 'pending' | 'approved' | 'suspended';
export type ReviewDecision = 'approve' | 'reject' | 'needs_changes';
export type NotificationType = 'review_request' | 'review_complete' | 'submission_approved' | 'submission_rejected';
export type VisitTimeOfDay = 'afternoon' | 'early_evening' | 'peak_night' | 'late_night';
export type GroupSize = 'solo' | 'couple' | 'small_group' | 'large_group';

// Database Types
export interface Bar {
  id: string;
  name: string;
  slug: string;
  canonical_name?: string;
  neighbourhood?: string;
  address?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  // Lineup time range (min/max concept)
  typical_lineup_min: LineupTimeRange;
  typical_lineup_max?: LineupTimeRange;
  longest_line_days: DayOfWeek[];
  cover_frequency: CoverFrequency;
  cover_amount?: CoverAmount;
  typical_vibe: string; // e.g., "Mostly dancing/loud (100%)"
  top_music: MusicGenre[];
  age_group_min: AgeGroup;
  age_group_max?: AgeGroup;
  service_rating: number;
  // Enhanced attributes for better user experience
  live_music_days: DayOfWeek[];
  has_patio: boolean;
  has_rooftop: boolean;
  has_dancefloor: boolean;
  karaoke_nights: DayOfWeek[];
  has_food: boolean;
  capacity_size?: CapacitySize;
  has_pool_table: boolean;
  has_arcade_games: boolean;
  // Real-time data for live status
  current_wait_time?: string; // e.g., "15 min", "No wait", "30+ min"
  live_events?: string[]; // e.g., ["Live DJ until 2AM", "Happy Hour until 8PM"]
  crowd_level?: 'quiet' | 'moderate' | 'busy' | 'packed';
  special_offers?: string[]; // e.g., ["$5 shots", "2-for-1 cocktails"]
  booking_url?: string; // External booking link
  is_featured?: boolean; // For highlighting special/new bars
  visit_count?: number; // User's visit count to this bar
  last_visited?: string; // User's last visit date
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  bar_id: string;
  user_id: string;
  wait_time_category: LineupTimeRange;
  cover_frequency: CoverFrequency;
  cover_amount_bucket?: CoverAmount;
  vibe: string;
  music_genres: MusicGenre[];
  days_long_lines: DayOfWeek[];
  age_group: AgeGroup;
  service_rating: number;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_age_group?: AgeGroup;
  preferred_music?: MusicGenre[];
  preferred_vibe?: string;
  cover_tolerance?: CoverAmount;
  preferred_days?: DayOfWeek[];
  first_neighbourhood: string;
  second_neighbourhood?: string;
  third_neighbourhood?: string;
  location_geo_coords?: { lat: number; lng: number };
  created_at: string;
  updated_at: string;
}

export interface FavouriteBar {
  user_id: string;
  bar_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  provider_data?: any;
  created_at: string;
  updated_at: string;
}

// Unified UserProfile interface combining User + UserPreferences
export interface UserProfile {
  // Core user data (from auth.users + users table)
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
  
  // Preferences (from user_preferences table)
  first_neighbourhood?: string;
  second_neighbourhood?: string;
  third_neighbourhood?: string;
  preferred_music?: MusicGenre[];
  age?: number;
  
  // App-specific fields
  access_status: 'pending' | 'approved' | 'rejected';
  loyalty_points: number;
  
  // Session tracking
  last_active_at?: string;
  
  // Community features
  reviewer_status: ReviewerStatus;
  reviewer_approved_at?: string;
  reviewer_approved_by?: string;
  submission_suspension_until?: string;
  submission_rejection_count: number;
  weekly_submission_count: number;
  weekly_submission_reset_at: string;
  total_reviews_completed: number;
  review_accuracy_score: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface BarMetrics {
  bar_id: string;
  bar_name: string;
  bar_slug: string;
  avg_wait_time_category: LineupTimeRange;
  most_common_cover_frequency: CoverFrequency;
  most_common_cover_amount?: CoverAmount;
  most_common_vibe: string;
  top_music_genres: MusicGenre[];
  most_common_age_group: AgeGroup;
  avg_service_rating: number;
  total_submissions: number;
  last_updated: string;
}

export interface SearchFilters {
  lineup_time?: LineupTimeRange[];
  cover_frequency?: CoverFrequency[];
  cover_amount?: CoverAmount[];
  music_genres?: MusicGenre[];
  age_groups?: AgeGroup[];
  neighbourhoods?: string[];
  min_service_rating?: number;
  days?: DayOfWeek[];
}

export interface BarSubmission {
  id: string;
  user_id: string;
  // Basic bar information
  name: string;
  slug: string;
  neighbourhood?: string;
  address?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  // Bar characteristics
  typical_lineup_min: LineupTimeRange;
  typical_lineup_max?: LineupTimeRange;
  longest_line_days: DayOfWeek[];
  cover_frequency: CoverFrequency;
  cover_amount?: CoverAmount;
  typical_vibe: string;
  top_music: MusicGenre[];
  age_group_min: AgeGroup;
  age_group_max?: AgeGroup;
  service_rating?: number;
  // Enhanced attributes
  live_music_days: DayOfWeek[];
  has_patio: boolean;
  has_rooftop: boolean;
  has_dancefloor: boolean;
  karaoke_nights: DayOfWeek[];
  has_food: boolean;
  capacity_size?: CapacitySize;
  has_pool_table: boolean;
  has_arcade_games: boolean;
  // Submission metadata
  status: SubmissionStatus;
  admin_notes?: string;
  rejection_reason?: string;
  duplicate_of_bar_id?: string;
  duplicate_of_submission_id?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface SubmissionReview {
  id: string;
  submission_id: string;
  reviewer_id: string;
  decision: ReviewDecision;
  review_notes?: string;
  // Field-specific feedback
  name_accurate?: boolean;
  location_accurate?: boolean;
  details_accurate?: boolean;
  features_accurate?: boolean;
  // Reviewer confidence
  confidence_level?: number; // 1-5
  is_helpful?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewVote {
  id: string;
  review_id: string;
  voter_id: string;
  is_helpful: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description?: string;
  earned_at: string;
  is_visible: boolean;
}

// User Experience Tracking Types
export interface UserFavorite {
  id: string;
  user_id: string;
  bar_id: string;
  created_at: string;
  bar: {
    id: string;
    name: string;
    slug: string;
    neighbourhood: string;
    address: string;
    description: string;
    typical_vibe: string;
    top_music: string[];
    has_rooftop: boolean;
    has_patio: boolean;
    has_dancefloor: boolean;
  };
}

export interface UserVisit {
  id: string;
  user_id: string;
  bar_id: string;
  visit_date: string;
  experience_rating: number;
  comment?: string;
  
  // Crowd-sourced data fields
  reported_wait_time?: LineupTimeRange;
  reported_cover_charge?: CoverAmount;
  reported_music_genres?: MusicGenre[];
  reported_vibe?: string;
  reported_age_group?: AgeGroup;
  reported_service_rating?: number;
  
  // Additional context fields
  time_of_visit?: VisitTimeOfDay;
  group_size?: GroupSize;
  special_event?: string;
  
  created_at: string;
  bar: {
    id: string;
    name: string;
    slug: string;
    neighbourhood: string;
    address: string;
  };
}

export interface RecommendationScore {
  bar: {
    id: string;
    name: string;
    slug: string;
    neighbourhood: string;
    address: string;
    description: string;
    typical_vibe: string;
    top_music: string[];
    has_rooftop: boolean;
    has_patio: boolean;
    has_dancefloor: boolean;
    karaoke_nights?: string[];
    live_music_days?: string[];
    has_food: boolean;
    capacity_size?: string;
    has_pool_table: boolean;
    has_arcade_games: boolean;
  };
  totalScore: number;
  reasoning: string[];
}

// Additional enums for user experience tracking are defined at the top of the file

export interface ReviewNotification {
  id: string;
  user_id: string;
  submission_id: string;
  notification_type: NotificationType;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SubmissionWithReviews extends BarSubmission {
  reviews: SubmissionReview[];
  review_count: number;
  approval_count: number;
  rejection_count: number;
  needs_changes_count: number;
  reviews_needed: number; // 5 - review_count
}

// User Bar Visit Validation Schema
export const UserBarVisitSchema = z.object({
  bar_id: z.string().min(1, 'Bar is required'),
  visit_date: z.string().min(1, 'Visit date is required'),
  experience_rating: z.number().min(1).max(10),
  comment: z.string().optional(),
  
  // Optional crowd-sourced data
  reported_wait_time: z.enum(['0-10 min', '15-30 min', '30+ min']).optional(),
  reported_cover_charge: z.enum(['Under $10', '$10-$20', 'Over $20']).optional(),
  reported_music_genres: z.array(z.enum([
    'House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 
    'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'
  ])).optional(),
  reported_vibe: z.string().optional(),
  reported_age_group: z.enum(['18-21', '22-25', '25-30']).optional(),
  reported_service_rating: z.number().min(1).max(10).optional(),
  
  // Additional context
  time_of_visit: z.enum(['afternoon', 'early_evening', 'peak_night', 'late_night']).optional(),
  group_size: z.enum(['solo', 'couple', 'small_group', 'large_group']).optional(),
  special_event: z.string().optional(),
});

export type UserBarVisitInput = z.infer<typeof UserBarVisitSchema>;

// Validation Schemas
export const CreateSubmissionSchema = z.object({
  bar_id: z.string().uuid(),
  wait_time_category: z.enum(['0-10 min', '15-30 min', '30+ min']),
  cover_frequency: z.enum(['No cover', 'Sometimes', 'Yes-always']),
  cover_amount_bucket: z.enum(['Under $10', '$10-$20', 'Over $20']).optional(),
  vibe: z.string().max(200),
  music_genres: z.array(z.enum(['House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'])),
  days_long_lines: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])),
  age_group: z.enum(['18-21', '22-25', '25-30']),
  service_rating: z.number().min(1).max(10),
});

export const UpdateUserPreferencesSchema = z.object({
  preferred_age_group: z.enum(['18-21', '22-25', '25-30']).optional(),
  preferred_music: z.array(z.enum(['House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'])).optional(),
  preferred_vibe: z.string().max(200).optional(),
  cover_tolerance: z.enum(['Under $10', '$10-$20', 'Over $20']).optional(),
  preferred_days: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).optional(),
  location_neighbourhood: z.string().max(100).optional(),
  location_geo_coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
});

export const CreateBarSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  neighbourhood: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  // Enhanced attributes
  live_music_days: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).default([]),
  has_patio: z.boolean().default(false),
  has_rooftop: z.boolean().default(false),
  has_dancefloor: z.boolean().default(false),
  karaoke_nights: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).default([]),
  has_food: z.boolean().default(false),
  capacity_size: z.enum(['Intimate (<50)', 'Medium (50-150)', 'Large (150-300)', 'Very Large (300+)']).optional(),
  has_pool_table: z.boolean().default(false),
  has_arcade_games: z.boolean().default(false),
});

export const CreateSubmissionReviewSchema = z.object({
  submission_id: z.string().uuid(),
  decision: z.enum(['approve', 'reject', 'needs_changes']),
  review_notes: z.string().max(500).optional(),
  name_accurate: z.boolean().optional(),
  location_accurate: z.boolean().optional(),
  details_accurate: z.boolean().optional(),
  features_accurate: z.boolean().optional(),
  confidence_level: z.number().min(1).max(5).optional(),
});

export const CreateBarSubmissionSchema = z.object({
  name: z.string().min(1, 'Bar name is required').max(100, 'Bar name must be under 100 characters'),
  neighbourhood: z.string().min(1, 'Neighbourhood is required').max(100),
  address: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  typical_lineup_min: z.enum(['0-10 min', '15-30 min', '30+ min']),
  typical_lineup_max: z.enum(['0-10 min', '15-30 min', '30+ min']).optional(),
  longest_line_days: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).default([]),
  cover_frequency: z.enum(['No cover', 'Sometimes', 'Yes-always']),
  cover_amount: z.enum(['Under $10', '$10-$20', 'Over $20']).optional(),
  typical_vibe: z.string().min(1, 'Vibe description is required').max(200),
  top_music: z.array(z.enum(['House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'])).min(1, 'At least one music genre is required'),
  age_group_min: z.enum(['18-21', '22-25', '25-30']),
  age_group_max: z.enum(['18-21', '22-25', '25-30']).optional(),
  service_rating: z.number().min(1).max(10).optional(),
  // Enhanced attributes
  live_music_days: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).default([]),
  has_patio: z.boolean().default(false),
  has_rooftop: z.boolean().default(false),
  has_dancefloor: z.boolean().default(false),
  karaoke_nights: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])).default([]),
  has_food: z.boolean().default(false),
  capacity_size: z.enum(['Intimate (<50)', 'Medium (50-150)', 'Large (150-300)', 'Very Large (300+)']).optional(),
  has_pool_table: z.boolean().default(false),
  has_arcade_games: z.boolean().default(false),
});

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionSchema>;
export type UpdateUserPreferencesInput = z.infer<typeof UpdateUserPreferencesSchema>;
export type CreateBarInput = z.infer<typeof CreateBarSchema>;
export type CreateBarSubmissionInput = z.infer<typeof CreateBarSubmissionSchema>;
export type CreateSubmissionReviewInput = z.infer<typeof CreateSubmissionReviewSchema>;
