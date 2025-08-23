'use client';

import { useState, useMemo } from 'react';
import { Bar } from '@/lib/types';
import Link from 'next/link';
import { Clock, DollarSign, Users, Star, MapPin, Search } from 'lucide-react';

// Bar card component
function BarCard({ bar }: { bar: Bar }) {
  const getCoverDisplay = () => {
    if (bar.cover_frequency === 'No cover') return 'Free';
    if (bar.cover_frequency === 'Sometimes') return `Sometimes ${bar.cover_amount || ''}`;
    return bar.cover_amount || 'Cover charge';
  };

  const getLineupDisplay = () => {
    if (bar.typical_lineup_max) {
      return `${bar.typical_lineup_min} - ${bar.typical_lineup_max}`;
    }
    return bar.typical_lineup_min;
  };

  const getAgeGroupDisplay = () => {
    if (bar.age_group_min && bar.age_group_max) {
      return `${bar.age_group_min} - ${bar.age_group_max}`;
    }
    return bar.age_group_min || bar.age_group_max || 'All ages';
  };

  return (
    <Link href={`/bar/${bar.slug}`}>
      <div className="group bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer border border-zinc-700/50 hover:border-green-400/30 h-full hover:shadow-lg hover:shadow-green-400/10 hover:scale-[1.02] relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{bar.name}</h3>
              {bar.neighbourhood && (
                <div className="flex items-center text-zinc-400 text-sm">
                  <MapPin className="w-3 h-3 mr-1" />
                  {bar.neighbourhood}
                </div>
              )}
            </div>
            <div className="flex items-center text-green-400">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="font-medium">{bar.service_rating}</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-zinc-300 text-sm">
              <Clock className="w-3 h-3 mr-2 text-zinc-500" />
              <span>Wait: {getLineupDisplay()}</span>
            </div>
            <div className="flex items-center text-zinc-300 text-sm">
              <DollarSign className="w-3 h-3 mr-2 text-zinc-500" />
              <span>{getCoverDisplay()}</span>
            </div>
            <div className="flex items-center text-zinc-300 text-sm">
              <Users className="w-3 h-3 mr-2 text-zinc-500" />
              <span>{getAgeGroupDisplay()}</span>
            </div>
          </div>

          <div className="mb-3">
            {bar.typical_vibe && (
              <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full">
                {bar.typical_vibe}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {bar.top_music.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
            {bar.top_music.length > 3 && (
              <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-full">
                +{bar.top_music.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface BarsSearchClientProps {
  bars: Bar[];
}

export default function BarsSearchClient({ bars }: BarsSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBars = useMemo(() => {
    if (!searchQuery) return bars;
    
    const query = searchQuery.toLowerCase();
    return bars.filter(bar => 
      bar.name.toLowerCase().includes(query) ||
      bar.neighbourhood?.toLowerCase().includes(query) ||
      bar.typical_vibe?.toLowerCase().includes(query) ||
      bar.top_music.some(genre => genre.toLowerCase().includes(query))
    );
  }, [bars, searchQuery]);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-12 flex flex-col items-center">
        <div className="relative max-w-lg w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5 transition-colors" />
          <input
            type="text"
            placeholder="Search bars, neighborhoods, vibes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl text-white placeholder-zinc-400 focus:outline-none focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 text-lg"
          />
        </div>
        {searchQuery && (
          <p className="text-zinc-400 text-sm mt-2">
            {filteredBars.length} of {bars.length} bars match "{searchQuery}"
          </p>
        )}
      </div>

      {/* Results */}
      {filteredBars.length === 0 && searchQuery ? (
        <div className="text-center py-16">
          <div className="text-zinc-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No bars match your search</p>
            <p className="text-sm">Try a different search term</p>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="px-6 py-2 bg-green-400 hover:bg-green-500 text-black font-medium rounded-lg transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBars.map((bar) => (
            <BarCard key={bar.id} bar={bar} />
          ))}
        </div>
      )}
    </>
  );
}
