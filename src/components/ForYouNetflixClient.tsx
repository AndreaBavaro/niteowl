'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Play, Plus, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface NetflixSectionData {
  id: string;
  title: string;
  venues: Bar[];
}

// Mock venues data for Netflix prototype
const mockVenues: Bar[] = [
  {
    id: '1',
    name: 'The Hoxton',
    slug: 'the-hoxton',
    neighbourhood: 'King West',
    description: 'Upscale rooftop bar with stunning city views and craft cocktails.',
    service_rating: 4.6,
    has_rooftop: true,
    has_patio: true,
    has_dancefloor: true,
    live_music_days: [5, 6], // Friday, Saturday
    current_wait_time: '15 min',
    live_events: ['Happy Hour until 8PM', 'Live DJ until 2AM'],
    crowd_level: 'busy',
    special_offers: ['$5 shots', '2-for-1 cocktails'],
    is_featured: true,
    visit_count: 0,
    typical_lineup_min: 'none',
    cover_frequency: 'sometimes',
    typical_vibe: 'Upscale and trendy',
    top_music: ['house'],
    age_group_min: '25-30',
    karaoke_nights: [],
    has_food: true,
    has_pool_table: false,
    has_arcade_games: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '2',
    name: 'Loft',
    slug: 'loft',
    neighbourhood: 'Entertainment District',
    description: 'Trendy nightclub with free cover and great music.',
    service_rating: 4.2,
    has_rooftop: false,
    has_patio: true,
    has_dancefloor: true,
    live_music_days: [4, 5, 6],
    current_wait_time: 'No wait',
    live_events: ['Free Cover Tonight'],
    crowd_level: 'moderate',
    special_offers: ['Free Cover'],
    is_featured: false,
    visit_count: 2,
    typical_lineup_min: 'none',
    cover_frequency: 'never',
    typical_vibe: 'Young and energetic',
    top_music: ['pop'],
    age_group_min: '19-24',
    karaoke_nights: [],
    has_food: false,
    has_pool_table: false,
    has_arcade_games: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: '3',
    name: 'Bar Two',
    slug: 'bar-two',
    neighbourhood: 'King West',
    description: 'Sophisticated cocktail lounge with medium capacity.',
    service_rating: 4.4,
    has_rooftop: false,
    has_patio: false,
    has_dancefloor: false,
    live_music_days: [6],
    current_wait_time: '25 min',
    live_events: ['Live Music Tonight'],
    crowd_level: 'busy',
    capacity_size: 'medium',
    is_featured: false,
    visit_count: 1,
    typical_lineup_min: 'short',
    cover_frequency: 'sometimes',
    typical_vibe: 'Sophisticated and intimate',
    top_music: ['jazz'],
    age_group_min: '25-30',
    karaoke_nights: [],
    has_food: true,
    has_pool_table: false,
    has_arcade_games: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
];

export const ForYouNetflixClient: React.FC = () => {
  const { user } = useAuth();
  const [heroVenue, setHeroVenue] = useState<Bar | null>(null);
  const [sections, setSections] = useState<NetflixSectionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set rotating hero venue (algorithm-based featured venue)
    const featuredVenues = mockVenues.filter((venue: Bar) => venue.is_featured || venue.service_rating >= 4.5);
    const heroCandidate = featuredVenues.length > 0 ? featuredVenues[0] : mockVenues[0];
    setHeroVenue(heroCandidate);

    // Create Netflix-style sections
    const netflixSections: NetflixSectionData[] = [
      {
        id: 'trending',
        title: 'Trending Now',
        venues: mockVenues.filter((venue: Bar) => venue.live_events?.length || venue.current_wait_time)
      },
      {
        id: 'rooftop',
        title: 'Rooftop Vibes',
        venues: mockVenues.filter((venue: Bar) => venue.has_rooftop || venue.has_patio)
      },
      {
        id: 'top-rated',
        title: `Top Rated in ${user?.first_neighborhood || 'Your Area'}`,
        venues: mockVenues.filter((venue: Bar) => venue.service_rating >= 4.0).sort((a: Bar, b: Bar) => b.service_rating - a.service_rating)
      },
      {
        id: 'live-music',
        title: 'Live Music Tonight',
        venues: mockVenues.filter((venue: Bar) => venue.live_music_days?.length > 0)
      },
      {
        id: 'happy-hour',
        title: 'Happy Hour Spots',
        venues: mockVenues.filter((venue: Bar) => venue.live_events?.some((event: string) => event.includes('Happy Hour')))
      },
      {
        id: 'hidden-gems',
        title: 'Hidden Gems',
        venues: mockVenues.filter((venue: Bar) => (venue.visit_count || 0) < 100 && venue.service_rating >= 4.0)
      }
    ].filter(section => section.venues.length > 0); // Only show sections with venues

    setSections(netflixSections);
    setLoading(false);
  }, [user?.first_neighborhood]);

  // Rotate hero venue every 10 seconds
  useEffect(() => {
    if (mockVenues.length > 1) {
      const interval = setInterval(() => {
        const featuredVenues = mockVenues.filter((venue: Bar) => venue.is_featured || venue.service_rating >= 4.5);
        const candidateVenues = featuredVenues.length > 0 ? featuredVenues : mockVenues;
        const randomVenue = candidateVenues[Math.floor(Math.random() * candidateVenues.length)];
        setHeroVenue(randomVenue);
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
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
      {/* Netflix-style Navigation */}
      <NetflixNavigation />
      
      {/* Hero Section */}
      {heroVenue && (
        <NetflixHeroSection venue={heroVenue} />
      )}
      
      {/* Netflix-style Sections */}
      <div className="relative z-10 -mt-32 pb-20">
        {sections.map((section, index) => (
          <NetflixSection
            key={section.id}
            title={section.title}
            venues={section.venues}
            priority={index === 0} // First section gets priority loading
          />
        ))}
      </div>
    </div>
  );
};
