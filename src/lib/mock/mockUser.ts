import { User } from '@supabase/supabase-js';
import { UserProfile, MusicGenre } from '@/lib/types';

// This is a basic mock user that matches the Supabase User type.
export const mockUser: User = {
  id: 'mock-user-id-12345',
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    full_name: 'Mock User',
  },
  aud: 'authenticated',
  confirmation_sent_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  email: 'mock.user@example.com',
  phone: '+11234567890',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

// Function to get mock user profile with any saved preferences from localStorage
const getMockUserProfile = (): UserProfile => {
  const baseProfile: UserProfile = {
    id: 'mock-user-id-12345',
    email: 'mock.user@example.com',
    phone: '+11234567890',
    full_name: 'Mock User',
    avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=mock-user`,
    first_neighbourhood: 'King West',
    second_neighbourhood: 'Entertainment District',
    third_neighbourhood: 'Queen West',
    preferred_music: ['House', 'Rap'] as MusicGenre[],
    age: 25,
    access_status: 'approved' as const,
    loyalty_points: 100,
    last_active_at: new Date().toISOString(),
    created_at: new Date('2023-01-01T00:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  };

  // In browser environment, load any saved preferences
  if (typeof window !== 'undefined') {
    try {
      const savedPrefs = localStorage.getItem('mock_user_preferences');
      if (savedPrefs) {
        const preferences = JSON.parse(savedPrefs);
        return {
          ...baseProfile,
          ...preferences,
          updated_at: new Date().toISOString(), // Update timestamp when preferences are loaded
        };
      }
    } catch (error) {
      console.warn('Failed to load mock user preferences from localStorage:', error);
    }
  }

  return baseProfile;
};

// This is a mock user profile that matches the UserProfile interface.
// It includes all required fields and some optional ones for comprehensive testing.
// Preferences are loaded from localStorage if available.
export const mockUserProfile = getMockUserProfile();
