'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Star, 
  Clock, 
  EyeOff, 
  Navigation, 
  Heart, 
  Share2, 
  MapPin,
  TreePine,
  Building2,
  Utensils,
  Music,
  ExternalLink
} from 'lucide-react';
import VenueCardExpanded from './VenueCardExpanded';
import { Bar } from '@/lib/types';
import { CategoryType } from './CategorySelector';
import { useFavorites } from '@/hooks/useFavorites';

interface CategoryDisplayProps {
  category: CategoryType;
  venues: Bar[];
  onHideVenue: (venueId: string) => void;
}

const categoryConfig = {
  discoverTonight: {
    title: 'Discover Tonight',
    subtitle: 'New bars perfectly matched to your taste',
    icon: <Zap className="w-8 h-8 text-green-400" />,
    gradient: 'from-green-500/20 to-emerald-500/20',
    accentColor: 'text-green-400'
  },
  hiddenGems: {
    title: 'Hidden Gems',
    subtitle: 'Special events at Toronto\'s best-kept secrets',
    icon: <Star className="w-8 h-8 text-purple-400" />,
    gradient: 'from-purple-500/20 to-pink-500/20',
    accentColor: 'text-purple-400'
  },
  yourRegulars: {
    title: 'Your Regulars',
    subtitle: 'Places you know and love',
    icon: <Clock className="w-8 h-8 text-zinc-400" />,
    gradient: 'from-zinc-600/20 to-zinc-500/20',
    accentColor: 'text-zinc-400'
  },
  patios: {
    title: 'Patios',
    subtitle: 'Outdoor spaces perfect for tonight',
    icon: <TreePine className="w-8 h-8 text-green-500" />,
    gradient: 'from-green-600/20 to-teal-600/20',
    accentColor: 'text-green-500'
  },
  happyHour: {
    title: 'Happy Hour',
    subtitle: 'Great deals on drinks right now',
    icon: <Music className="w-8 h-8 text-orange-400" />,
    gradient: 'from-orange-500/20 to-red-500/20',
    accentColor: 'text-orange-400'
  },
  freeCover: {
    title: 'Free Cover',
    subtitle: 'No cover charge tonight',
    icon: <Star className="w-8 h-8 text-blue-400" />,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    accentColor: 'text-blue-400'
  },
  nearYou: {
    title: 'Near You',
    subtitle: 'Close venues within walking distance',
    icon: <MapPin className="w-8 h-8 text-indigo-400" />,
    gradient: 'from-indigo-500/20 to-purple-500/20',
    accentColor: 'text-indigo-400'
  }
};

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({
  category,
  venues,
  onHideVenue
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const config = categoryConfig[category];
  const { favorites, addFavorite, removeFavorite, isFavorite, loadFavorites } = useFavorites();

  // Load favorites when component mounts
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Navigation functions for desktop one-at-a-time display
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < venues.length - 1;

  const goToPrevious = () => {
    if (canGoLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (canGoRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Reset index when venues change or category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [category, venues.length]);

  if (venues.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <div className={`p-4 bg-gradient-to-br ${config.gradient} rounded-2xl inline-block mb-4`}>
            {config.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No venues available</h3>
          <p className="text-neutral-400">Check back later for new recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Buzzworthy Attributes Bar */}
      <div className="px-4 py-3 border-b border-neutral-800/20">
        <div className="max-w-7xl mx-auto">
          {venues.length > 0 && venues[currentIndex] && (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              
              {/* Live Events - Highest Priority */}
              {venues[currentIndex].live_events?.length > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 rounded-full text-sm border border-red-500/40">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-red-300 font-bold">LIVE NOW</span>
                </div>
              )}
              
              {/* Special Offers */}
              {venues[currentIndex].special_offers && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 rounded-full text-sm border border-green-500/40">
                  <span className="text-green-300">🎉</span>
                  <span className="text-green-200 font-bold">Happy Hour</span>
                </div>
              )}
              
              {/* No Cover */}
              {venues[currentIndex].cover_frequency === 'No cover' && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 rounded-full text-sm border border-blue-500/40">
                  <span className="text-blue-300">✨</span>
                  <span className="text-blue-200 font-bold">FREE Entry</span>
                </div>
              )}
              
              {/* Patio */}
              {venues[currentIndex].has_patio && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 rounded-full text-sm border border-emerald-500/40">
                  <TreePine className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-200 font-medium">Patio</span>
                </div>
              )}
              
              {/* Rooftop */}
              {venues[currentIndex].has_rooftop && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-sky-600/20 rounded-full text-sm border border-sky-500/40">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span className="text-sky-200 font-medium">Rooftop</span>
                </div>
              )}
              
              {/* Live Music */}
              {venues[currentIndex].live_music_days.length > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 rounded-full text-sm border border-purple-500/40">
                  <Music className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-200 font-medium">Live Music</span>
                </div>
              )}
              
              {/* Food Available */}
              {venues[currentIndex].has_food && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-600/20 rounded-full text-sm border border-orange-500/40">
                  <Utensils className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-200 font-medium">Food</span>
                </div>
              )}
              
              {/* High Rating */}
              {venues[currentIndex].service_rating >= 4.5 && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600/20 rounded-full text-sm border border-yellow-500/40">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-200 font-medium">Top Rated</span>
                </div>
              )}
              
              {/* No Wait */}
              {(!venues[currentIndex].current_wait_time || venues[currentIndex].current_wait_time === 'No wait') && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-teal-600/20 rounded-full text-sm border border-teal-500/40">
                  <span className="text-teal-300">⚡</span>
                  <span className="text-teal-200 font-medium">No Wait</span>
                </div>
              )}
              
            </div>
          )}
        </div>
      </div>
      
      {/* Desktop: Side-by-Side Layout */}
      <div className="hidden md:block flex-1">
        <div className="h-[70vh] max-h-[calc(100vh-120px)] flex">
          {venues.length > 0 && venues[currentIndex] && (
            <>
              {/* Left Side: Vertical Image */}
              <div className="w-2/5 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/600/600?random=${venues[currentIndex].id}`}
                  alt={venues[currentIndex].name}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                
                {/* Live Event Badge */}
                {venues[currentIndex].live_events?.length > 0 && (
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-2 bg-red-500/95 text-white text-sm font-bold rounded-full backdrop-blur-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE NOW
                    </span>
                  </div>
                )}
                
                {/* Quick Actions - Top Right of Image */}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button 
                    onClick={async () => {
                      const currentVenue = venues[currentIndex];
                      if (isFavorite(currentVenue.id)) {
                        await removeFavorite(currentVenue.id);
                      } else {
                        await addFavorite(currentVenue.id);
                      }
                    }}
                    className={`p-3 backdrop-blur-sm rounded-full shadow-xl transition-all duration-200 group ${
                      isFavorite(venues[currentIndex].id) 
                        ? 'bg-red-500/80 hover:bg-red-600/80' 
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                    aria-label={isFavorite(venues[currentIndex].id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                      isFavorite(venues[currentIndex].id) 
                        ? 'text-white fill-current' 
                        : 'text-white'
                    }`} />
                  </button>
                  <button 
                    onClick={() => {/* Share functionality not implemented */}}
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => onHideVenue(venues[currentIndex].id)}
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all duration-200"
                    aria-label="Hide this venue"
                  >
                    <EyeOff className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                {/* Venue Counter - Bottom Right of Image */}
                <div className="absolute bottom-6 right-6">
                  <div className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    {currentIndex + 1} of {venues.length}
                  </div>
                </div>
                
                {/* Navigation Arrows on Image */}
                {canGoLeft && (
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-xl transition-all duration-200 group"
                    aria-label="Previous venue"
                  >
                    <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </button>
                )}
                
                {canGoRight && (
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full shadow-xl transition-all duration-200 group"
                    aria-label="Next venue"
                  >
                    <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
              
              {/* Right Side: All Venue Information */}
              <div className="w-3/5 bg-neutral-900 overflow-y-auto">
                <div className="p-8 space-y-6">
                  
                  {/* Venue Header */}
                  <div className="space-y-3">
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
                      {venues[currentIndex].name}
                    </h1>
                    <div className="flex items-center gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium text-lg">{venues[currentIndex].neighbourhood}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-bold text-lg">{venues[currentIndex].service_rating}</span>
                        <span className="text-white/70">(150 reviews)</span>
                      </div>
                    </div>
                    <p className="text-lg text-neutral-300 leading-relaxed">
                      {venues[currentIndex].typical_vibe}
                    </p>
                  </div>
                  

                  

                  
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-800/60 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-white mb-1">
                        {venues[currentIndex].cover_frequency === 'No cover' ? 'FREE' : 
                         venues[currentIndex].cover_amount === 'Under $10' ? '$8' :
                         venues[currentIndex].cover_amount === '$10-$20' ? '$15' : '$25'}
                      </div>
                      <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Cover Charge</div>
                    </div>
                    <div className="bg-neutral-800/60 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-white mb-1">
                        {venues[currentIndex].current_wait_time || 'No wait'}
                      </div>
                      <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Wait Time</div>
                    </div>
                    <div className="bg-neutral-800/60 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-white mb-1">
                        {venues[currentIndex].capacity_size || 'Medium'}
                      </div>
                      <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Capacity</div>
                    </div>
                    <div className="bg-neutral-800/60 rounded-xl p-4 text-center">
                      <div className="text-2xl font-black text-white mb-1">
                        {venues[currentIndex].service_rating}
                      </div>
                      <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Rating</div>
                    </div>
                  </div>
                  
                  {/* Happy Hour & Live Music Information */}
                  {venues[currentIndex].live_events && venues[currentIndex].live_events.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white">What's Happening Now</h3>
                      <div className="space-y-2">
                        {venues[currentIndex].live_events.map((event, index) => {
                          const isHappyHour = event.toLowerCase().includes('happy hour');
                          const isLiveMusic = event.toLowerCase().includes('live') && (event.toLowerCase().includes('music') || event.toLowerCase().includes('acoustic') || event.toLowerCase().includes('dj'));
                          
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 bg-neutral-800/40 rounded-lg">
                              {isHappyHour && (
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                              )}
                              {isLiveMusic && (
                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                              )}
                              {!isHappyHour && !isLiveMusic && (
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                              )}
                              <span className="text-white font-medium">{event}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Live Music Schedule (if venue has regular live music days) */}
                  {venues[currentIndex].live_music_days && venues[currentIndex].live_music_days.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white">Live Music Schedule</h3>
                      <div className="flex flex-wrap gap-2">
                        {venues[currentIndex].live_music_days.map((day, index) => (
                          <div key={index} className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 rounded-lg border border-purple-500/40">
                            <Music className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-200 font-medium">{day}s</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Primary Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <button className="w-full flex items-center justify-center gap-3 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-lg transition-all duration-200 shadow-xl">
                      <Navigation className="w-5 h-5" />
                      Get Directions
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all duration-200">
                        <Heart className="w-4 h-4" />
                        Add to Favorites
                      </button>
                      {venues[currentIndex].booking_url && (
                        <button className="flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all duration-200">
                          <ExternalLink className="w-4 h-4" />
                          Book Now
                        </button>
                      )}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all duration-200">
                      View All Photos
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile: Vertical Scroll with Instagram-style Separation */}
      <div className="md:hidden flex-1 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 pb-8">
            {venues.map((venue) => {
              return (
                <div key={venue.id} className="relative group">
                  <VenueCardExpanded 
                    venue={venue}
                    onToggleFavorite={(id) => {/* Favorite functionality not implemented */}}
                    onGetDirections={(id) => {/* Directions functionality not implemented */}}
                    onShare={(id) => {/* Share functionality not implemented */}}
                  />
                
                {/* Hide Button */}
                  <button
                    onClick={() => onHideVenue(venue.id)}
                    className="absolute top-4 right-4 p-2 bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-600/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                    aria-label="Hide this venue"
                    title="Hide this venue (will show again after viewing all others)"
                  >
                    <EyeOff className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDisplay;
