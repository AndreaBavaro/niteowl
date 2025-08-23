'use client';

import React from 'react';
import { Star, MapPin, Clock, DollarSign, Users, Music, Utensils, TreePine, Building2, ExternalLink, Heart, Share2, Navigation } from 'lucide-react';
import { Bar } from '@/lib/types';

interface VenueCardExpandedProps {
  venue: Bar;
  onToggleFavorite?: (id: string) => void;
  onGetDirections?: (id: string) => void;
  onShare?: (id: string) => void;
}

const VenueCardExpanded: React.FC<VenueCardExpandedProps> = ({
  venue,
  onToggleFavorite,
  onGetDirections,
  onShare
}) => {
  // Generate a consistent image for the venue
  const imageId = Math.abs(venue.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000 + 100;
  const imageUrl = `https://picsum.photos/600/300?random=${imageId}`;

  // Format cover charge
  const getCoverText = () => {
    if (venue.cover_frequency === 'No cover') return 'No cover';
    if (venue.cover_amount) return `$${venue.cover_amount} cover`;
    return 'Cover varies';
  };

  // Format wait time
  const getWaitText = () => {
    if (venue.current_wait_time) return venue.current_wait_time;
    return 'Wait n/a';
  };

  // Get venue features
  const getFeatures = () => {
    const features = [];
    if (venue.has_patio) features.push({ icon: <TreePine className="w-4 h-4" />, label: 'Patio' });
    if (venue.has_rooftop) features.push({ icon: <Building2 className="w-4 h-4" />, label: 'Rooftop' });
    if (venue.has_food) features.push({ icon: <Utensils className="w-4 h-4" />, label: 'Food' });
    if (venue.live_music_days.length > 0) features.push({ icon: <Music className="w-4 h-4" />, label: 'Live Music' });
    if (venue.live_events?.length) features.push({ icon: <Music className="w-4 h-4" />, label: 'Live DJ' });
    return features;
  };

  return (
    <div className="bg-neutral-900/80 rounded-2xl overflow-hidden border border-neutral-700/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-neutral-600/70">
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => onToggleFavorite?.(venue.id)}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all duration-200"
            aria-label="Add to favorites"
          >
            <Heart className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => onShare?.(venue.id)}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm transition-all duration-200"
            aria-label="Share venue"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Live Events Badge */}
        {venue.live_events?.length && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-red-500/90 text-white text-xs font-bold rounded-full backdrop-blur-sm">
              LIVE NOW
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                {venue.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-300 font-medium">{venue.neighbourhood || 'Toronto'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-neutral-800/60 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white font-bold">{venue.service_rating}</span>
              <span className="text-neutral-400 text-sm">(150)</span>
            </div>
          </div>

          {/* Vibe */}
          <p className="text-neutral-300 text-base leading-relaxed">
            {venue.typical_vibe}
          </p>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Cover */}
          <div className="text-center p-3 bg-neutral-800/40 rounded-xl">
            <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Cover</div>
            <div className="text-white font-bold">{getCoverText()}</div>
          </div>

          {/* Wait */}
          <div className="text-center p-3 bg-neutral-800/40 rounded-xl">
            <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Wait</div>
            <div className="text-white font-bold">{getWaitText()}</div>
          </div>

          {/* Rating */}
          <div className="text-center p-3 bg-neutral-800/40 rounded-xl">
            <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Rating</div>
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white font-bold">{venue.service_rating}</span>
              <span className="text-neutral-400 text-sm">(150)</span>
            </div>
          </div>
        </div>

        {/* Features */}
        {getFeatures().length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Features</div>
            <div className="flex flex-wrap gap-2">
              {getFeatures().map((feature, index) => (
                <div key={index} className="flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                  {feature.icon}
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Offers */}
        {venue.special_offers?.length && (
          <div className="space-y-2">
            <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Special Offers</div>
            <div className="flex flex-wrap gap-2">
              {venue.special_offers.map((offer, index) => (
                <span key={index} className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm font-medium">
                  {offer}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onGetDirections?.(venue.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all duration-200"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </button>
          
          {venue.booking_url && (
            <button
              onClick={() => window.open(venue.booking_url, '_blank')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Book
            </button>
          )}
        </div>

        {/* Last Updated */}
        <div className="text-xs text-neutral-500 text-center pt-2 border-t border-neutral-800/50">
          Updated {venue.updated_at ? 'recently' : 'NaNh ago'}
        </div>
      </div>
    </div>
  );
};

export default VenueCardExpanded;
