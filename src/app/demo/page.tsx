'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { User, Zap, MapPin, Music } from 'lucide-react';
import { useEffect } from 'react';

export default function DemoPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/for-you');
    }
  }, [isAuthenticated, user, router]);

  const handleDemoLogin = () => {
    // For demo purposes, redirect to signup for real authentication
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="max-w-md w-full text-center relative z-10">
        <div className="bg-gradient-to-br from-green-400 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-400/20">
          <User className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">Try the</span>
          {' '}
          <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">Demo</span>
        </h1>
        <p className="text-zinc-300 text-lg mb-10 leading-relaxed">
          Experience NightOwl TO as Alex, a 24-year-old night owl from King West who loves House, Rap, and EDM music.
        </p>

        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 mb-10 text-left border border-zinc-700/50">
          <h3 className="text-white font-bold text-xl mb-6 flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400/20 to-purple-400/20 flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-green-400" />
            </div>
            Demo User Profile
          </h3>
          <div className="space-y-4">
            <div className="flex items-center text-zinc-200">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                <MapPin className="w-5 h-5 text-green-400" />
              </div>
              <span className="font-medium">Lives in King West</span>
            </div>
            <div className="flex items-center text-zinc-200">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                <Music className="w-5 h-5 text-purple-400" />
              </div>
              <span className="font-medium">Loves House, Rap, EDM</span>
            </div>
            <div className="flex items-center text-zinc-200">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <span className="font-medium">25 loyalty points</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleDemoLogin}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-400 text-black hover:from-green-300 hover:to-emerald-300 transition-all duration-300 py-4 text-lg font-bold rounded-xl shadow-lg shadow-green-400/30 hover:shadow-green-400/50 hover:scale-105 transform"
          >
            🚀 Enter Demo as Alex
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-300 py-4 text-lg rounded-xl backdrop-blur-sm hover:bg-zinc-800/50"
          >
            ← Back to Home
          </Button>
        </div>

        <p className="text-xs text-zinc-500 mt-6">
          This is a demo experience. No real data is saved.
        </p>
      </div>
    </div>
  );
}
