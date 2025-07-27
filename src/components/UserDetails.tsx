'use client';

import React, { useState } from 'react';
import { User, ArrowRight } from 'lucide-react';

interface UserDetailsProps {
  onComplete: (name: string) => void;
  email?: string;
  phone?: string;
}

export default function UserDetails({ onComplete, email, phone }: UserDetailsProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      onComplete(name.trim());
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-4">
            <User className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
            What's Your Name?
          </h1>
          <p className="text-gray-300">
            Help us personalize your NightOwl TO experience
          </p>
          {(email || phone) && (
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400">
                {email && <span>📧 {email}</span>}
                {email && phone && <span className="mx-2">•</span>}
                {phone && <span>📱 {phone}</span>}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Saving...' : 'Continue'}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            We'll use this to create your personalized profile
          </p>
        </div>
      </div>
    </div>
  );
}
