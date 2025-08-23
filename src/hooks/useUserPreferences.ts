'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MusicGenre } from '@/lib/types';

interface PreferencesData {
  first_neighbourhood?: string;
  second_neighbourhood?: string;
  third_neighbourhood?: string;
  preferred_music?: MusicGenre[];
  age?: number;
}

const MOCK_PREFERENCES_KEY = 'mock_user_preferences';

export function useUserPreferences() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePreferences = useCallback(async (preferences: PreferencesData) => {
    if (!user) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // In mock mode, persist to localStorage and update the context
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.log('MOCK MODE: Updating preferences in localStorage');
        
        // Save to localStorage for persistence
        const existingPrefs = localStorage.getItem(MOCK_PREFERENCES_KEY);
        const currentPrefs = existingPrefs ? JSON.parse(existingPrefs) : {};
        const updatedPrefs = { ...currentPrefs, ...preferences };
        localStorage.setItem(MOCK_PREFERENCES_KEY, JSON.stringify(updatedPrefs));
        
        // Update the user context
        const result = await updateUserProfile(preferences);
        
        if (result.error) {
          setError(result.error);
          return { success: false, error: result.error };
        }
        
        console.log('MOCK MODE: Preferences updated successfully');
        return { success: true };
      }

      // Real mode - use the existing updateUserProfile which handles database updates
      const result = await updateUserProfile(preferences);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [user, updateUserProfile]);

  const loadMockPreferences = useCallback(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      const saved = localStorage.getItem(MOCK_PREFERENCES_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  }, []);

  return {
    updatePreferences,
    loadMockPreferences,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
