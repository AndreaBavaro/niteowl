'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function WaitingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signup');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user && user.access_status === 'approved') {
      router.push('/for-you');
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const getStatusIcon = () => {
    switch (user.access_status) {
      case 'approved':
        return <CheckCircle className="w-16 h-16 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-16 h-16 text-red-400" />;
      default:
        return <Clock className="w-16 h-16 text-yellow-400 animate-pulse" />;
    }
  };

  const getStatusMessage = () => {
    switch (user.access_status) {
      case 'approved':
        return {
          title: "Welcome to NightOwl TO! 🎉",
          message: "Your access has been approved. Redirecting to your personalized experience...",
          color: "text-green-400"
        };
      case 'rejected':
        return {
          title: "Access Denied",
          message: "Unfortunately, your access request has been declined. Please contact support if you believe this is an error.",
          color: "text-red-400"
        };
      default:
        return {
          title: "Almost There! ⏳",
          message: "Your access is being reviewed. You'll receive an update soon. Thanks for your patience!",
          color: "text-yellow-400"
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
            <div className="flex justify-center mb-6">
              {getStatusIcon()}
            </div>
            
            <h1 className={`text-3xl font-bold mb-4 ${status.color}`}>
              {status.title}
            </h1>
            
            <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
              {status.message}
            </p>

            {user.access_status === 'pending' && (
              <div className="space-y-4">
                <div className="bg-zinc-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">What's Next?</h3>
                  <ul className="text-zinc-400 text-sm space-y-1 text-left">
                    <li>• We're reviewing your application</li>
                    <li>• You'll be notified via email when approved</li>
                    <li>• This usually takes 24-48 hours</li>
                  </ul>
                </div>
                
                <div className="text-xs text-zinc-500">
                  Applied as: {user.full_name || user.email}
                </div>
              </div>
            )}

            {user.access_status === 'rejected' && (
              <button
                onClick={() => router.push('/signup')}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Contact Support
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
