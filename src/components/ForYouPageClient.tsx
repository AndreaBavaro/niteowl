'use client';

import { useRef, useState, useEffect } from 'react';
import { Clock, Users, Star, MapPin, Music, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Bar, UserProfile } from '@/lib/types';

const BarCard = ({ bar }: { bar: Bar }) => {
  const getBarImage = (barName: string) => {
    const imageId = Math.abs(barName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000 + 100;
    return `https://picsum.photos/400/240?random=${imageId}`;
  };

  return (
    <Link href={`/bar/${bar.slug}`}>
      <div className="bg-zinc-800 rounded-xl min-w-[300px] border border-zinc-700 relative overflow-hidden group hover:scale-[1.02] hover:border-green-500/50 transition-all duration-300">
        <div className="relative h-40 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `url(${getBarImage(bar.name)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-bold">{bar.service_rating}</span>
          </div>
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            bar.typical_lineup_min === '0-10 min' 
              ? 'bg-green-600/80 text-green-100' 
              : 'bg-orange-600/80 text-orange-100'
          }`}>
            {bar.typical_lineup_min} wait
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-white text-lg mb-1">{bar.name}</h3>
            <div className="flex items-center gap-2 text-zinc-300">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{bar.neighbourhood}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Music className="w-4 h-4 text-green-400" />
                <span>{bar.top_music.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Users className="w-4 h-4 text-blue-400" />
                <span>{bar.typical_vibe}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                {bar.cover_frequency}
              </span>
              <span className="text-xs px-3 py-1 bg-gradient-to-r from-green-600/20 to-green-500/20 text-green-400 rounded-full border border-green-500/30">
                {bar.typical_vibe}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
};

interface CarouselProps {
  title: string;
  subtitle?: string;
  bars: Bar[];
  icon?: React.ReactNode;
}

const Carousel = ({ title, subtitle, bars, icon }: CarouselProps) => {
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
          <BarCard key={bar.id} bar={bar} />
        ))}
      </div>
    </div>
  );
};

interface ForYouPageClientProps {
  user: UserProfile;
  recommendations: {
    perfectForTonight: Bar[];
    yourVibe: Bar[];
    quickEntry: Bar[];
    trendingInArea: Bar[];
  };
}

export default function ForYouPageClient({ user, recommendations }: ForYouPageClientProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const time = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      setCurrentTime(`${day}, ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Recommendations are now passed as props from server-side API

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-green-100 to-green-200 bg-clip-text text-transparent">
                Good evening, {user.full_name || 'Guest'} 👋
              </h1>
              <p className="text-zinc-400 text-lg">{currentTime}</p>
              <div className="absolute -top-2 -left-2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>
            <div className="text-right bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-zinc-300 font-medium">Loyalty Points</span>
              </div>
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-1">
                {user.loyalty_points || 0}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300">Your Area</span>
              </div>
              <p className="text-white font-semibold">{user.location_neighbourhood || 'Not set'}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Music className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">Your Vibe</span>
              </div>
              <p className="text-white font-semibold">{user.preferred_music?.join(', ') || 'Not set'}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">Tonight</span>
              </div>
              <p className="text-white font-semibold">Prime Time</p>
            </div>
          </div>
        </div>

        <Carousel
          title="Perfect for Tonight"
          subtitle="Top-rated spots for a great night out"
          bars={recommendations.perfectForTonight}
          icon={<Clock className="w-5 h-5 text-green-400" />}
        />

        {recommendations.yourVibe && recommendations.yourVibe.length > 0 && (
          <Carousel
            title="Your Vibe"
            subtitle={`Venues matching your love for ${user.preferred_music?.join(', ')}`}
            bars={recommendations.yourVibe}
            icon={<Music className="w-5 h-5 text-purple-400" />}
          />
        )}

        {recommendations.quickEntry && recommendations.quickEntry.length > 0 && (
          <Carousel
            title="Quick Entry"
            subtitle="Walk right in or minimal wait"
            bars={recommendations.quickEntry}
            icon={<Users className="w-5 h-5 text-blue-400" />}
          />
        )}

        {recommendations.trendingInArea && recommendations.trendingInArea.length > 0 && (
          <Carousel
            title={`Trending in ${user.location_neighbourhood || 'Toronto'}`}
            subtitle="What's hot in your neighborhood"
            bars={recommendations.trendingInArea}
            icon={<MapPin className="w-5 h-5 text-red-400" />}
          />
        )}
      </div>
    </div>
  );
}
