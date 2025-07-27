'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MusicGenre } from '@/lib/types';
import { MapPin, Music, Calendar, ArrowRight, User } from 'lucide-react';

const MUSIC_GENRES: MusicGenre[] = [
  'House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 
  'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'
];

const TORONTO_NEIGHBORHOODS = [
  'King West', 'Queen West', 'Entertainment District', 'Financial District',
  'Distillery District', 'Kensington Market', 'Ossington', 'Dundas West',
  'Junction', 'Leslieville', 'Riverdale', 'Corktown', 'Liberty Village',
  'CityPlace', 'Harbourfront', 'St. Lawrence Market', 'Church-Wellesley',
  'Yorkville', 'Annex', 'Little Italy', 'Little Portugal', 'Chinatown',
  'Parkdale', 'Roncesvalles', 'High Park', 'Bloor West', 'Danforth',
  'Beaches', 'Leslieville', 'Other'
];

export default function PreferencesPage() {
  const { user, isAuthenticated, isLoading, updateUserProfile, updateLastActive } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    location_neighbourhood: '',
    preferred_music: [] as MusicGenre[],
    age: '',
    full_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signup');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        location_neighbourhood: user.location_neighbourhood || '',
        preferred_music: user.preferred_music || [],
        age: user.age?.toString() || '',
        full_name: user.full_name || ''
      });
    }
  }, [user]);

  const handleMusicToggle = (genre: MusicGenre) => {
    setFormData(prev => ({
      ...prev,
      preferred_music: prev.preferred_music.includes(genre)
        ? prev.preferred_music.filter(g => g !== genre)
        : [...prev.preferred_music, genre]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.location_neighbourhood || formData.preferred_music.length === 0 || !formData.age || !formData.full_name) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 99) {
        setError('Please enter a valid age between 18 and 99');
        setLoading(false);
        return;
      }

      // Update user profile
      const { error: updateError } = await updateUserProfile({
        full_name: formData.full_name,
        location_neighbourhood: formData.location_neighbourhood,
        preferred_music: formData.preferred_music,
        age: age
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update preferences');
        setLoading(false);
        return;
      }

      // Update last active timestamp
      await updateLastActive();

      // Redirect to main app
      router.push('/for-you');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-zinc-400 text-lg">
              Help us personalize your nightlife experience
            </p>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Full Name */}
              <div>
                <label className="flex items-center text-lg font-semibold text-white mb-4">
                  <User className="w-5 h-5 mr-2 text-green-400" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label className="flex items-center text-lg font-semibold text-white mb-4">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  Age *
                </label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Neighborhood */}
              <div>
                <label className="flex items-center text-lg font-semibold text-white mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                  Preferred Neighborhood *
                </label>
                <select
                  value={formData.location_neighbourhood}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_neighbourhood: e.target.value }))}
                  className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select your preferred area</option>
                  {TORONTO_NEIGHBORHOODS.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </select>
              </div>

              {/* Music Preferences */}
              <div>
                <label className="flex items-center text-lg font-semibold text-white mb-4">
                  <Music className="w-5 h-5 mr-2 text-yellow-400" />
                  Music Preferences * (Select at least one)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MUSIC_GENRES.map(genre => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleMusicToggle(genre)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.preferred_music.includes(genre)
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                          : 'bg-zinc-700 border-zinc-600 text-zinc-300 hover:border-yellow-500/50'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                  Selected: {formData.preferred_music.length} genre{formData.preferred_music.length !== 1 ? 's' : ''}
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <span className="text-red-400">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-zinc-700 disabled:to-zinc-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center text-lg"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
