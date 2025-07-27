'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Bar } from '@/lib/types';
import Link from 'next/link';
import { Clock, DollarSign, Users, Star, MapPin, Search } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';

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

function BarsPage() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchBars() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('bars')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching bars:', error);
      } else {
        setBars(data || []);
      }
      setLoading(false);
    }

    fetchBars();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="relative z-10 pt-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">All</span>
                {' '}
                <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">Bars</span>
              </h1>
              <p className="text-zinc-300 text-lg max-w-2xl mx-auto">Your guide to Toronto's hottest nightlife destinations</p>
              
              {/* Floating dots */}
              <div className="absolute top-20 left-10 w-2 h-2 bg-green-400/30 rounded-full animate-float" />
              <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
              <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-700/50 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="h-5 bg-zinc-700 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-zinc-700 rounded w-16"></div>
                    </div>
                    <div className="h-5 bg-zinc-700 rounded w-8"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-zinc-700 rounded w-20"></div>
                    <div className="h-4 bg-zinc-700 rounded w-16"></div>
                    <div className="h-4 bg-zinc-700 rounded w-18"></div>
                  </div>
                  <div className="h-6 bg-zinc-700 rounded w-20 mb-3"></div>
                  <div className="flex gap-1">
                    <div className="h-5 bg-zinc-700 rounded-full w-12"></div>
                    <div className="h-5 bg-zinc-700 rounded-full w-16"></div>
                    <div className="h-5 bg-zinc-700 rounded-full w-14"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10 pt-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">All</span>
              {' '}
              <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">Bars</span>
            </h1>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto">Your guide to Toronto's hottest nightlife destinations</p>
            
            {/* Floating dots */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-green-400/30 rounded-full animate-float" />
            <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          </div>

        {bars.length === 0 && !loading ? (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">
              {!supabase ? 'Database connection not available.' : 'No bars available yet.'}
            </p>
            {!supabase && (
              <p className="text-zinc-500 text-sm mt-2">
                Please check your environment variables and database connection.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="mb-12 flex justify-center">
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
        )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(BarsPage);
