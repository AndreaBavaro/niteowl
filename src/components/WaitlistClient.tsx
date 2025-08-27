'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Mail, Phone, User, Trophy, Star, Clock, Users, MapPin, Music, Zap, Award, Heart, TrendingUp, ChevronLeft, Check, ChevronRight, Gem, Brain, DollarSign, Play, Gift, Utensils, TreePine, Home, Mic } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface PreferenceData {
  age: string;
  neighborhood: string;
  musicGenres: string[];
}

type ViewState = 'landing' | 'preferences' | 'algorithm' | 'demo' | 'signup' | 'barDetail';

// NiteFinder Logo Component
const NiteFinderLogo = ({ className = "w-48 h-48" }: { className?: string }) => (
  <img 
    src="/logo.png"
    alt="NiteFinder Logo"
    className={`${className} object-contain`}
    style={{ maxWidth: '100%', height: 'auto' }}
  />
);

// Landing View Component
const LandingView = ({ onTryItOut, onJoinWaitlist }: { onTryItOut: () => void; onJoinWaitlist: () => void }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-900 via-purple-900/10 to-neutral-900">
    {/* Hero Section */}
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col items-center justify-center mb-6">
          <NiteFinderLogo className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 mb-2" />
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent mb-2 -mt-2">
            NiteFinder
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-center mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">Toronto's</span> <span className="text-white">Smartest</span> <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">Nightlife</span> <span className="text-white">Platform</span>
          </h2>
        </div>

        {/* Feature Bullets */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1 tracking-tight">Discover Your Perfect Night Out</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">Find new bars and clubs tailored to your music taste and vibe preferences</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Gem className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1 tracking-tight">Help Hidden Gems Get Discovered</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">Submit new bars to the community and help local spots gain exposure</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1 tracking-tight">Real-Time Nightlife Intelligence</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">Access live wait times, submit updates, and verify community-reported data</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-xl p-4 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1 tracking-tight">Earn Rewards for Your Contributions</h3>
                <p className="text-neutral-400 text-xs leading-relaxed">Stay active with submissions and reviews to earn loyalty points redeemable for exclusive prizes</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={onTryItOut}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 flex items-center gap-3 group shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Try It Out
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={onJoinWaitlist}
            className="border-2 border-purple-500/50 bg-neutral-900/50 backdrop-blur-sm text-purple-300 hover:bg-purple-500 hover:text-white hover:border-purple-500 font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Gift className="w-5 h-5" />
            Join Waitlist
          </button>
        </div>

        {/* Social Proof */}
        <div className="mt-8 flex items-center justify-center gap-4 text-neutral-400">
          <div className="flex -space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full border-2 border-neutral-900 shadow-lg"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-neutral-900 shadow-lg"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full border-2 border-neutral-900 shadow-lg"></div>
          </div>
          <div className="text-center">
            <span className="font-bold text-white text-lg">500+</span>
            <p className="text-neutral-400 text-sm">people already joined</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Preferences View Component
const PreferencesView = ({ 
  preferenceData, 
  setPreferenceData, 
  onContinue, 
  onBack 
}: { 
  preferenceData: PreferenceData;
  setPreferenceData: (data: PreferenceData) => void;
  onBack: () => void;
  onContinue: () => void;
}) => {
  const musicGenres = ['Hip-hop', 'EDM', 'Rap', 'House', 'Jazz', 'City-pop', 'Top 40', 'Pop', 'Mixed/Variety', 'Live bands'];
  const neighborhoods = ['King West', 'Entertainment District', 'Queen West', 'Kensington Market', 'Distillery District', 'Liberty Village', 'Financial District', 'Yorkville'];

  const toggleMusicGenre = (genre: string) => {
    setPreferenceData({
      ...preferenceData,
      musicGenres: preferenceData.musicGenres.includes(genre)
        ? preferenceData.musicGenres.filter(g => g !== genre)
        : [...preferenceData.musicGenres, genre]
    });
  };

  const canProceed = preferenceData.age && preferenceData.neighborhood && preferenceData.musicGenres.length > 0;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-neutral-900 via-purple-900/10 to-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-center">
          <NiteFinderLogo className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28" />
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tell Us About Yourself</h2>
            <p className="text-neutral-300 text-lg">Help us personalize your nightlife experience</p>
          </div>

          <div className="space-y-8">
            {/* Age */}
            <div>
              <label className="block text-white font-semibold mb-4 text-lg">What's your age?</label>
              <div className="grid grid-cols-3 gap-3">
                {['18-24', '25-34', '35+'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setPreferenceData({ ...preferenceData, age })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      preferenceData.age === age
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-white font-semibold mb-4 text-lg">Preferred neighborhood?</label>
              <div className="grid grid-cols-2 gap-3">
                {neighborhoods.map((neighborhood) => (
                  <button
                    key={neighborhood}
                    onClick={() => setPreferenceData({ ...preferenceData, neighborhood })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all text-sm ${
                      preferenceData.neighborhood === neighborhood
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {neighborhood}
                  </button>
                ))}
              </div>
            </div>

            {/* Music Preferences */}
            <div>
              <label className="block text-white font-semibold mb-4 text-lg">Music preferences? (Select multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {musicGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleMusicGenre(genre)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all text-sm ${
                      preferenceData.musicGenres.includes(genre)
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-12 text-center">
            <button
              onClick={onContinue}
              disabled={!canProceed}
              className={`py-4 px-8 rounded-xl font-semibold text-lg transition-all flex items-center gap-3 mx-auto ${
                canProceed
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                  : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Algorithm View Component
const AlgorithmView = ({ onComplete }: { onComplete: () => void }) => {
  useState(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-neutral-900 via-purple-900/10 to-neutral-900">
      <div className="text-center">
        <div className="mb-8">
          <NiteFinderLogo className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-6 animate-pulse" />
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Spinning Up The Algorithm</h2>
        <p className="text-neutral-300 text-lg">Finding your perfect nightlife matches...</p>
        
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Bar Display Component
const SimpleBarDisplay = ({ bars, onBarClick }: { bars: any[]; onBarClick: (bar: any) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextBar = () => {
    setCurrentIndex(prev => (prev + 1) % bars.length);
  };

  const prevBar = () => {
    setCurrentIndex(prev => (prev - 1 + bars.length) % bars.length);
  };

  const currentBar = bars[currentIndex];

  return (
    <div className="flex flex-col">
      {/* Navigation buttons */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={prevBar}
          className="p-1 rounded-full bg-neutral-800/50 hover:bg-neutral-700/50 transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        
        <span className="text-sm md:text-base text-neutral-400">
          {currentIndex + 1} of {bars.length}
        </span>
        
        <button
          onClick={nextBar}
          className="p-1 rounded-full bg-neutral-800/50 hover:bg-neutral-700/50 transition-all"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Single bar card - clickable */}
      <div 
        onClick={() => onBarClick(currentBar)}
        className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-3 cursor-pointer hover:border-purple-500/50 hover:bg-neutral-700/50 transition-all duration-200"
      >
        {/* Blurred bar image placeholder */}
        <div className="w-full h-24 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg mb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 bg-white/20 rounded-full blur-sm mx-auto mb-1"></div>
              <div className="w-16 h-3 bg-white/20 rounded blur-sm mx-auto mb-1"></div>
              <div className="w-12 h-2 bg-white/20 rounded blur-sm mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Visible metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-neutral-400">Wait Time</span>
            <span className="text-white font-medium text-base md:text-lg">{currentBar.waitTime}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-neutral-400">Capacity</span>
            <span className="text-white font-medium text-base md:text-lg">{currentBar.capacity}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-neutral-400">Cover</span>
            <span className="text-white font-medium text-base md:text-lg">{currentBar.cover}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-neutral-400">Music</span>
            <span className="text-white font-medium text-sm md:text-base">{currentBar.music}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-base text-neutral-400">Rating</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
              <span className="text-white font-medium text-base md:text-lg">{currentBar.rating}</span>
            </div>
          </div>
        </div>
        
        {/* Click indicator */}
        <div className="mt-3 text-center">
          <span className="text-xs text-purple-400">Click for details</span>
        </div>
      </div>
    </div>
  );
};

// Bar Detail View Component
const BarDetailView = ({ 
  bar, 
  onBack 
}: { 
  bar: any; 
  onBack: () => void;
}) => {
  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-neutral-900 via-purple-900/10 to-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center justify-center">
          <NiteFinderLogo className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-2" />
          <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
            NiteFinder
          </h1>
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">Bar Details</h2>
          <p className="text-sm md:text-base text-neutral-300">All the info you need to make your decision</p>
        </div>

        {/* Mobile: Vertical Layout */}
        <div className="md:hidden">
          {/* Features/Amenities */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-white mb-2">Features & Amenities</h4>
            <div className="flex flex-wrap gap-1">
              {bar.openLate && (
                <div className="flex items-center gap-1 bg-purple-600/20 border border-purple-500/30 rounded-full px-2 py-1">
                  <Clock className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-300">Open Late</span>
                </div>
              )}
              {bar.serveFood && (
                <div className="flex items-center gap-1 bg-green-600/20 border border-green-500/30 rounded-full px-2 py-1">
                  <Utensils className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-300">Food</span>
                </div>
              )}
              {bar.hasPatio && (
                <div className="flex items-center gap-1 bg-blue-600/20 border border-blue-500/30 rounded-full px-2 py-1">
                  <TreePine className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-300">Patio</span>
                </div>
              )}
              {bar.danceFloor && (
                <div className="flex items-center gap-1 bg-pink-600/20 border border-pink-500/30 rounded-full px-2 py-1">
                  <Music className="w-3 h-3 text-pink-400" />
                  <span className="text-xs text-pink-300">Dance Floor</span>
                </div>
              )}
              {bar.liveMusic && (
                <div className="flex items-center gap-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full px-2 py-1">
                  <Mic className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-300">Live Music</span>
                </div>
              )}
              {bar.rooftop && (
                <div className="flex items-center gap-1 bg-orange-600/20 border border-orange-500/30 rounded-full px-2 py-1">
                  <Home className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-orange-300">Rooftop</span>
                </div>
              )}
            </div>
          </div>

          {/* Blurred Bar Image */}
          <div className="w-full h-32 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full blur-lg mx-auto mb-2"></div>
                <div className="w-24 h-4 bg-white/20 rounded blur-lg mx-auto mb-1"></div>
                <div className="w-16 h-3 bg-white/20 rounded blur-lg mx-auto"></div>
              </div>
            </div>
            
            <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-full">
              <span className="text-white text-xs font-medium">Name Hidden</span>
            </div>
            
            {/* CTA Overlay */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 text-center">
                <p className="text-white text-xs font-medium mb-2">Want to know which bar this is?</p>
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-1 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 text-xs">
                  <Gift className="w-3 h-3" />
                  <span>Join Waitlist</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-2">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold text-sm">Wait Time</span>
              </div>
              <p className="text-lg font-bold text-white">{bar.waitTime}</p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-2">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold text-sm">Capacity</span>
              </div>
              <p className="text-lg font-bold text-white">{bar.capacity}</p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-2">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold text-sm">Cover</span>
              </div>
              <p className="text-lg font-bold text-white">{bar.cover}</p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-2">
              <div className="flex items-center gap-2 mb-1">
                <Music className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold text-sm">Music</span>
              </div>
              <p className="text-lg font-bold text-white">{bar.music}</p>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-2">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold text-sm">Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold text-white">{bar.rating}</p>
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3 h-3 ${i <= parseFloat(bar.rating) ? 'text-yellow-400 fill-current' : 'text-neutral-600'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-2">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-white font-semibold text-sm">Location</span>
              </div>
              <p className="text-lg font-bold text-white">Downtown</p>
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:flex gap-8">
          {/* Left Side: Image and Features */}
          <div className="flex-1">
            {/* Features/Amenities */}
            <div className="mb-6">
              <h4 className="text-base font-semibold text-white mb-3">Features & Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {bar.openLate && (
                  <div className="flex items-center gap-1 bg-purple-600/20 border border-purple-500/30 rounded-full px-2 py-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-300">Open Late</span>
                  </div>
                )}
                {bar.serveFood && (
                  <div className="flex items-center gap-1 bg-green-600/20 border border-green-500/30 rounded-full px-2 py-1">
                    <Utensils className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-300">Food</span>
                  </div>
                )}
                {bar.hasPatio && (
                  <div className="flex items-center gap-1 bg-blue-600/20 border border-blue-500/30 rounded-full px-2 py-1">
                    <TreePine className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-blue-300">Patio</span>
                  </div>
                )}
                {bar.danceFloor && (
                  <div className="flex items-center gap-1 bg-pink-600/20 border border-pink-500/30 rounded-full px-2 py-1">
                    <Music className="w-3 h-3 text-pink-400" />
                    <span className="text-xs text-pink-300">Dance Floor</span>
                  </div>
                )}
                {bar.liveMusic && (
                  <div className="flex items-center gap-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full px-2 py-1">
                    <Mic className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-300">Live Music</span>
                  </div>
                )}
                {bar.rooftop && (
                  <div className="flex items-center gap-1 bg-orange-600/20 border border-orange-500/30 rounded-full px-2 py-1">
                    <Home className="w-3 h-3 text-orange-400" />
                    <span className="text-xs text-orange-300">Rooftop</span>
                  </div>
                )}
              </div>
            </div>

            {/* Blurred Bar Image */}
            <div className="w-full h-80 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full blur-lg mx-auto mb-6"></div>
                  <div className="w-64 h-10 bg-white/20 rounded blur-lg mx-auto mb-3"></div>
                  <div className="w-40 h-8 bg-white/20 rounded blur-lg mx-auto"></div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">Name Hidden</span>
              </div>
              
              {/* CTA Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-white text-sm font-medium mb-3">Want to know which bar this is?</p>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm">
                    <Gift className="w-4 h-4" />
                    <span>Join Waitlist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Metrics */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold text-base">Wait Time</span>
                </div>
                <p className="text-2xl font-bold text-white">{bar.waitTime}</p>
                <p className="text-sm text-neutral-400">Current estimated wait</p>
              </div>

              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold text-base">Capacity</span>
                </div>
                <p className="text-2xl font-bold text-white">{bar.capacity}</p>
                <p className="text-sm text-neutral-400">How busy it is right now</p>
              </div>

              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold text-base">Cover Charge</span>
                </div>
                <p className="text-2xl font-bold text-white">{bar.cover}</p>
                <p className="text-sm text-neutral-400">Entry fee tonight</p>
              </div>

              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold text-base">Music Style</span>
                </div>
                <p className="text-2xl font-bold text-white">{bar.music}</p>
                <p className="text-sm text-neutral-400">Tonight's vibe</p>
              </div>

              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold text-base">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-white">{bar.rating}</p>
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= parseFloat(bar.rating) ? 'text-yellow-400 fill-current' : 'text-neutral-600'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-neutral-400">Community rating</p>
              </div>

              <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-semibold text-base">Location</span>
                </div>
                <p className="text-2xl font-bold text-white">Downtown</p>
                <p className="text-sm text-neutral-400">Neighborhood area</p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

// Demo View Component - Netflix-style blurred bars
const DemoView = ({ 
  preferenceData, 
  onJoinWaitlist, 
  onBack,
  onBarClick
}: { 
  preferenceData: PreferenceData; 
  onJoinWaitlist: () => void; 
  onBack: () => void;
  onBarClick: (bar: any) => void;
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const mockBars = {
    forYou: [
      { waitTime: "5-10 min", capacity: "65% full", cover: "$15", music: "Hip-Hop & R&B", rating: 4.6, openLate: true, serveFood: true, hasPatio: false, danceFloor: true, liveMusic: false, rooftop: false },
      { waitTime: "No wait", capacity: "45% full", cover: "$10", music: "House & EDM", rating: 4.4, openLate: false, serveFood: false, hasPatio: true, danceFloor: true, liveMusic: false, rooftop: true },
      { waitTime: "15-20 min", capacity: "85% full", cover: "$20", music: "Top 40", rating: 4.8, openLate: true, serveFood: true, hasPatio: true, danceFloor: true, liveMusic: true, rooftop: false }
    ],
    patios: [
      { waitTime: "No wait", capacity: "30% full", cover: "Free", music: "Chill House", rating: 4.3, openLate: false, serveFood: true, hasPatio: true, danceFloor: false, liveMusic: false, rooftop: true },
      { waitTime: "5 min", capacity: "50% full", cover: "$5", music: "Jazz", rating: 4.5, openLate: false, serveFood: true, hasPatio: true, danceFloor: false, liveMusic: true, rooftop: false }
    ],
    noCover: [
      { waitTime: "10 min", capacity: "70% full", cover: "Free", music: "Mixed", rating: 4.2, openLate: true, serveFood: false, hasPatio: false, danceFloor: true, liveMusic: false, rooftop: false },
      { waitTime: "No wait", capacity: "40% full", cover: "Free", music: "Live Band", rating: 4.7, openLate: false, serveFood: true, hasPatio: false, danceFloor: false, liveMusic: true, rooftop: false }
    ],
    chatEat: [
      { waitTime: "5 min", capacity: "55% full", cover: "$8", music: "Lounge", rating: 4.4, openLate: false, serveFood: true, hasPatio: true, danceFloor: false, liveMusic: false, rooftop: false },
      { waitTime: "No wait", capacity: "35% full", cover: "$12", music: "Acoustic", rating: 4.6, openLate: true, serveFood: true, hasPatio: false, danceFloor: false, liveMusic: true, rooftop: true }
    ]
  };

  const sections = [
    { title: "For You", bars: mockBars.forYou },
    { title: "Patios", bars: mockBars.patios },
    { title: "No Cover Charge", bars: mockBars.noCover },
    { title: "Chat & Eat", bars: mockBars.chatEat }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-900 via-purple-900/10 to-neutral-900">
      {/* Sticky Header with CTA */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-sm border-b border-neutral-800 z-50 p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <NiteFinderLogo className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              NiteFinder
            </h1>
          </div>
          <button
            onClick={onJoinWaitlist}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
          >
            <Gift className="w-4 h-4" />
            Join Waitlist
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Your Personalized Nightlife</h2>
          <p className="text-lg md:text-xl text-neutral-300">Based on your preferences: {preferenceData.age} • {preferenceData.neighborhood} • {preferenceData.musicGenres.join(", ")}</p>
        </div>

        {/* Mobile Section Bubbles */}
        <div className="md:hidden mb-6">
          <div className="flex justify-between items-center px-4">
            {sections.map((section, index) => (
              <button
                key={section.title}
                onClick={() => setActiveSection(index)}
                className={`flex-1 mx-1 aspect-square rounded-full flex flex-col items-center justify-center transition-all ${
                  activeSection === index
                    ? 'bg-purple-600 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <div className="text-sm font-medium text-center leading-tight">
                  {section.title === 'For You' && 'For\nYou'}
                  {section.title === 'Patios' && 'Patios'}
                  {section.title === 'No Cover Charge' && 'No\nCover'}
                  {section.title === 'Chat & Eat' && 'Chat &\nEat'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Side by side sections */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto">
            {sections.map((section, sectionIndex) => (
              <div key={section.title} className="flex flex-col max-w-xs">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
                  {section.title}
                  <span className="block text-sm md:text-base text-neutral-400 font-normal">({section.bars.length} matches)</span>
                </h3>
                
                <SimpleBarDisplay bars={section.bars} onBarClick={onBarClick} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Single active section */}
        <div className="md:hidden">
          <div className="mb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              {sections[activeSection].title}
              <span className="text-lg md:text-xl text-neutral-400 font-normal">({sections[activeSection].bars.length} matches)</span>
            </h3>
          </div>
          
          <SimpleBarDisplay bars={sections[activeSection].bars} onBarClick={onBarClick} />
          
          {/* Mobile navigation */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {sections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSection(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeSection ? 'bg-purple-500' : 'bg-neutral-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Signup View Component
const SignupView = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  isSubmitting, 
  onBack 
}: { 
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onBack: () => void;
}) => {
  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-neutral-900 via-purple-900/10 to-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-center">
          <NiteFinderLogo className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28" />
        </div>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Join the Waitlist</h2>
            <p className="text-lg text-neutral-300 mb-2">Get early access to Toronto's smartest nightlife platform</p>
            <p className="text-neutral-400">Plus referral rewards and loyalty points</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-neutral-800 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-neutral-800 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-neutral-800 border border-neutral-600 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="(416) 555-0123"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-600/50 disabled:to-purple-700/50 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Joining the Pack...
                </>
              ) : (
                <>
                  <Trophy className="w-6 h-6" />
                  Join the Pack
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-3 text-sm text-neutral-400 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full border-2 border-neutral-900"></div>
                <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-neutral-900"></div>
                <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-neutral-900"></div>
              </div>
              <span className="font-medium">500+ people already joined</span>
            </div>
            <p className="text-xs text-neutral-500">
              Web app launching in the coming weeks • Mobile app eventually
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WaitlistClient() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '' });
  const [preferenceData, setPreferenceData] = useState<PreferenceData>({ 
    age: '', 
    neighborhood: '', 
    musicGenres: [] 
  });
  const [selectedBar, setSelectedBar] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTryItOut = () => {
    setCurrentView('preferences');
  };

  const handleJoinWaitlist = () => {
    setCurrentView('signup');
  };

  const handleBarClick = (bar: any) => {
    setSelectedBar(bar);
    setCurrentView('barDetail');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: preferenceData.age,
          neighborhood: preferenceData.neighborhood,
          musicGenres: preferenceData.musicGenres,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', phone: '' });
      } else {
        console.error('Failed to submit form:', result.error);
        alert(result.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-purple-900/20 to-neutral-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to the Pack!</h2>
          <p className="text-neutral-300 text-lg mb-6">
            You're on the waitlist. We'll notify you when we launch.
          </p>
          <p className="text-sm text-neutral-400">
            Share your referral code to move up the list and earn rewards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-purple-900/10 to-neutral-900">
      {currentView === 'landing' && (
        <LandingView 
          onTryItOut={handleTryItOut}
          onJoinWaitlist={handleJoinWaitlist}
        />
      )}
      
      {currentView === 'preferences' && (
        <PreferencesView 
          preferenceData={preferenceData}
          setPreferenceData={setPreferenceData}
          onContinue={() => setCurrentView('algorithm')}
          onBack={() => setCurrentView('landing')}
        />
      )}
      
      {currentView === 'algorithm' && (
        <AlgorithmView onComplete={() => setCurrentView('demo')} />
      )}
      
      {currentView === 'demo' && (
        <DemoView 
          preferenceData={preferenceData}
          onJoinWaitlist={() => setCurrentView('signup')}
          onBack={() => setCurrentView('landing')}
          onBarClick={handleBarClick}
        />
      )}

      {currentView === 'barDetail' && selectedBar && (
        <BarDetailView 
          bar={selectedBar}
          onBack={() => setCurrentView('demo')}
        />
      )}
      
      {currentView === 'signup' && (
        <SignupView 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onBack={() => setCurrentView('demo')}
        />
      )}
    </div>
  );
}
