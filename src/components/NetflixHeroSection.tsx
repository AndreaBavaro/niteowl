'use client';

import React from 'react';
import Image from 'next/image';
import { Bar } from '@/lib/types';
import { MapPin, Star, Play, Plus, Info } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface NetflixHeroSectionProps {
  venue: Bar;
}

export const NetflixHeroSection: React.FC<NetflixHeroSectionProps> = ({ venue }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isVenueFavorite = isFavorite(venue.id);

  const handleFavoriteToggle = async () => {
    if (isVenueFavorite) {
      await removeFavorite(venue.id);
    } else {
      await addFavorite(venue.id);
    }
  };

  const getLiveEvent = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    return venue.live_events?.find(event => {
      if (event.type === 'happy_hour') {
        return currentHour >= 17 && currentHour <= 20; // 5-8 PM
      }
      if (event.type === 'live_music') {
        return currentHour >= 21; // 9 PM onwards
      }
      return true;
    });
  };

  const liveEvent = getLiveEvent();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={venue.image_url || '/api/placeholder/1920/1080'}
          alt={venue.name}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            {/* Live Event Badge */}
            {liveEvent && (
              <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {liveEvent.type === 'happy_hour' ? 'Happy Hour Live' : 'Live Music Now'}
              </div>
            )}

            {/* Venue Name */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {venue.name}
            </h1>

            {/* Location and Rating */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{venue.neighborhood}</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg font-semibold">{venue.rating}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl text-neutral-200 mb-8 leading-relaxed max-w-xl">
              {venue.description || `Experience the best of ${venue.neighborhood}'s nightlife at ${venue.name}. ${venue.has_rooftop ? 'Featuring stunning rooftop views. ' : ''}${venue.live_music_days?.length ? 'Live music and entertainment. ' : ''}Perfect for an unforgettable night out.`}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* Play/Visit Button */}
              <button className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-neutral-200 transition-all duration-200 transform hover:scale-105">
                <Play className="w-6 h-6 fill-current" />
                Visit Now
              </button>

              {/* Add to Favorites */}
              <button 
                onClick={handleFavoriteToggle}
                className={`flex items-center gap-3 px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                  isVenueFavorite 
                    ? 'bg-neutral-800 text-white border-2 border-white' 
                    : 'bg-neutral-600/80 text-white hover:bg-neutral-600'
                }`}
              >
                <Plus className={`w-6 h-6 ${isVenueFavorite ? 'rotate-45' : ''} transition-transform duration-200`} />
                {isVenueFavorite ? 'Remove' : 'My List'}
              </button>

              {/* More Info */}
              <button className="flex items-center gap-3 bg-neutral-600/80 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-neutral-600 transition-all duration-200 transform hover:scale-105">
                <Info className="w-6 h-6" />
                More Info
              </button>
            </div>

            {/* Venue Features */}
            <div className="flex items-center gap-4 mt-8">
              {venue.has_rooftop && (
                <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                  Rooftop
                </span>
              )}
              {venue.has_dancefloor && (
                <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  Dance Floor
                </span>
              )}
              {venue.live_music_days?.length > 0 && (
                <span className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  Live Music
                </span>
              )}
              {venue.current_wait_time && (
                <span className="bg-orange-600/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                  {venue.current_wait_time} min wait
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
