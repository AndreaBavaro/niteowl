'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SmartSignup from '@/components/SmartSignup';
import { LogOut } from 'lucide-react';

export default function SignupPage() {
  const { isAuthenticated, isLoading, user, signOut } = useAuth();
  const router = useRouter();
  const [showStartFresh, setShowStartFresh] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Show "Start Fresh" option instead of immediately redirecting
      setShowStartFresh(true);
    } else {
      setShowStartFresh(false);
    }
  }, [isAuthenticated, isLoading, user]);

  const handleStartFresh = async () => {
    await signOut();
    setShowStartFresh(false);
  };

  const handleContinue = () => {
    if (!user) return;
    
    // Smart routing based on user status
    if (user.access_status === 'approved') {
      // Check if preferences are complete
      const hasCompletePreferences = !!(user.location_neighbourhood && user.preferred_music && user.preferred_music.length > 0 && user.age);
      if (hasCompletePreferences) {
        router.push('/for-you');
      } else {
        router.push('/preferences');
      }
    } else if (user.access_status === 'pending') {
      router.push('/waiting');
    }
    // If rejected, stay on signup page to show message
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
              Welcome to NightOwl TO 🦉
            </h1>
            <p className="text-zinc-400 text-lg">
              Your nocturnal companion for Toronto's best nightlife
            </p>
          </div>
          
          {showStartFresh ? (
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user?.full_name || 'User'}!
                </h2>
                <p className="text-zinc-400">
                  You already have an account. What would you like to do?
                </p>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center text-lg"
                >
                  Continue to App
                </button>
                
                <button
                  onClick={handleStartFresh}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center text-lg"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Start Fresh (Sign Out)
                </button>
              </div>
              
              {user?.access_status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-yellow-400 text-sm text-center">
                    Your account is pending approval. You'll be redirected to the waiting page.
                  </p>
                </div>
              )}
              
              {user?.access_status === 'rejected' && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm text-center">
                    Your account application was not approved. Please contact support for more information.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <SmartSignup />
          )}
        </div>
      </div>
    </div>
  );
}