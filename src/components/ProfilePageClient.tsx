'use client';

import { useState, useEffect } from 'react';
import { MapPin, Music, Calendar, Star, Award, Edit, Save, X, Check } from 'lucide-react';
import TopNavigation from '@/components/TopNavigation';
import UserBarExperience from '@/components/UserBarExperience';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { MusicGenre, User } from '@/lib/types';

const MUSIC_GENRES: MusicGenre[] = ['House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'];
const TORONTO_NEIGHBORHOODS = ['King West', 'Entertainment District', 'Queen West', 'Kensington Market', 'Distillery District', 'Liberty Village', 'Ossington', 'Yorkville', 'The Beaches', 'Leslieville'];

interface ProfilePageClientProps {
  user: User;
}

export default function ProfilePageClient({ user }: ProfilePageClientProps) {
  const { updatePreferences, isLoading: isUpdating, error: updateError, clearError } = useUserPreferences();
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    first_neighbourhood: '',
    second_neighbourhood: '',
    third_neighbourhood: '',
    preferred_music: [] as MusicGenre[],
    age: 0
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize edit data when user changes or edit mode is enabled
  useEffect(() => {
    if (user && isEditMode) {
      setEditData({
        first_neighbourhood: user.first_neighbourhood || '',
        second_neighbourhood: user.second_neighbourhood || '',
        third_neighbourhood: user.third_neighbourhood || '',
        preferred_music: user.preferred_music || [],
        age: user.age || 0
      });
    }
  }, [user, isEditMode]);

  // Handle saving preferences
  const handleSavePreferences = async () => {
    clearError();
    const result = await updatePreferences(editData);
    
    if (result.success) {
      setIsEditMode(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setIsEditMode(false);
    clearError();
    // Reset edit data to current user data
    if (user) {
      setEditData({
        first_neighbourhood: user.first_neighbourhood || '',
        second_neighbourhood: user.second_neighbourhood || '',
        third_neighbourhood: user.third_neighbourhood || '',
        preferred_music: user.preferred_music || [],
        age: user.age || 0
      });
    }
  };

  // Handle music genre toggle
  const toggleMusicGenre = (genre: MusicGenre) => {
    setEditData(prev => ({
      ...prev,
      preferred_music: prev.preferred_music.includes(genre)
        ? prev.preferred_music.filter(g => g !== genre)
        : [...prev.preferred_music, genre]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <TopNavigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}`}
                alt={user.full_name || 'User'}
                className="w-24 h-24 rounded-full border-4 border-green-400/30 shadow-lg shadow-green-400/20"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-400 text-black rounded-full p-2">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.full_name || 'Anonymous User'}
              </h1>
              <p className="text-zinc-300 mb-2">{user.email}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-green-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{user.loyalty_points || 0} points</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-medium rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSavePreferences}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-green-400 hover:bg-green-500 disabled:bg-green-600 text-black font-medium rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-600 hover:bg-zinc-700 disabled:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-400/30 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-100">Preferences updated successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {updateError && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-400/30 rounded-lg flex items-center gap-3">
              <X className="w-5 h-5 text-red-400" />
              <span className="text-red-100">{updateError}</span>
            </div>
          )}
        </div>

        {/* Preferences Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Neighborhoods */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Preferred Areas</h3>
            </div>
            {!isEditMode ? (
              <div className="space-y-3">
                {user.first_neighbourhood && (
                  <div className="flex items-center gap-2">
                    <span className="bg-green-400/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">1st Choice</span>
                    <span className="text-green-100">{user.first_neighbourhood}</span>
                  </div>
                )}
                {user.second_neighbourhood && (
                  <div className="flex items-center gap-2">
                    <span className="bg-green-400/15 text-green-300 px-3 py-1 rounded-full text-sm font-medium">2nd Choice</span>
                    <span className="text-green-100">{user.second_neighbourhood}</span>
                  </div>
                )}
                {user.third_neighbourhood && (
                  <div className="flex items-center gap-2">
                    <span className="bg-green-400/10 text-green-300 px-3 py-1 rounded-full text-sm font-medium">3rd Choice</span>
                    <span className="text-green-100">{user.third_neighbourhood}</span>
                  </div>
                )}
                {!user.first_neighbourhood && (
                  <p className="text-green-300/70">No neighborhoods selected</p>
                )}
                <p className="text-green-300/70 text-sm mt-2">
                  We'll prioritize bars in these areas for your recommendations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-green-200 text-sm font-medium mb-2">First Choice</label>
                  <select
                    value={editData.first_neighbourhood}
                    onChange={(e) => setEditData(prev => ({ ...prev, first_neighbourhood: e.target.value }))}
                    className="w-full bg-green-900/20 border border-green-500/30 rounded-lg px-3 py-2 text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  >
                    <option value="">Select a neighborhood</option>
                    {TORONTO_NEIGHBORHOODS.map(neighborhood => (
                      <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-green-200 text-sm font-medium mb-2">Second Choice (Optional)</label>
                  <select
                    value={editData.second_neighbourhood}
                    onChange={(e) => setEditData(prev => ({ ...prev, second_neighbourhood: e.target.value }))}
                    className="w-full bg-green-900/20 border border-green-500/30 rounded-lg px-3 py-2 text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  >
                    <option value="">Select a neighborhood</option>
                    {TORONTO_NEIGHBORHOODS.map(neighborhood => (
                      <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-green-200 text-sm font-medium mb-2">Third Choice (Optional)</label>
                  <select
                    value={editData.third_neighbourhood}
                    onChange={(e) => setEditData(prev => ({ ...prev, third_neighbourhood: e.target.value }))}
                    className="w-full bg-green-900/20 border border-green-500/30 rounded-lg px-3 py-2 text-green-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  >
                    <option value="">Select a neighborhood</option>
                    {TORONTO_NEIGHBORHOODS.map(neighborhood => (
                      <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Music Preferences */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">Music Preferences</h3>
            </div>
            {!isEditMode ? (
              <div>
                {user.preferred_music && user.preferred_music.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {user.preferred_music.map(genre => (
                      <span
                        key={genre}
                        className="bg-purple-400/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-purple-300/70">No preferences set</p>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {MUSIC_GENRES.map(genre => (
                    <label key={genre} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editData.preferred_music.includes(genre)}
                        onChange={() => toggleMusicGenre(genre)}
                        className="rounded border-purple-500/30 text-purple-400 focus:ring-purple-400 bg-purple-900/20"
                      />
                      <span className="text-purple-200">{genre}</span>
                    </label>
                  ))}
                </div>
                <p className="text-purple-300/70 text-sm">
                  Select your favorite music genres
                </p>
              </>
            )}
          </div>

          {/* Age */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Age</h3>
            </div>
            {!isEditMode ? (
              <>
                <p className="text-blue-100 text-lg">
                  {user.age || 'Not specified'}
                </p>
                <p className="text-blue-300/70 text-sm mt-1">
                  Helps us recommend age-appropriate venues
                </p>
              </>
            ) : (
              <>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={editData.age || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter your age"
                  className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <p className="text-blue-300/70 text-sm mt-2">
                  Must be 18 or older
                </p>
              </>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-700/30 backdrop-blur-sm rounded-xl p-6 border border-zinc-600/20">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-zinc-400" />
              <h3 className="text-xl font-semibold text-white">Account</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className={`capitalize font-semibold ${
                  user.access_status === 'approved' ? 'text-green-400' : 
                  user.access_status === 'rejected' ? 'text-red-400' : 
                  'text-yellow-400'
                }`}>
                  {user.access_status || 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Member since:</span>
                <span className="text-white">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Experience Section */}
        <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
          <h3 className="text-2xl font-bold text-white mb-6">Your Bar Experience</h3>
          <UserBarExperience />
        </div>
      </div>
    </div>
  );
}
