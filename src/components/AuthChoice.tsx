'use client';

import React, { useState } from 'react';
import { Mail, Phone, Smartphone } from 'lucide-react';

interface AuthChoiceProps {
  onChoice: (choice: 'email' | 'phone' | 'both') => void;
}

export default function AuthChoice({ onChoice }: AuthChoiceProps) {
  const [selectedChoice, setSelectedChoice] = useState<'email' | 'phone' | 'both' | null>(null);

  const handleChoice = (choice: 'email' | 'phone' | 'both') => {
    setSelectedChoice(choice);
    setTimeout(() => onChoice(choice), 300); // Small delay for animation
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-green-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to NightOwl TO
          </h1>
          <p className="text-gray-300 text-lg">
            Choose how you'd like to sign up
          </p>
        </div>

        {/* Auth Options */}
        <div className="space-y-4">
          {/* Email Option */}
          <button
            onClick={() => handleChoice('email')}
            className={`w-full p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
              selectedChoice === 'email'
                ? 'bg-green-500/20 border-green-400 shadow-lg shadow-green-500/25'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Email</h3>
                <p className="text-gray-400">Sign up with your email address</p>
              </div>
            </div>
          </button>

          {/* Phone Option */}
          <button
            onClick={() => handleChoice('phone')}
            className={`w-full p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
              selectedChoice === 'phone'
                ? 'bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/25'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Phone</h3>
                <p className="text-gray-400">Sign up with your phone number</p>
              </div>
            </div>
          </button>

          {/* Both Option */}
          <button
            onClick={() => handleChoice('both')}
            className={`w-full p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
              selectedChoice === 'both'
                ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/25'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-white">Both</h3>
                <p className="text-gray-400">Sign up with email and phone</p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            We'll send you a verification code to confirm your identity
          </p>
        </div>
      </div>
    </div>
  );
}
