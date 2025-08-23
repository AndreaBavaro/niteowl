'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserBarVisitInput, MusicGenre, LineupTimeRange, CoverAmount, AgeGroup, VisitTimeOfDay, GroupSize } from '@/lib/types';
import { 
  Calendar, 
  Star, 
  MessageSquare, 
  Clock, 
  Users, 
  Music, 
  DollarSign, 
  Timer,
  Sparkles,
  Camera,
  X,
  Check
} from 'lucide-react';

interface BarVisitLoggerProps {
  barId: string;
  barName: string;
  onClose: () => void;
  onVisitLogged?: (visit: any) => void;
  existingVisit?: any; // For editing existing visits
}

const MUSIC_GENRES: MusicGenre[] = [
  'House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 
  'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'
];

const WAIT_TIMES: LineupTimeRange[] = ['0-10 min', '15-30 min', '30+ min'];
const COVER_AMOUNTS: CoverAmount[] = ['Under $10', '$10-$20', 'Over $20'];
const AGE_GROUPS: AgeGroup[] = ['18-21', '22-25', '25-30'];
const VISIT_TIMES: VisitTimeOfDay[] = ['afternoon', 'early_evening', 'peak_night', 'late_night'];
const GROUP_SIZES: GroupSize[] = ['solo', 'couple', 'small_group', 'large_group'];

export default function BarVisitLogger({ 
  barId, 
  barName, 
  onClose, 
  onVisitLogged,
  existingVisit 
}: BarVisitLoggerProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const [formData, setFormData] = useState<UserBarVisitInput>({
    bar_id: barId,
    visit_date: existingVisit?.visit_date || new Date().toISOString().split('T')[0],
    experience_rating: existingVisit?.experience_rating || 5,
    comment: existingVisit?.comment || '',
    
    // Optional crowd-sourced data
    reported_wait_time: existingVisit?.reported_wait_time || undefined,
    reported_cover_charge: existingVisit?.reported_cover_charge || undefined,
    reported_music_genres: existingVisit?.reported_music_genres || [],
    reported_vibe: existingVisit?.reported_vibe || '',
    reported_age_group: existingVisit?.reported_age_group || undefined,
    reported_service_rating: existingVisit?.reported_service_rating || undefined,
    
    // Additional context
    time_of_visit: existingVisit?.time_of_visit || undefined,
    group_size: existingVisit?.group_size || undefined,
    special_event: existingVisit?.special_event || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = existingVisit 
        ? `/api/user-visits?visit_id=${existingVisit.id}`
        : '/api/user-visits';
      
      const method = existingVisit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || ''
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log visit');
      }

      onVisitLogged?.(data.visit);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMusicToggle = (genre: MusicGenre) => {
    setFormData(prev => ({
      ...prev,
      reported_music_genres: prev.reported_music_genres?.includes(genre)
        ? prev.reported_music_genres.filter(g => g !== genre)
        : [...(prev.reported_music_genres || []), genre]
    }));
  };

  const getTimeOfDayLabel = (time: VisitTimeOfDay) => {
    switch (time) {
      case 'afternoon': return 'Afternoon (2-6 PM)';
      case 'early_evening': return 'Early Evening (6-9 PM)';
      case 'peak_night': return 'Peak Night (9 PM-2 AM)';
      case 'late_night': return 'Late Night (2-6 AM)';
    }
  };

  const getGroupSizeLabel = (size: GroupSize) => {
    switch (size) {
      case 'solo': return 'Solo';
      case 'couple': return 'Couple (2 people)';
      case 'small_group': return 'Small Group (3-6 people)';
      case 'large_group': return 'Large Group (7+ people)';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {existingVisit ? 'Edit Visit' : 'Log Your Visit'}
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-green-400">{barName}</h3>
            <p className="text-sm text-zinc-400">
              {existingVisit ? 'Update your experience' : 'How was your experience?'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visit Date */}
            <div>
              <label className="flex items-center text-sm font-medium text-white mb-2">
                <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                Visit Date *
              </label>
              <input
                type="date"
                value={formData.visit_date}
                onChange={(e) => setFormData(prev => ({ ...prev, visit_date: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Experience Rating */}
            <div>
              <label className="flex items-center text-sm font-medium text-white mb-2">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Overall Experience Rating * (1-10)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.experience_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience_rating: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <span className="text-white font-bold text-lg w-8 text-center">
                  {formData.experience_rating}
                </span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400 mt-1">
                <span>Poor</span>
                <span>Amazing</span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="flex items-center text-sm font-medium text-white mb-2">
                <MessageSquare className="w-4 h-4 mr-2 text-green-400" />
                Comment (Optional)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Tell us about your experience..."
                rows={3}
                className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Toggle for Optional Fields */}
            <div className="border-t border-zinc-700 pt-4">
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                {showOptionalFields ? 'Hide' : 'Add'} crowd-sourced data to help other users
              </button>
            </div>

            {/* Optional Fields */}
            {showOptionalFields && (
              <div className="space-y-4 bg-zinc-700/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-zinc-300 mb-3">
                  Help the community by sharing details about your visit
                </h4>

                {/* Time of Visit */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    Time of Visit
                  </label>
                  <select
                    value={formData.time_of_visit || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      time_of_visit: e.target.value as VisitTimeOfDay || undefined 
                    }))}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select time...</option>
                    {VISIT_TIMES.map(time => (
                      <option key={time} value={time}>
                        {getTimeOfDayLabel(time)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Group Size */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <Users className="w-4 h-4 mr-2 text-orange-400" />
                    Group Size
                  </label>
                  <select
                    value={formData.group_size || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      group_size: e.target.value as GroupSize || undefined 
                    }))}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select group size...</option>
                    {GROUP_SIZES.map(size => (
                      <option key={size} value={size}>
                        {getGroupSizeLabel(size)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wait Time */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <Timer className="w-4 h-4 mr-2 text-red-400" />
                    Wait Time
                  </label>
                  <select
                    value={formData.reported_wait_time || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      reported_wait_time: e.target.value as LineupTimeRange || undefined 
                    }))}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select wait time...</option>
                    {WAIT_TIMES.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Cover Charge */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                    Cover Charge
                  </label>
                  <select
                    value={formData.reported_cover_charge || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      reported_cover_charge: e.target.value as CoverAmount || undefined 
                    }))}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select cover charge...</option>
                    {COVER_AMOUNTS.map(amount => (
                      <option key={amount} value={amount}>{amount}</option>
                    ))}
                  </select>
                </div>

                {/* Music Genres */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <Music className="w-4 h-4 mr-2 text-yellow-400" />
                    Music You Heard
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {MUSIC_GENRES.map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleMusicToggle(genre)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.reported_music_genres?.includes(genre)
                            ? 'bg-yellow-600 text-white'
                            : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Group */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <Users className="w-4 h-4 mr-2 text-blue-400" />
                    Crowd Age Group
                  </label>
                  <select
                    value={formData.reported_age_group || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      reported_age_group: e.target.value as AgeGroup || undefined 
                    }))}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select age group...</option>
                    {AGE_GROUPS.map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>

                {/* Service Rating */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <Star className="w-4 h-4 mr-2 text-pink-400" />
                    Service Rating (1-10)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.reported_service_rating || 5}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        reported_service_rating: parseInt(e.target.value) 
                      }))}
                      className="flex-1"
                    />
                    <span className="text-white font-bold text-lg w-8 text-center">
                      {formData.reported_service_rating || 5}
                    </span>
                  </div>
                </div>

                {/* Vibe */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                    Vibe/Atmosphere
                  </label>
                  <input
                    type="text"
                    value={formData.reported_vibe}
                    onChange={(e) => setFormData(prev => ({ ...prev, reported_vibe: e.target.value }))}
                    placeholder="e.g., Energetic dance floor, Chill rooftop vibes..."
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Special Event */}
                <div>
                  <label className="flex items-center text-sm font-medium text-white mb-2">
                    <Sparkles className="w-4 h-4 mr-2 text-cyan-400" />
                    Special Event
                  </label>
                  <input
                    type="text"
                    value={formData.special_event}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_event: e.target.value }))}
                    placeholder="e.g., DJ Night, Live Band, Birthday Party..."
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {existingVisit ? 'Update Visit' : 'Log Visit'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
