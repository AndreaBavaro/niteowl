'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { MusicGenre } from '@/lib/types';

export type AuthStep = 
  | 'choice' 
  | 'email' 
  | 'phone' 
  | 'both' 
  | 'details' 
  | 'preferences' 
  | 'onboarding' 
  | 'waiting' 
  | 'complete';

export interface UserData {
  email?: string;
  phone?: string;
  name?: string;
}

export interface PreferencesData {
  age: number;
  music_preferences: string[];
  neighbourhood: string;
}

export interface AuthFlowState {
  step: AuthStep;
  userData: UserData;
  loading: boolean;
  error: string;
  isNewAuthSession: boolean;
}

export interface AuthFlowActions {
  handleAuthChoice: (choice: 'email' | 'phone' | 'both') => void;
  handleEmailSuccess: () => void;
  handlePhoneSuccess: (isExistingUser: boolean) => void;
  handleBothAuthComplete: (data: { email?: string; phone?: string }) => void;
  handleDetailsComplete: (name: string) => Promise<void>;
  handlePreferencesComplete: (preferences: PreferencesData) => Promise<void>;
  handleOnboardingComplete: () => void;
  handleBackToChoice: () => void;
  setError: (error: string) => void;
}

export function useAuthFlow() {
  const { user, isAuthenticated, isLoading, updateUserProfile, supabaseUser } = useAuth();
  
  const [step, setStep] = useState<AuthStep>('choice');
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewAuthSession, setIsNewAuthSession] = useState(false);

  // This effect now primarily handles resetting the isNewAuthSession flag.
  // The automatic checkUserStatus() call has been removed to prevent redirection on load.
  useEffect(() => {
    if (isLoading) return;

    if (isNewAuthSession) {
      // Reset the flag after handling new auth session
      setIsNewAuthSession(false);
    }

  }, [isAuthenticated, user, isLoading, isNewAuthSession]);

  const checkUserStatus = useCallback(async () => {
    if (!user) return;
    const supabase = getSupabaseBrowserClient();

    console.log('🔍 AuthFlow Debug - checkUserStatus called for user:', user.id);
    console.log('🔍 AuthFlow Debug - Current step before check:', step);

    try {
      // Check if user has preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('🔍 AuthFlow Debug - User preferences:', preferences);
      console.log('🔍 AuthFlow Debug - User access_status:', user.access_status);

      if (preferences) {
        // User has preferences, check access status
        if (user.access_status === 'approved') {
          console.log('🔍 AuthFlow Debug - User approved, setting step to complete');
          setStep('complete'); // Redirect to main app
        } else {
          console.log('🔍 AuthFlow Debug - User pending, setting step to waiting');
          setStep('waiting'); // Show waiting page
        }
      } else {
        // User needs to set preferences
        console.log('🔍 AuthFlow Debug - No preferences found, setting step to preferences');
        setStep('preferences');
      }
    } catch (error) {
      console.error('🔍 AuthFlow Debug - Error checking user status:', error);
      // If no preferences found, show preferences page
      console.log('🔍 AuthFlow Debug - Error occurred, setting step to preferences');
      setStep('preferences');
    }
  }, [user, step]);

  const handleAuthChoice = useCallback((choice: 'email' | 'phone' | 'both') => {
    setStep(choice);
  }, []);

  const handleEmailSuccess = useCallback(() => {
    console.log('🔍 AuthFlow Debug - Email auth success, setting step to details');
    setIsNewAuthSession(true);
    setStep('details');
  }, []);

  const handlePhoneSuccess = useCallback((isExistingUser: boolean) => {
    console.log(`🔍 AuthFlow Debug - Phone auth success. Is existing user: ${isExistingUser}`);
    setIsNewAuthSession(true);
    if (isExistingUser) {
      // If the user already exists, we can potentially skip the details page
      // and go straight to checking their status.
      checkUserStatus();
    } else {
      // New user, proceed to details page to collect name.
      setStep('details');
    }
  }, [checkUserStatus]);

  const handleBothAuthComplete = useCallback((data: { email?: string; phone?: string }) => {
    console.log('🔍 AuthFlow Debug - Both auth complete, setting step to details');
    setUserData(prev => ({ ...prev, ...data }));
    setIsNewAuthSession(true);
    setStep('details');
  }, []);

  const handleDetailsComplete = useCallback(async (name: string) => {
    console.log('🔍 AuthFlow Debug - handleDetailsComplete called with name:', name);
    console.log('🔍 AuthFlow Debug - Current userData:', userData);
    console.log('🔍 AuthFlow Debug - Current user:', user);
    console.log('🔍 AuthFlow Debug - Current supabaseUser:', supabaseUser);
    
    setUserData(prev => ({ ...prev, name }));
    setLoading(true);
    setError('');

    try {
      // Check if we have a supabaseUser to work with
      if (!supabaseUser) {
        console.log('❌ AuthFlow Debug - No supabaseUser available');
        setError('Authentication error. Please try again.');
        return;
      }

      // Update user profile with name and contact info
      const updates: any = {
        full_name: name,
        updated_at: new Date().toISOString()
      };

      if (userData.email) updates.email = userData.email;
      if (userData.phone) updates.phone = userData.phone;

      console.log('🔍 AuthFlow Debug - About to call updateUserProfile with:', updates);
      const { error: updateError } = await updateUserProfile(updates);
      console.log('🔍 AuthFlow Debug - updateUserProfile response:', { error: updateError });
      
      if (updateError) {
        console.log('❌ AuthFlow Debug - Update error occurred:', updateError);
        setError(typeof updateError === 'string' ? updateError : 'Failed to save user details');
        return;
      }

      console.log('✅ AuthFlow Debug - User details saved successfully, moving to preferences');
      setStep('preferences');
    } catch (err) {
      console.error('❌ AuthFlow Debug - Exception in handleDetailsComplete:', err);
      setError('Failed to save user details');
    } finally {
      console.log('🔍 AuthFlow Debug - Setting loading to false');
      setLoading(false);
    }
  }, [userData, supabaseUser, updateUserProfile]);

  const handlePreferencesComplete = useCallback(async (preferences: PreferencesData) => {
    console.log('handlePreferencesComplete called with:', preferences);
    if (!supabaseUser || !user) {
      console.error('User or Supabase client not available');
      setError('Session expired. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const upsertData = {
        user_id: supabaseUser.id, // Use supabaseUser.id
        age: preferences.age,
        music_preferences: preferences.music_preferences,
        neighbourhood: preferences.neighbourhood,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      console.log('Upserting data to user_preferences:', upsertData);
      
      const supabase = getSupabaseBrowserClient();
      // Save preferences to user_preferences table
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert(upsertData, { onConflict: 'user_id' });

      if (preferencesError) {
        console.error('Error saving preferences:', preferencesError);
        setError('Failed to save preferences');
        return;
      }

      console.log('Preferences saved successfully');

      // Check access status
      if (user.access_status === 'approved') {
        setStep('onboarding');
      } else {
        setStep('waiting');
      }
    } catch (err) {
      console.error('Error in preferences completion:', err);
      setError('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  }, [supabaseUser, user]);

  const handleOnboardingComplete = useCallback(() => {
    setStep('complete');
  }, []);

  const handleBackToChoice = useCallback(() => {
    setStep('choice');
    setUserData({});
    setError('');
  }, []);

  const state: AuthFlowState = {
    step,
    userData,
    loading,
    error,
    isNewAuthSession
  };

  const actions: AuthFlowActions = {
    handleAuthChoice,
    handleEmailSuccess,
    handlePhoneSuccess,
    handleBothAuthComplete,
    handleDetailsComplete,
    handlePreferencesComplete,
    handleOnboardingComplete,
    handleBackToChoice,
    setError
  };

  return {
    state,
    actions,
    user,
    supabaseUser,
    isLoading: isLoading || loading
  };
}
