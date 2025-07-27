'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Bar, LineupTimeRange, CoverFrequency, CoverAmount, AgeGroup, MusicGenre } from '@/lib/types';
import Link from 'next/link';
import { Search, Filter, X, Clock, DollarSign, Users, Star, MapPin, Music } from 'lucide-react';
import withAuth from '@/components/auth/withAuth';

function SearchPage() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedLineupTimes, setSelectedLineupTimes] = useState<LineupTimeRange[]>([]);
  const [selectedCoverFrequencies, setSelectedCoverFrequencies] = useState<CoverFrequency[]>([]);
  const [selectedCoverAmounts, setSelectedCoverAmounts] = useState<CoverAmount[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<AgeGroup[]>([]);
  const [selectedMusicGenres, setSelectedMusicGenres] = useState<MusicGenre[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  // Fetch all bars
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

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const neighborhoods = [...new Set(bars.map(bar => bar.neighbourhood).filter(Boolean))].sort();
    const lineupTimes = [...new Set(bars.flatMap(bar => [bar.typical_lineup_min, bar.typical_lineup_max]).filter(Boolean))].sort();
    const coverFrequencies = [...new Set(bars.map(bar => bar.cover_frequency).filter(Boolean))];
    const coverAmounts = [...new Set(bars.map(bar => bar.cover_amount).filter(Boolean))];
    const ageGroups = [...new Set(bars.flatMap(bar => [bar.age_group_min, bar.age_group_max]).filter(Boolean))];
    const musicGenres = [...new Set(bars.flatMap(bar => bar.top_music).filter(Boolean))].sort();

    return {
      neighborhoods,
      lineupTimes,
      coverFrequencies,
      coverAmounts,
      ageGroups,
      musicGenres
    };
  }, [bars]);

  // Filter bars based on search and filters
  const filteredBars = useMemo(() => {
    return bars.filter(bar => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          bar.name.toLowerCase().includes(query) ||
          bar.neighbourhood?.toLowerCase().includes(query) ||
          bar.typical_vibe?.toLowerCase().includes(query) ||
          bar.top_music.some(genre => genre.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Neighborhood filter
      if (selectedNeighborhoods.length > 0 && bar.neighbourhood) {
        if (!selectedNeighborhoods.includes(bar.neighbourhood)) return false;
      }

      // Lineup time filter
      if (selectedLineupTimes.length > 0) {
        const hasMatchingTime = selectedLineupTimes.some(time => 
          bar.typical_lineup_min === time || bar.typical_lineup_max === time
        );
        if (!hasMatchingTime) return false;
      }

      // Cover frequency filter
      if (selectedCoverFrequencies.length > 0 && bar.cover_frequency) {
        if (!selectedCoverFrequencies.includes(bar.cover_frequency)) return false;
      }

      // Cover amount filter
      if (selectedCoverAmounts.length > 0 && bar.cover_amount) {
        if (!selectedCoverAmounts.includes(bar.cover_amount)) return false;
      }

      // Age group filter
      if (selectedAgeGroups.length > 0) {
        const hasMatchingAge = selectedAgeGroups.some(age => 
          bar.age_group_min === age || bar.age_group_max === age
        );
        if (!hasMatchingAge) return false;
      }

      // Music genre filter
      if (selectedMusicGenres.length > 0) {
        const hasMatchingGenre = selectedMusicGenres.some(genre => 
          bar.top_music.includes(genre)
        );
        if (!hasMatchingGenre) return false;
      }

      // Rating filter
      if (minRating > 0) {
        if (bar.service_rating < minRating) return false;
      }

      return true;
    });
  }, [bars, searchQuery, selectedNeighborhoods, selectedLineupTimes, selectedCoverFrequencies, selectedCoverAmounts, selectedAgeGroups, selectedMusicGenres, minRating]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedNeighborhoods([]);
    setSelectedLineupTimes([]);
    setSelectedCoverFrequencies([]);
    setSelectedCoverAmounts([]);
    setSelectedAgeGroups([]);
    setSelectedMusicGenres([]);
    setMinRating(0);
  };

  // Toggle filter selection
  const toggleFilter = <T,>(value: T, selected: T[], setSelected: (values: T[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(item => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // Bar card component
  const BarCard = ({ bar }: { bar: Bar }) => {
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

    return (
      <Link href={`/bar/${bar.slug}`}>
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10 hover:border-green-500/30 transition-all duration-300 cursor-pointer border border-zinc-700/50 h-full group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">{bar.name}</h3>
              {bar.neighbourhood && (
                <div className="flex items-center text-zinc-400 text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-green-400" />
                  {bar.neighbourhood}
                </div>
              )}
            </div>
            <div className="flex items-center bg-gradient-to-r from-green-400/20 to-emerald-400/20 px-3 py-1 rounded-full border border-green-400/30">
              <Star className="w-4 h-4 mr-1 fill-current text-green-400" />
              <span className="font-medium">{bar.service_rating}</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-zinc-300">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <span className="font-medium">Wait: {getLineupDisplay()}</span>
            </div>
            <div className="flex items-center text-zinc-300">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <span className="font-medium">{getCoverDisplay()}</span>
            </div>
            {bar.typical_vibe && (
              <div className="flex items-center text-zinc-300">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-medium">{bar.typical_vibe}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {bar.top_music.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-3 py-1.5 bg-gradient-to-r from-zinc-700/50 to-zinc-600/50 text-zinc-200 text-sm rounded-full border border-zinc-600/30 hover:border-green-400/50 transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  };

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
                <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">Search</span>
                {' '}
                <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">Bars</span>
              </h1>
              <p className="text-zinc-300 text-lg max-w-2xl mx-auto">Find the perfect bar for your night out</p>
              
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
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">Search</span>
              {' '}
              <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">Bars</span>
            </h1>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto">Find the perfect bar for your night out</p>
            
            {/* Floating dots */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-green-400/30 rounded-full animate-float" />
            <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute top-40 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search bars, neighborhoods, vibes, or music genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl text-white placeholder-zinc-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 text-lg"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(selectedNeighborhoods.length + selectedLineupTimes.length + selectedCoverFrequencies.length + selectedCoverAmounts.length + selectedAgeGroups.length + selectedMusicGenres.length + (minRating > 0 ? 1 : 0)) > 0 && (
                <span className="bg-green-400 text-black text-xs px-2 py-1 rounded-full">
                  {selectedNeighborhoods.length + selectedLineupTimes.length + selectedCoverFrequencies.length + selectedCoverAmounts.length + selectedAgeGroups.length + selectedMusicGenres.length + (minRating > 0 ? 1 : 0)}
                </span>
              )}
            </button>

            <div className="text-zinc-400">
              {filteredBars.length} of {bars.length} bars
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Neighborhoods */}
                <div>
                  <h4 className="font-medium text-white mb-2">Neighborhoods</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {filterOptions.neighborhoods.filter((n): n is string => !!n).map(neighborhood => (
                      <label key={neighborhood} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedNeighborhoods.includes(neighborhood)}
                          onChange={() => toggleFilter(neighborhood, selectedNeighborhoods, setSelectedNeighborhoods)}
                          className="rounded border-zinc-600 text-green-400 focus:ring-green-400"
                        />
                        <span className="text-zinc-300">{neighborhood}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Music Genres */}
                <div>
                  <h4 className="font-medium text-white mb-2">Music Genres</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {filterOptions.musicGenres.map(genre => (
                      <label key={genre} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedMusicGenres.includes(genre)}
                          onChange={() => toggleFilter(genre, selectedMusicGenres, setSelectedMusicGenres)}
                          className="rounded border-zinc-600 text-green-400 focus:ring-green-400"
                        />
                        <span className="text-zinc-300">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cover Frequency */}
                <div>
                  <h4 className="font-medium text-white mb-2">Cover Charge</h4>
                  <div className="space-y-1">
                    {filterOptions.coverFrequencies.map(frequency => (
                      <label key={frequency} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedCoverFrequencies.includes(frequency)}
                          onChange={() => toggleFilter(frequency, selectedCoverFrequencies, setSelectedCoverFrequencies)}
                          className="rounded border-zinc-600 text-green-400 focus:ring-green-400"
                        />
                        <span className="text-zinc-300">{frequency}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium text-white mb-2">Minimum Rating</h4>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-zinc-400 mt-1">
                    <span>Any</span>
                    <span className="text-green-400">{minRating > 0 ? `${minRating}+` : 'Any'}</span>
                    <span>5.0</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredBars.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-zinc-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No bars match your search criteria</p>
              <p className="text-sm">Try adjusting your filters or search terms</p>
            </div>
            {(searchQuery || selectedNeighborhoods.length > 0 || selectedMusicGenres.length > 0 || minRating > 0) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-green-400 hover:bg-green-500 text-black font-medium rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBars.map((bar) => (
              <BarCard key={bar.id} bar={bar} />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(SearchPage);
