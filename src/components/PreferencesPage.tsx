'use client';

import React from 'react';
import { Music, MapPin, Calendar, ArrowRight, Check } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';

interface PreferencesPageProps {
  onComplete: (preferences: {
    age: number;
    music_preferences: string[];
    neighbourhood: string;
  }) => Promise<void>;
  loading?: boolean;
}

const MUSIC_GENRES = [
  'House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 
  'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'
];

const AGE_GROUPS = [
  '18-24', '25-30', '31-35', '36-40', '41-45', '46-50', '51+'
];

// Toronto neighborhoods - you can expand this list
const NEIGHBOURHOODS = [
  'Downtown', 'King West', 'Queen West', 'Entertainment District',
  'Financial District', 'Distillery District', 'Kensington Market',
  'Little Italy', 'The Annex', 'Yorkville', 'Ossington', 'Junction',
  'Leslieville', 'Riverside', 'Corktown', 'Liberty Village',
  'CityPlace', 'Harbourfront', 'Church-Wellesley', 'Other'
];

export default function PreferencesPage({ onComplete, loading: externalLoading }: PreferencesPageProps) {
  const { state, actions, isFormValid } = usePreferences();
  const { age, musicPreferences, neighbourhood, error, loading } = state;
  const { setAge, toggleMusicGenre, setNeighbourhood, submitPreferences } = actions;

  const handleSubmit = async () => {
    await submitPreferences(onComplete);
  };

  const isLoading = loading || externalLoading;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-green-400 to-purple-400 bg-clip-text text-transparent">
            Tell Us About Yourself
          </h1>
          <p className="text-gray-300 text-lg">
            Help us curate the perfect nightlife experience for you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Age Group */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Age Group</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {AGE_GROUPS.map((ageGroup: string) => {
                const ageValue = ageGroup === '51+' ? 51 : parseInt(ageGroup.split('-')[0]);
                return (
                  <button
                    key={ageGroup}
                    type="button"
                    onClick={() => setAge(ageValue)}
                    className={`p-3 rounded-xl border transition-all duration-200 ${
                      state.age === ageValue
                        ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {ageGroup}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Music Preferences */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Music className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Music You Love</h2>
              <span className="text-sm text-gray-400">({musicPreferences.length} selected)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MUSIC_GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleMusicGenre(genre)}
                  className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    musicPreferences.includes(genre)
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm">{genre}</span>
                  {musicPreferences.includes(genre) && (
                    <Check className="w-4 h-4 text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Neighbourhood */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Your Neighbourhood</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {NEIGHBOURHOODS.map((hood) => (
                <button
                  key={hood}
                  type="button"
                  onClick={() => setNeighbourhood(hood)}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    neighbourhood === hood
                      ? 'bg-green-500/20 border-green-400 text-green-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-sm">{hood}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-purple-500 text-white font-semibold hover:from-green-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Saving Preferences...' : 'Complete Setup'}</span>
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Almost done! One more step...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
