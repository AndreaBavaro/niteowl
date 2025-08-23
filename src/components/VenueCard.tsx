import React from 'react';

interface VenueCardProps {
  // Required props
  id: string;
  name: string;
  neighborhood: string;
  
  // Optional location & matching
  distanceMinutes?: number;
  matchScore?: number; // 0-100
  
  // Rating system
  rating?: {
    value: number;
    count?: number;
  };
  
  // Cover charge
  cover?: {
    type: 'none' | 'fixed' | 'from';
    amount?: number;
  };
  
  // Wait time & status
  wait?: {
    min?: number;
    max?: number;
    status?: 'none' | 'short' | 'med' | 'long' | 'unknown';
    updatedAt?: string;
  };
  
  // Live events & highlights
  highlights?: {
    liveDj?: {
      start?: string;
      end?: string;
    };
    happyHourUntil?: string;
    tags?: string[]; // ['Rooftop', 'Patio', 'Food']
  };
  
  // Crowd & atmosphere
  crowdEstimate?: {
    minAge?: number;
    maxAge?: number;
  };
  vibe?: string;
  
  // Media & actions
  imageUrl?: string;
  partnerBookingUrl?: string;
  directionsUrl?: string;
  isFavorite?: boolean;
  
  // Event handlers
  onToggleFavorite?: (id: string) => void;
  onOpenDetails?: (id: string) => void;
}

const VenueCard: React.FC<VenueCardProps> = ({
  id,
  name,
  neighborhood,
  distanceMinutes,
  matchScore,
  rating,
  cover = { type: 'none' },
  wait = { status: 'unknown' },
  highlights,
  crowdEstimate,
  vibe,
  imageUrl,
  partnerBookingUrl,
  directionsUrl,
  isFavorite = false,
  onToggleFavorite,
  onOpenDetails,
}) => {
  // Helper functions
  const formatCover = () => {
    if (cover.type === 'none') return 'No cover';
    if (cover.type === 'fixed') return `$${cover.amount} cover`;
    if (cover.type === 'from') return `From $${cover.amount}`;
    return 'Cover n/a';
  };

  const formatWait = () => {
    if (wait.status === 'none') return 'No wait';
    if (wait.min && wait.max) return `${wait.min}–${wait.max} min`;
    if (wait.min) return `${wait.min}+ min`;
    return 'Wait n/a';
  };

  const getWaitColor = () => {
    if (wait.status === 'none' || (wait.max && wait.max <= 10)) return 'bg-green-500/90 text-white';
    if (wait.status === 'short' || (wait.max && wait.max <= 30)) return 'bg-amber-500/90 text-white';
    if (wait.status === 'med' || wait.status === 'long') return 'bg-red-500/90 text-white';
    return 'bg-gray-500/90 text-white';
  };

  const formatRating = () => {
    if (!rating) return 'New';
    if (!rating.count || rating.count < 20) return 'New';
    return `★ ${rating.value} (${rating.count})`;
  };

  const formatCrowd = () => {
    if (!crowdEstimate?.minAge || !crowdEstimate?.maxAge) return null;
    return `Crowd: ${crowdEstimate.minAge}–${crowdEstimate.maxAge}`;
  };

  const getUpdatedTime = () => {
    if (!wait.updatedAt) return null;
    const now = new Date();
    const updated = new Date(wait.updatedAt);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `Updated ${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `Updated ${diffHours}h ago`;
  };

  const isDataStale = () => {
    if (!wait.updatedAt) return false;
    const now = new Date();
    const updated = new Date(wait.updatedAt);
    const diffHours = (now.getTime() - updated.getTime()) / (1000 * 60 * 60);
    return diffHours > 2;
  };

  const shouldShowBookAsPrimary = () => {
    if (!partnerBookingUrl) return false;
    
    // Check for upcoming highlights within 90 minutes
    if (highlights?.liveDj || highlights?.happyHourUntil) return true;
    
    return false;
  };

  const getPrimaryCTA = () => {
    if (shouldShowBookAsPrimary()) {
      return { text: 'Book', action: () => window.open(partnerBookingUrl, '_blank') };
    }
    
    if (wait.status === 'none' && distanceMinutes && distanceMinutes <= 15) {
      return { text: 'Go now', action: () => window.open(directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + neighborhood)}`, '_blank') };
    }
    
    if (partnerBookingUrl) {
      return { text: 'Book', action: () => window.open(partnerBookingUrl, '_blank') };
    }
    
    return { text: 'Directions', action: () => window.open(directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + neighborhood)}`, '_blank') };
  };

  const getVenueInitials = () => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const renderHighlights = () => {
    const items = [];
    
    if (highlights?.liveDj) {
      items.push('Live DJ');
    }
    
    if (highlights?.tags) {
      items.push(...highlights.tags.slice(0, 2));
    }
    
    const visibleItems = items.slice(0, 2);
    const remainingCount = items.length - visibleItems.length;
    
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {visibleItems.map((item, index) => (
          <span key={index} className="text-xs text-neutral-300">
            {item}
          </span>
        ))}
        {highlights?.happyHourUntil && (
          <span className="text-xs font-medium rounded-full px-2.5 h-7 inline-flex items-center bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Happy Hour till {highlights.happyHourUntil}
          </span>
        )}
        {remainingCount > 0 && (
          <span className="text-xs text-neutral-400">+{remainingCount}</span>
        )}
      </div>
    );
  };

  const primaryCTA = getPrimaryCTA();

  return (
    <div 
      className="bg-neutral-900 rounded-xl border border-neutral-700 overflow-hidden group hover:border-neutral-600 transition-all duration-300 cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails?.(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetails?.(id);
        }
      }}
    >
      {/* Header Image */}
      <div className="relative h-40 sm:h-45 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <span className="text-2xl font-bold text-neutral-400">{getVenueInitials()}</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Match Badge */}
        {matchScore && (
          <div className="absolute top-3 left-3 flex items-center gap-1">
            <span className="text-xs font-medium rounded-full px-2.5 h-7 inline-flex items-center bg-purple-500/90 text-white">
              For you {matchScore}%
            </span>
            <button
              className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails?.(id);
              }}
              aria-label="Why this recommendation?"
            >
              <span className="text-xs">i</span>
            </button>
          </div>
        )}
        
        {/* Rating Pill */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-medium rounded-full px-2.5 h-7 inline-flex items-center bg-black/60 backdrop-blur-sm text-white">
            {formatRating()}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 space-y-2">
        {/* Title Block */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{name}</h3>
          <p className="text-sm text-neutral-300">
            {neighborhood}
            {distanceMinutes && (
              <span> · {distanceMinutes} min</span>
            )}
          </p>
        </div>

        {/* Primary Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs text-neutral-400 mb-1">Cover</div>
            <div className="text-sm font-medium text-white">{formatCover()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-neutral-400 mb-1">Wait</div>
            <div className={`text-xs font-medium rounded-full px-2.5 h-6 inline-flex items-center ${getWaitColor()}`}>
              {formatWait()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-neutral-400 mb-1">Rating</div>
            <div className="text-sm font-medium text-white">{formatRating()}</div>
          </div>
        </div>

        {/* Highlights Line */}
        {(highlights?.liveDj || highlights?.tags || highlights?.happyHourUntil) && (
          <div className="pt-1">
            {renderHighlights()}
          </div>
        )}

        {/* Crowd & Vibe Line */}
        {(crowdEstimate || vibe) && (
          <div className="text-sm text-neutral-300">
            {formatCrowd()}
            {crowdEstimate && vibe && ' · '}
            {vibe}
          </div>
        )}

        {/* Updated Timestamp */}
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          {isDataStale() && (
            <span className="text-amber-400" title="Data may be out of date">⚠</span>
          )}
          {getUpdatedTime()}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-700/50">
          {/* Primary Action - Get Directions */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(name + ' ' + neighborhood)}`, '_blank');
            }}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Get Directions
          </button>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            {/* Favorite Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(id);
              }}
              className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
                isFavorite 
                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' 
                  : 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>

            {/* Book/Website */}
            {partnerBookingUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(partnerBookingUrl, '_blank');
                }}
                className="w-11 h-11 rounded-lg flex items-center justify-center bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors"
                aria-label="Book table or visit website"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15,3 21,3 21,9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </button>
            )}

            {/* Share */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: name,
                    text: `Check out ${name} in ${neighborhood}!`,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="w-11 h-11 rounded-lg flex items-center justify-center bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700 transition-colors"
              aria-label="Share venue"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
