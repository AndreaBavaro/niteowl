'use client';

import React, { useState } from 'react';
import { useAuthFlow } from '@/hooks/useAuthFlow';
import AuthChoice from './AuthChoice';
import EmailAuth from './EmailAuth';
import PhoneAuth from './PhoneAuth';
import UserDetails from './UserDetails';
import PreferencesPage from './PreferencesPage';
import OnboardingTour from './OnboardingTour';
import WaitingPage from './WaitingPage';

export default function AuthFlow() {
  const { state, actions, user, supabaseUser, isLoading } = useAuthFlow();

  // All business logic is now handled in the useAuthFlow hook

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
  if (state.step === 'complete') {
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
  switch (state.step) {
    case 'choice':
      return <AuthChoice onChoice={actions.handleAuthChoice} />;
    
    case 'email':
      return (
        <EmailAuth 
          onBack={actions.handleBackToChoice}
          onSuccess={actions.handleEmailSuccess}
          showNameInput={false}
        />
      );
    
    case 'phone':
      return (
        <PhoneAuth 
          onBack={actions.handleBackToChoice}
          onSuccess={actions.handlePhoneSuccess}
          showNameInput={false}
        />
      );
    
    case 'both':
      return (
        <BothAuthComponent 
          onBack={actions.handleBackToChoice}
          onComplete={actions.handleBothAuthComplete}
        />
      );
    
    case 'details':
      return (
        <UserDetails 
          onComplete={actions.handleDetailsComplete}
          email={state.userData.email}
          phone={state.userData.phone}
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
      return <PreferencesPage onComplete={actions.handlePreferencesComplete} loading={state.loading} />;
    
    case 'onboarding':
      return (
        <OnboardingTour 
          onComplete={actions.handleOnboardingComplete}
          userName={state.userData.name || user?.full_name}
        />
      );
    
    case 'waiting':
      return <WaitingPage userName={state.userData.name || user?.full_name} />;
    
    default:
      return <AuthChoice onChoice={actions.handleAuthChoice} />;
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
      // Move to phone auth
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
      // Move to email auth
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
