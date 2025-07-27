import { z } from 'zod';

// Enums for bar data
export type LineupTimeRange = '0-10 min' | '15-30 min' | '30+ min';
export type CoverFrequency = 'No cover' | 'Sometimes' | 'Yes-always';
export type CoverAmount = 'Under $10' | '$10-$20' | 'Over $20';
export type AgeGroup = '18-21' | '22-25' | '25-30';
export type MusicGenre = 'House' | 'EDM' | 'Hip-hop' | 'Rap' | 'Top 40' | 'Pop' | 'Mixed/Variety' | 'Live bands' | 'City-pop' | 'Jazz';
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

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
  location_neighbourhood?: string;
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
  location_neighbourhood?: string;
  preferred_music?: MusicGenre[];
  age?: number;
  
  // App-specific fields
  access_status: 'pending' | 'approved' | 'rejected';
  loyalty_points: number;
  
  // Session tracking
  last_active_at?: string;
  
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
});

export type CreateSubmissionInput = z.infer<typeof CreateSubmissionSchema>;
export type UpdateUserPreferencesInput = z.infer<typeof UpdateUserPreferencesSchema>;
export type CreateBarInput = z.infer<typeof CreateBarSchema>;
