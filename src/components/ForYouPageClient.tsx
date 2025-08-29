'use client';

import { useRef, useState, useEffect } from 'react';
import { Clock, Users, Star, MapPin, Music, Zap, ChevronLeft, ChevronRight, TreePine, Building2, Disc3, Mic, UtensilsCrossed, Circle, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Bar, UserProfile } from '@/lib/types';
import { useForYouPage, Recommendations } from '@/hooks/useForYouPage';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useVenueQueue } from '@/hooks/useVenueQueue';
import TopNavigation from './TopNavigation';
import VenueCard from './VenueCard';
import ContextBar from './ContextBar';
import ControlsRow from './ControlsRow';
import CategorySelector, { CategoryType } from './CategorySelector';
import CategoryDisplay from './CategoryDisplay';
import CategoryOverview from './CategoryOverview';

// Helper function to convert Bar data to VenueCard props
const convertBarToVenueCardProps = (bar: Bar, getBarImage: (barName: string) => string) => {
  // Calculate match score based on user preferences (mock for now)
  const matchScore = bar.is_featured ? 85 + Math.floor(Math.random() * 15) : undefined;
  
  // Convert wait time to VenueCard format
  const getWaitStatus = () => {
    if (bar.current_wait_time) {
      const waitTime = bar.current_wait_time.toLowerCase();
      if (waitTime.includes('no wait')) return { status: 'none' as const };
      if (waitTime.includes('15') || waitTime.includes('20')) return { status: 'short' as const, min: 15, max: 30 };
      if (waitTime.includes('25') || waitTime.includes('30')) return { status: 'med' as const, min: 25, max: 35 };
      return { status: 'unknown' as const };
    }
    return { status: 'unknown' as const };
  };
  
  // Convert cover frequency to VenueCard format
  const getCoverInfo = () => {
    if (bar.cover_frequency === 'No cover') return { type: 'none' as const };
    if (bar.cover_frequency === 'Yes-always' && bar.cover_amount) {
      const amount = parseInt(bar.cover_amount.replace(/[^0-9]/g, ''));
      return { type: 'fixed' as const, amount };
    }
    if (bar.cover_frequency === 'Sometimes' && bar.cover_amount) {
      const amount = parseInt(bar.cover_amount.replace(/[^0-9]/g, ''));
      return { type: 'from' as const, amount };
    }
    return { type: 'none' as const };
  };
  
  // Convert highlights
  const getHighlights = () => {
    const highlights: any = {};
    
    if (bar.live_events) {
      bar.live_events.forEach(event => {
        if (event.toLowerCase().includes('dj')) {
          highlights.liveDj = { start: '10PM', end: '3AM' };
        }
        if (event.toLowerCase().includes('happy hour')) {
          const match = event.match(/until (\d+[ap]m)/i);
          if (match) highlights.happyHourUntil = match[1];
        }
      });
    }
    
    // Convert bar features to tags
    const tags = [];
    if (bar.has_rooftop) tags.push('Rooftop');
    if (bar.has_patio) tags.push('Patio');
    if (bar.has_dancefloor) tags.push('Dancefloor');
    if (bar.has_food) tags.push('Food');
    if (bar.live_music_days && bar.live_music_days.length > 0) tags.push('Live Music');
    if (bar.karaoke_nights && bar.karaoke_nights.length > 0) tags.push('Karaoke');
    
    if (tags.length > 0) highlights.tags = tags;
    
    return Object.keys(highlights).length > 0 ? highlights : undefined;
  };
  
  // Extract age range from age_group_min and age_group_max
  const getCrowdEstimate = () => {
    if (bar.age_group_min) {
      const minAge = parseInt(bar.age_group_min.split('-')[0]);
      const maxAge = bar.age_group_max ? parseInt(bar.age_group_max.split('-')[1]) : minAge + 8;
      return { minAge, maxAge };
    }
    return undefined;
  };
  
  return {
    id: bar.id,
    name: bar.name,
    neighborhood: bar.neighbourhood || 'Toronto',
    distanceMinutes: 5 + Math.floor(Math.random() * 20), // Mock distance
    matchScore,
    rating: {
      value: bar.service_rating,
      count: 50 + Math.floor(Math.random() * 400)
    },
    cover: getCoverInfo(),
    wait: {
      ...getWaitStatus(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString() // Random time within last hour
    },
    highlights: getHighlights(),
    crowdEstimate: getCrowdEstimate(),
    vibe: bar.typical_vibe,
    imageUrl: getBarImage(bar.name),
    partnerBookingUrl: bar.booking_url,
    directionsUrl: `https://maps.google.com/?q=${encodeURIComponent(bar.address || bar.name + ' ' + bar.neighbourhood)}`,
    isFavorite: false, // TODO: Connect to favorites system
    onToggleFavorite: (id: string) => {/* Favorite functionality not implemented */},
    onOpenDetails: (id: string) => window.location.href = `/bar/${bar.slug}`
  };
};

interface CarouselProps {
  title: string;
  subtitle?: string;
  bars: Bar[];
  icon?: React.ReactNode;
  getBarImage: (barName: string) => string;
}

const Carousel = ({ title, subtitle, bars, icon, getBarImage }: CarouselProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 320; // Card width + gap
      containerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (bars.length === 0) {
    return null; // Don't render empty carousels
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 rounded-xl border border-zinc-600/30">
              {icon}
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">{title}</h2>
          </div>
          {subtitle && (
            <div className="text-zinc-400 ml-14 relative">
              {subtitle}
              <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 w-8 h-px bg-gradient-to-r from-green-500/50 to-transparent" />
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => scroll('left')}
            className="group p-3 bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-xl hover:from-zinc-700/80 hover:to-zinc-600/80 transition-all duration-300 border border-zinc-600/30 hover:border-zinc-500/50"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="group p-3 bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm rounded-xl hover:from-zinc-700/80 hover:to-zinc-600/80 transition-all duration-300 border border-zinc-600/30 hover:border-zinc-500/50"
          >
            <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {bars.map((bar) => (
          <VenueCard key={bar.id} {...convertBarToVenueCardProps(bar, getBarImage)} />
        ))}
      </div>
    </div>
  );
};

interface ForYouPageClientProps {
  user: UserProfile;
  initialRecommendations: {
    discoverTonight: Bar[];
    hiddenGems: Bar[];
    yourRegulars: Bar[];
  };
}

export default function ForYouPageClient({ user, initialRecommendations }: ForYouPageClientProps) {
  // Convert to full Recommendations structure for useForYouPage hook
  const fullRecommendations: Recommendations = {
    perfectForTonight: [],
    yourVibe: [],
    quickEntry: [],
    trendingInArea: [],
    discoverTonight: initialRecommendations.discoverTonight,
    hiddenGems: initialRecommendations.hiddenGems,
    yourRegulars: initialRecommendations.yourRegulars
  };
  
  const { state, actions } = useForYouPage(user, fullRecommendations);
  const { currentTime } = state;
  const { generateBarImage } = actions;
  const { getVisibleVenues, hideVenue } = useVenueQueue();
  
  // Category state management
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('discoverTonight');
  
  // State for new UI components
  const [activeChip, setActiveChip] = useState<'area' | 'vibe' | 'tonight' | 'points' | undefined>();
  const [sortBy, setSortBy] = useState<'match' | 'cover' | 'wait' | 'rating'>('match');
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [updatedAt] = useState('2 min ago');

  // Get visible venues for the selected category
  const getCurrentCategoryVenues = () => {
    const allVenues = state.recommendations[selectedCategory] || [];
    return getVisibleVenues(selectedCategory, allVenues);
  };

  // Handle hiding a venue
  const handleHideVenue = (venueId: string) => {
    hideVenue(selectedCategory, venueId);
  };

  // Get category counts for the selector
  const categoryCounts = {
    discoverTonight: state.recommendations.discoverTonight.length,
    hiddenGems: state.recommendations.hiddenGems.length,
    yourRegulars: state.recommendations.yourRegulars.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <TopNavigation />
      
      <ContextBar
        area={user.first_neighbourhood}
        vibe={user.preferred_music?.join(', ')}
        tonight={currentTime === 'night' ? 'Prime Time' : 'Afternoon'}
        points={user.loyalty_points || 0}
        activeChip={activeChip}
        onAreaClick={() => setActiveChip(activeChip === 'area' ? undefined : 'area')}
        onVibeClick={() => setActiveChip(activeChip === 'vibe' ? undefined : 'vibe')}
        onTonightClick={() => setActiveChip(activeChip === 'tonight' ? undefined : 'tonight')}
        onPointsClick={() => setActiveChip(activeChip === 'points' ? undefined : 'points')}
      />
      
      {/* Category Overview with Filters */}
      <CategoryOverview
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryCounts={categoryCounts}
        onFiltersClick={() => {/* Filters modal not implemented */}}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Category Display */}
      <CategoryDisplay
        category={selectedCategory}
        venues={getCurrentCategoryVenues()}
        onHideVenue={handleHideVenue}
      />
    </div>
  );
}
