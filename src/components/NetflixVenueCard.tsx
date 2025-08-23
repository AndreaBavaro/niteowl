'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bar } from '@/lib/types';
import { MapPin, Star, Clock, Users, Heart, Play, Plus, ChevronDown } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface NetflixVenueCardProps {
  venue: Bar;
  priority?: boolean;
}

export const NetflixVenueCard: React.FC<NetflixVenueCardProps> = ({ 
  venue, 
  priority = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isVenueFavorite = isFavorite(venue.id);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
        return currentHour >= 17 && currentHour <= 20;
      }
      if (event.type === 'live_music') {
        return currentHour >= 21;
      }
      return true;
    });
  };

  const liveEvent = getLiveEvent();

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        zIndex: isHovered ? 20 : 1,
      }}
    >
      {/* Main Card */}
      <div className={`relative w-80 transition-all duration-300 ${
        isHovered ? 'shadow-2xl shadow-black/50' : ''
      }`}>
        {/* Image Container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-800">
          <Image
            src={venue.image_url || '/api/placeholder/320/180'}
            alt={venue.name}
            fill
            className={`object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            priority={priority}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Live Event Badge */}
          {liveEvent && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {liveEvent.type === 'happy_hour' ? 'Happy Hour' : 'Live Music'}
            </div>
          )}
          
          {/* Venue Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg mb-1 truncate">
              {venue.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{venue.neighborhood}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span>{venue.rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Expanded Info Panel (appears on hover) */}
        {isHovered && (
          <div className="absolute top-full left-0 right-0 bg-neutral-900 rounded-b-lg border border-neutral-700 p-4 shadow-2xl">
            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 mb-3">
              <Link 
                href={`/bars/${venue.slug}`}
                className="flex items-center justify-center w-8 h-8 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </Link>
              
              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                  isVenueFavorite 
                    ? 'bg-red-600 border-red-600 text-white' 
                    : 'border-neutral-600 text-neutral-400 hover:border-white hover:text-white'
                }`}
              >
                {isVenueFavorite ? (
                  <Heart className="w-4 h-4 fill-current" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
              
              <button className="flex items-center justify-center w-8 h-8 border-2 border-neutral-600 text-neutral-400 rounded-full hover:border-white hover:text-white transition-all">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            {/* Venue Features */}
            <div className="flex flex-wrap gap-2 mb-3">
              {venue.has_rooftop && (
                <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                  Rooftop
                </span>
              )}
              {venue.has_dancefloor && (
                <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs font-medium">
                  Dance Floor
                </span>
              )}
              {venue.live_music_days?.length > 0 && (
                <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs font-medium">
                  Live Music
                </span>
              )}
              {venue.current_wait_time && (
                <span className="bg-orange-600/20 text-orange-300 px-2 py-1 rounded text-xs font-medium">
                  {venue.current_wait_time}m wait
                </span>
              )}
            </div>
            
            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
              {venue.capacity_size && (
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span className="capitalize">{venue.capacity_size}</span>
                </div>
              )}
              {venue.current_wait_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{venue.current_wait_time} min wait</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            {venue.description && (
              <p className="text-neutral-300 text-xs mt-2 line-clamp-2">
                {venue.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
