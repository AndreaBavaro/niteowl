'use client';

import React from 'react';
import { Heart, MessageCircle, Clock, Sparkles } from 'lucide-react';

interface WaitingPageProps {
  userName?: string;
}

export default function WaitingPage({ userName }: WaitingPageProps) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-lg w-full mx-4 text-center">
        {/* Main Icon */}
        <div className="mb-8">
          <div className="inline-flex p-6 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-6">
            <Heart className="w-12 h-12 text-pink-400 animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Thank You{userName ? `, ${userName}` : ''}! 
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <p className="text-xl text-gray-300">
              You're on the list!
            </p>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-6 mb-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MessageCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-lg font-semibold text-white">We'll Text You Soon</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We're carefully curating access to ensure the best possible experience for everyone. 
              You'll receive a text message when your access is ready!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">What's Next?</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              We're working hard to bring you Toronto's most exclusive nightlife experiences. 
              Your patience means the world to us, and we can't wait to show you what we've built.
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Coming Soon to Your NightOwl TO:</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-gray-300">Personalized bar recommendations</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-gray-300">Real-time crowd and vibe updates</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-gray-300">Exclusive events and experiences</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                <span className="text-gray-300">Loyalty rewards and perks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">
            Questions? We're here to help.
          </p>
          <p className="text-gray-400 text-xs">
            NightOwl TO - Toronto's Premium Nightlife Experience
          </p>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-purple-400/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-20 right-16 w-3 h-3 bg-pink-400/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-20 left-16 w-5 h-5 bg-green-400/30 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-32 right-10 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '3s' }}></div>
      </div>
    </div>
  );
}
