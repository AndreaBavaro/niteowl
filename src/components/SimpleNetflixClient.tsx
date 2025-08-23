'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Play, Plus, ChevronLeft, ChevronRight, Heart, Search, Bell, User, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

// Simplified venue interface for the prototype
interface SimpleVenue {
  id: string;
  name: string;
  slug: string;
  neighbourhood: string;
  description: string;
  rating: number;
  image: string;
  badges: string[];
  waitTime?: string;
  liveEvents: string[];
  features: string[];
}

// Mock data for Netflix prototype
const mockNetflixVenues: SimpleVenue[] = [
  {
    id: '1',
    name: 'The Hoxton',
    slug: 'the-hoxton',
    neighbourhood: 'King West',
    description: 'Upscale rooftop bar with stunning city views and craft cocktails.',
    rating: 4.6,
    image: 'https://picsum.photos/800/450?random=1',
    badges: ['Featured', 'Rooftop'],
    waitTime: '15 min',
    liveEvents: ['Happy Hour until 8PM', 'Live DJ until 2AM'],
    features: ['Rooftop', 'Craft Cocktails', 'City Views']
  },
  {
    id: '2',
    name: 'Loft',
    slug: 'loft',
    neighbourhood: 'Entertainment District',
    description: 'Trendy nightclub with free cover and great music.',
    rating: 4.2,
    image: 'https://picsum.photos/800/450?random=2',
    badges: ['Free Cover', 'Dance Floor'],
    liveEvents: ['Free Cover Tonight'],
    features: ['Dance Floor', 'Free Cover', 'Young Crowd']
  },
  {
    id: '3',
    name: 'Bar Two',
    slug: 'bar-two',
    neighbourhood: 'King West',
    description: 'Sophisticated cocktail lounge with medium capacity.',
    rating: 4.4,
    image: 'https://picsum.photos/800/450?random=3',
    badges: ['Live Music', 'Medium Capacity'],
    waitTime: '25 min',
    liveEvents: ['Live Music Tonight'],
    features: ['Live Music', 'Cocktails', 'Intimate']
  },
  {
    id: '4',
    name: 'Rebel Nightclub',
    slug: 'rebel-nightclub',
    neighbourhood: 'Entertainment District',
    description: 'Massive nightclub with world-class DJs and sound system.',
    rating: 4.3,
    image: 'https://picsum.photos/800/450?random=4',
    badges: ['World Class DJs', 'Massive'],
    waitTime: '45 min',
    liveEvents: ['DJ Set until 3AM'],
    features: ['Massive Dance Floor', 'VIP Sections', 'World Class Sound']
  }
];

interface NetflixSectionData {
  id: string;
  title: string;
  venues: SimpleVenue[];
}

// Netflix-style Navigation Component
const NetflixNav: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/for-you"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Original</span>
            </Link>
            
            <Link href="/for-you-netflix" className="text-2xl font-bold text-white">
              Nite Owl
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <button className="text-white font-medium">Home</button>
              <button className="text-neutral-400 hover:text-neutral-200 transition-colors">Bars</button>
              <button className="text-neutral-400 hover:text-neutral-200 transition-colors">Clubs</button>
              <button className="text-neutral-400 hover:text-neutral-200 transition-colors">My List</button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 text-neutral-400 hover:text-white transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden md:block text-sm">{user?.email?.split('@')[0] || 'User'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Netflix-style Hero Section
const NetflixHero: React.FC<{ venue: SimpleVenue }> = ({ venue }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isVenueFavorite = isFavorite(venue.id);

  const handleFavoriteToggle = async () => {
    if (isVenueFavorite) {
      await removeFavorite(venue.id);
    } else {
      await addFavorite(venue.id);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            {venue.liveEvents.length > 0 && (
              <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {venue.liveEvents[0]}
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {venue.name}
            </h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{venue.neighbourhood}</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg font-semibold">{venue.rating}</span>
              </div>
            </div>

            <p className="text-xl text-neutral-200 mb-8 leading-relaxed max-w-xl">
              {venue.description}
            </p>

            <div className="flex items-center gap-4">
              <Link 
                href={`/bars/${venue.slug}`}
                className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-neutral-200 transition-all duration-200 transform hover:scale-105"
              >
                <Play className="w-6 h-6 fill-current" />
                Visit Now
              </Link>

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
            </div>

            <div className="flex items-center gap-4 mt-8">
              {venue.features.map((feature, index) => (
                <span key={index} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Netflix-style Venue Card
const NetflixCard: React.FC<{ venue: SimpleVenue }> = ({ venue }) => {
  const [isHovered, setIsHovered] = useState(false);
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
      <div className={`relative w-80 transition-all duration-300 ${isHovered ? 'shadow-2xl shadow-black/50' : ''}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-800">
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            className="object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {venue.badges.length > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {venue.badges[0]}
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg mb-1 truncate">
              {venue.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{venue.neighbourhood}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span>{venue.rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        {isHovered && (
          <div className="absolute top-full left-0 right-0 bg-neutral-900 rounded-b-lg border border-neutral-700 p-4 shadow-2xl">
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
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {venue.features.map((feature, index) => (
                <span key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs font-medium">
                  {feature}
                </span>
              ))}
            </div>
            
            <p className="text-neutral-300 text-xs line-clamp-2">
              {venue.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Netflix-style Section
const NetflixSection: React.FC<{ title: string; venues: SimpleVenue[] }> = ({ title, venues }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
  }, [venues]);

  if (venues.length === 0) return null;

  return (
    <div className="relative mb-12 group">
      <h2 className="text-2xl font-bold text-white mb-4 px-4 md:px-8">
        {title}
      </h2>
      
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
        
        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {venues.map((venue) => (
            <div key={venue.id} className="flex-none">
              <NetflixCard venue={venue} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Netflix Client Component
export const ForYouNetflixClient: React.FC = () => {
  const { user } = useAuth();
  const [heroVenue, setHeroVenue] = useState<SimpleVenue>(mockNetflixVenues[0]);
  const [sections, setSections] = useState<NetflixSectionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create Netflix-style sections
    const netflixSections: NetflixSectionData[] = [
      {
        id: 'trending',
        title: 'Trending Now',
        venues: mockNetflixVenues.filter(venue => venue.liveEvents.length > 0 || venue.waitTime)
      },
      {
        id: 'rooftop',
        title: 'Rooftop Vibes',
        venues: mockNetflixVenues.filter(venue => venue.features.some(f => f.includes('Rooftop')))
      },
      {
        id: 'top-rated',
        title: `Top Rated in ${user?.first_neighbourhood || 'Your Area'}`,
        venues: mockNetflixVenues.filter(venue => venue.rating >= 4.0).sort((a, b) => b.rating - a.rating)
      },
      {
        id: 'live-music',
        title: 'Live Music Tonight',
        venues: mockNetflixVenues.filter(venue => venue.features.some(f => f.includes('Live Music')))
      }
    ].filter(section => section.venues.length > 0);

    setSections(netflixSections);
    setLoading(false);
  }, [user?.first_neighbourhood]);

  // Rotate hero venue every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomVenue = mockNetflixVenues[Math.floor(Math.random() * mockNetflixVenues.length)];
      setHeroVenue(randomVenue);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading your perfect night out...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <NetflixNav />
      <NetflixHero venue={heroVenue} />
      
      <div className="relative z-10 -mt-32 pb-20">
        {sections.map((section) => (
          <NetflixSection
            key={section.id}
            title={section.title}
            venues={section.venues}
          />
        ))}
      </div>
    </div>
  );
};
