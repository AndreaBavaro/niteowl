'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { UserProfile, MusicGenre } from '@/lib/types';

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithPhone: (phone: string) => Promise<{ error?: any }>;
  signInWithEmail: (email: string) => Promise<{ error?: any }>;
  verifyOTP: (phone: string, token: string) => Promise<{ error?: any }>;
  verifyEmailOTP: (email: string, token: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  createUserPreferences: (preferences: { location_neighbourhood: string; preferred_music: MusicGenre[]; age: number }) => Promise<{ error?: any }>;
  updateLastActive: () => Promise<void>;
  checkPhoneStatus: (phone: string) => Promise<{ error?: any; data?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Updated fetchUserProfile to JOIN with user_preferences
  const fetchUserProfile = useCallback(async (userId: string) => {
    const supabase = getSupabaseBrowserClient();
    
    // First, let's debug by checking if the user exists at all
    console.log('Fetching user profile for ID:', userId);
    
    // Try without JOIN first to isolate the issue
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error("Error fetching user data:", userError);
      if (userError.code === 'PGRST116') {
        console.log('No user found with ID:', userId);
        return null;
      }
      if (userError.code === 'PGRST110') {
        console.error('Multiple users found with same ID - database constraint issue!');
        return null;
      }
      return null;
    }
    
    console.log('User data found:', userData);
    
    // Now fetch preferences separately to avoid JOIN issues
    const { data: preferencesData, error: preferencesError } = await supabase
      .from('user_preferences')
      .select('location_neighbourhood, preferred_music, age')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to handle case where no preferences exist
    
    if (preferencesError) {
      console.error("Error fetching user preferences:", preferencesError);
      // Continue without preferences rather than failing completely
    }
    
    console.log('Preferences data:', preferencesData);

    // Combine the user data and preferences into a single object
    const preferences = preferencesData || {};
    const profile: UserProfile = {
      id: userData.id,
      email: userData.email,
      phone: userData.phone,
      full_name: userData.full_name,
      avatar_url: userData.avatar_url,
      location_neighbourhood: preferences.location_neighbourhood,
      preferred_music: preferences.preferred_music,
      age: preferences.age,
      access_status: userData.access_status || 'pending',
      loyalty_points: userData.loyalty_points || 0,
      last_active_at: userData.last_active_at,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    console.log('Final profile:', profile);
    return profile;
  }, []);

  const getOrCreateProfile = useCallback(async (user: SupabaseUser) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }

    try {
      console.log('Getting or creating profile for user:', user.id);
      
      // First, try to get existing profile
      const profile = await fetchUserProfile(user.id);
      if (profile) {
        console.log('Found existing profile:', profile);
        return profile;
      }

      console.log('No existing profile found, creating new one');
      
      // Format phone number - remove + sign for database storage
      const cleanPhone = user.phone ? user.phone.replace(/^\+/, '') : null;
      
      // Create new user record - DO NOT create user_preferences here
      // Preferences will be created later during onboarding
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          phone: cleanPhone, // Store without + sign
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          provider_data: user.user_metadata || {},
          access_status: 'pending',
          last_active_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        return null;
      }

      console.log('Created new user:', newUser);

      // Return the new profile without preferences
      const newProfile: UserProfile = {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        full_name: newUser.full_name,
        avatar_url: newUser.avatar_url,
        access_status: newUser.access_status || 'pending',
        loyalty_points: 0,
        last_active_at: newUser.last_active_at,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        // Preferences will be undefined until user completes onboarding
        location_neighbourhood: undefined,
        preferred_music: undefined,
        age: undefined,
      };

      return newProfile;
    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      return null;
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.warn('Supabase client not available');
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const handleSession = async (session: Session | null) => {
      try {
        const sessionUser = session?.user;
        if (sessionUser) {
          const profile = await fetchUserProfile(sessionUser.id);
          if (mounted) {
            setUser(profile);
            setSupabaseUser(sessionUser);
          }
        } else {
          if (mounted) {
            setUser(null);
            setSupabaseUser(null);
          }
        }
      } catch (error: any) {
        console.error('Error handling session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: Session | null) => {
      handleSession(session);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      handleSession(session);
    }).catch((error: any) => {
      console.error('Error getting initial session:', error);
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signInWithPhone = useCallback(async (phone: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: 'Authentication service not available' };
    }

    try {
      // Format phone number - remove + if present, then add it for Supabase auth
      const cleanPhone = phone.replace(/^\+/, '');
      const formattedPhone = `+${cleanPhone}`;
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error('Error sending OTP:', error);
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in signInWithPhone:', error);
      return { error: 'Failed to send OTP' };
    }
  }, []);

  const verifyOTP = useCallback(async (phone: string, token: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: 'Authentication service not available' };
    }

    try {
      // Format phone number - remove + if present, then add it for Supabase auth
      const cleanPhone = phone.replace(/^\+/, '');
      const formattedPhone = `+${cleanPhone}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });

      if (data.user && !error) {
        const profile = await getOrCreateProfile(data.user);
        setUser(profile);
        setSupabaseUser(data.user);
      }
      return { error };
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      return { error: 'Failed to verify OTP' };
    }
  }, [getOrCreateProfile]);

  const signInWithEmail = useCallback(async (email: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: 'Authentication service not available' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) {
        console.error('Error sending OTP:', error);
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error in signInWithEmail:', error);
      return { error: 'Failed to send OTP' };
    }
  }, []);

  const verifyEmailOTP = useCallback(async (email: string, token: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: 'Authentication service not available' };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (data.user && !error) {
        const profile = await getOrCreateProfile(data.user);
        setUser(profile);
        setSupabaseUser(data.user);
      }
      return { error };
    } catch (error) {
      console.error('Error in verifyEmailOTP:', error);
      return { error: 'Failed to verify OTP' };
    }
  }, [getOrCreateProfile]);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: 'Authentication service not available' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', supabaseUser?.id);

      if (!error) {
        setUser(prevUser => prevUser ? { ...prevUser, ...updates } : null);
      }
      return { error };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { error: 'Failed to update profile' };
    }
  }, [supabaseUser]);

  const createUserPreferences = useCallback(async (preferences: { location_neighbourhood: string; preferred_music: MusicGenre[]; age: number }) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      console.error('Supabase client not initialized');
      return { error: 'Authentication service not available' };
    }

    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: supabaseUser?.id,
          location_neighbourhood: preferences.location_neighbourhood,
          preferred_music: preferences.preferred_music,
          age: preferences.age,
        });

      if (error) {
        console.error('Error creating user preferences:', error);
        return { error: error.message || 'Failed to create preferences' };
      }

      // Refresh the user profile to include the new preferences
      if (supabaseUser?.id) {
        const updatedProfile = await fetchUserProfile(supabaseUser.id);
        if (updatedProfile) {
          setUser(updatedProfile);
        }
      }

      return {};
    } catch (error) {
      console.error('Error creating user preferences:', error);
      return { error: 'Failed to create preferences' };
    }
  }, [supabaseUser, fetchUserProfile]);

  const updateLastActive = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !supabaseUser?.id) {
      console.error('Supabase client not initialized or user not found');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', supabaseUser.id);

      if (error) {
        console.error('Error updating last active:', error);
      }
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  }, [supabaseUser]);

  const checkPhoneStatus = useCallback(async (phone: string) => {
    try {
      // Format phone number - remove + sign for consistency
      const cleanPhone = phone.replace(/^\+/, '');
      
      const response = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      if (!response.ok) {
        throw new Error('Failed to check phone status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking phone status:', error);
      return { error: 'Failed to check phone status' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      supabaseUser,
      isAuthenticated: !!user,
      isLoading,
      signInWithPhone,
      signInWithEmail,
      verifyOTP,
      verifyEmailOTP,
      signOut,
      updateUserProfile,
      createUserPreferences,
      updateLastActive,
      checkPhoneStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const demoUserData = {
  full_name: 'Alex Demo',
  age: 24,
  location: 'King West',
  music_preferences: ['House', 'Rap', 'EDM'],
  going_out_pattern: {
    days: ['Thursday', 'Friday', 'Saturday'],
    time_range: '9pm-2am',
    preferred_wait_time: '<15min'
  }
};
