'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Search, Heart, Star, MapPin, Music, Users, Gift, Sparkles } from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
  userName?: string;
}

const TOUR_STEPS = [
  {
    id: 1,
    title: "Welcome to NightOwl TO",
    subtitle: "Your Premium Nightlife Companion",
    description: "Discover Toronto's best bars, clubs, and nightlife experiences tailored just for you.",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-500",
    features: [
      "Personalized recommendations",
      "Real-time crowd updates",
      "Exclusive events & perks"
    ]
  },
  {
    id: 2,
    title: "Discover Amazing Venues",
    subtitle: "Find Your Perfect Night Out",
    description: "Browse curated bars and clubs based on your music preferences, location, and vibe.",
    icon: Search,
    gradient: "from-green-500 to-emerald-500",
    features: [
      "Filter by music genre",
      "Check real-time capacity",
      "See photos and reviews"
    ]
  },
  {
    id: 3,
    title: "Save Your Favorites",
    subtitle: "Never Lose Track of Great Spots",
    description: "Heart venues you love and build your personal collection of go-to places.",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    features: [
      "Create your favorites list",
      "Get notified of events",
      "Share with friends"
    ]
  },
  {
    id: 4,
    title: "Earn Loyalty Rewards",
    subtitle: "Get Rewarded for Going Out",
    description: "Earn points for visiting venues and unlock exclusive perks and experiences.",
    icon: Gift,
    gradient: "from-yellow-500 to-orange-500",
    features: [
      "Earn points per visit",
      "Unlock VIP experiences",
      "Get exclusive discounts"
    ]
  },
  {
    id: 5,
    title: "Ready to Explore?",
    subtitle: "Your Toronto Nightlife Awaits",
    description: "You're all set! Start discovering the best nightlife Toronto has to offer.",
    icon: Star,
    gradient: "from-blue-500 to-purple-500",
    features: [
      "Personalized 'For You' page",
      "Real-time recommendations",
      "Premium member benefits"
    ]
  }
];

export default function OnboardingTour({ onComplete, userName }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const step = TOUR_STEPS[currentStep];
  const IconComponent = step.icon;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-lg w-full mx-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentStep + 1) / TOUR_STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          {/* Icon */}
          <div className={`inline-flex p-6 rounded-3xl bg-gradient-to-r ${step.gradient}/20 mb-6`}>
            <IconComponent className={`w-12 h-12 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            {step.title}
          </h1>
          <h2 className={`text-lg font-semibold mb-4 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
            {step.subtitle}
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {step.description}
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {step.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.gradient}`}></div>
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex space-x-2">
            {TOUR_STEPS.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? `bg-gradient-to-r ${step.gradient}` 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-white/20'
                }`}
              ></div>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r ${step.gradient} text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span>
              {currentStep === TOUR_STEPS.length - 1 
                ? (loading ? 'Starting...' : 'Get Started') 
                : 'Next'
              }
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Welcome Message */}
        {userName && currentStep === 0 && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center">
            <p className="text-purple-300">
              Welcome aboard, {userName}! 🎉
            </p>
          </div>
        )}

        {/* Skip Option */}
        {currentStep < TOUR_STEPS.length - 1 && (
          <div className="mt-6 text-center">
            <button
              onClick={handleComplete}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Skip tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
