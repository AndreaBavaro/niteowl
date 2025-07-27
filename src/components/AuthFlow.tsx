'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import AuthChoice from './AuthChoice';
import EmailAuth from './EmailAuth';
import PhoneAuth from './PhoneAuth';
import UserDetails from './UserDetails';
import PreferencesPage from './PreferencesPage';
import OnboardingTour from './OnboardingTour';
import WaitingPage from './WaitingPage';

type AuthStep = 
  | 'choice' 
  | 'email' 
  | 'phone' 
  | 'both' 
  | 'details' 
  | 'preferences' 
  | 'onboarding' 
  | 'waiting' 
  | 'complete';

interface UserData {
  email?: string;
  phone?: string;
  name?: string;
}

export default function AuthFlow() {
  const { user, isAuthenticated, isLoading, updateUserProfile, supabaseUser } = useAuth();
  const [step, setStep] = useState<AuthStep>('choice');
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewAuthSession, setIsNewAuthSession] = useState(false);

  // Check user status when component mounts or user changes
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      // Only check user status if this is not a new auth session
      // New auth sessions should continue with their current step
      if (!isNewAuthSession) {
        checkUserStatus();
      } else {
        // Reset the flag after handling new auth session
        setIsNewAuthSession(false);
      }
    }
  }, [isAuthenticated, user, isLoading, isNewAuthSession]);

  const checkUserStatus = async () => {
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
  };

  const handleAuthChoice = (choice: 'email' | 'phone' | 'both') => {
    setStep(choice);
  };

  const handleEmailSuccess = () => {
    console.log('🔍 AuthFlow Debug - Email auth success, setting step to details');
    setIsNewAuthSession(true);
    setStep('details');
  };

  const handlePhoneSuccess = (isExistingUser: boolean) => {
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
  };

  const handleBothAuthComplete = (data: { email?: string; phone?: string }) => {
    console.log('🔍 AuthFlow Debug - Both auth complete, setting step to details');
    setUserData(prev => ({ ...prev, ...data }));
    setIsNewAuthSession(true);
    setStep('details');
  };

  const handleDetailsComplete = async (name: string) => {
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
  };

  const handlePreferencesComplete = async (preferences: {
    age: number;
    music_preferences: string[];
    neighbourhood: string;
  }) => {
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
  };

  const handleOnboardingComplete = () => {
    setStep('complete');
  };

  const handleBackToChoice = () => {
    setStep('choice');
    setUserData({});
    setError('');
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and we're at complete step, redirect to main app
  if (step === 'complete') {
    // This would typically redirect to the main app
    // For now, we'll show a success message
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to NightOwl TO!
          </h1>
          <p className="text-gray-300 mb-6">Redirecting to your personalized experience...</p>
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Render appropriate step
  switch (step) {
    case 'choice':
      return <AuthChoice onChoice={handleAuthChoice} />;
    
    case 'email':
      return (
        <EmailAuth 
          onBack={handleBackToChoice}
          onSuccess={handleEmailSuccess}
          showNameInput={false}
        />
      );
    
    case 'phone':
      return (
        <PhoneAuth 
          onBack={handleBackToChoice}
          onSuccess={handlePhoneSuccess}
          showNameInput={false}
        />
      );
    
    case 'both':
      return (
        <BothAuthComponent 
          onBack={handleBackToChoice}
          onComplete={handleBothAuthComplete}
        />
      );
    
    case 'details':
      return (
        <UserDetails 
          onComplete={handleDetailsComplete}
          email={userData.email}
          phone={userData.phone}
        />
      );
    
    case 'preferences':
      if (!user || !supabaseUser) {
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Finalizing setup...</p>
            </div>
          </div>
        );
      }
      return <PreferencesPage onComplete={handlePreferencesComplete} loading={loading} />;
    
    case 'onboarding':
      return (
        <OnboardingTour 
          onComplete={handleOnboardingComplete}
          userName={userData.name || user?.full_name}
        />
      );
    
    case 'waiting':
      return <WaitingPage userName={userData.name || user?.full_name} />;
    
    default:
      return <AuthChoice onChoice={handleAuthChoice} />;
  }
}

// Component for handling both email and phone auth
function BothAuthComponent({ 
  onBack, 
  onComplete 
}: { 
  onBack: () => void; 
  onComplete: (data: { email?: string; phone?: string }) => void; 
}) {
  const [currentAuth, setCurrentAuth] = useState<'email' | 'phone'>('email');
  const [completedAuth, setCompletedAuth] = useState<{ email?: string; phone?: string }>({});

  const handleEmailSuccess = () => {
    const newData = { ...completedAuth, email: 'verified' };
    setCompletedAuth(newData);
    
    if (newData.phone) {
      // Both completed
      onComplete(newData);
    } else {
      // Switch to phone
      setCurrentAuth('phone');
    }
  };

  const handlePhoneSuccess = () => {
    const newData = { ...completedAuth, phone: 'verified' };
    setCompletedAuth(newData);
    
    if (newData.email) {
      // Both completed
      onComplete(newData);
    } else {
      // Switch to email
      setCurrentAuth('email');
    }
  };

  if (currentAuth === 'email') {
    return (
      <EmailAuth 
        onBack={onBack}
        onSuccess={handleEmailSuccess}
        showNameInput={false}
      />
    );
  } else {
    return (
      <PhoneAuth 
        onBack={onBack}
        onSuccess={handlePhoneSuccess}
        showNameInput={false}
      />
    );
  }
}
