'use client';

import { useState, useMemo } from 'react';
import { Bar, LineupTimeRange, CoverFrequency, CoverAmount, AgeGroup, MusicGenre } from '@/lib/types';
import Link from 'next/link';
import { Search, Filter, X, Clock, DollarSign, Users, Star, MapPin, Music } from 'lucide-react';
import TopNavigation from '@/components/TopNavigation';

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

interface SearchPageClientProps {
  bars: Bar[];
}

export default function SearchPageClient({ bars }: SearchPageClientProps) {
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
      if (minRating > 0 && bar.service_rating < minRating) {
        return false;
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

  const hasActiveFilters = selectedNeighborhoods.length > 0 || selectedLineupTimes.length > 0 || 
    selectedCoverFrequencies.length > 0 || selectedCoverAmounts.length > 0 || 
    selectedAgeGroups.length > 0 || selectedMusicGenres.length > 0 || minRating > 0;

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <TopNavigation />
      
      <div className="pt-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">Search</span>
              {' '}
              <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent">Bars</span>
            </h1>
            <p className="text-zinc-300 text-lg max-w-2xl mx-auto">Find your perfect night out in Toronto</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search bars, neighborhoods, vibes, music..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl text-white placeholder-zinc-400 focus:outline-none focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 text-lg"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  showFilters || hasActiveFilters
                    ? 'bg-green-400 text-black'
                    : 'bg-zinc-800/50 text-white hover:bg-zinc-700/50'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-black/20 text-xs px-2 py-1 rounded-full">
                    {[selectedNeighborhoods, selectedLineupTimes, selectedCoverFrequencies, selectedCoverAmounts, selectedAgeGroups, selectedMusicGenres].filter(arr => arr.length > 0).length + (minRating > 0 ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Results Count */}
            <div className="text-center">
              <p className="text-zinc-400">
                {filteredBars.length} of {bars.length} bars
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-8 bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Filter Options</h3>
                <div className="flex space-x-3">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-zinc-400 hover:text-white transition-colors text-sm"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Neighborhoods */}
                <div>
                  <h4 className="font-medium text-white mb-2">Neighborhoods</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {filterOptions.neighborhoods.map(neighborhood => (
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

          {/* Results */}
          {filteredBars.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-zinc-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No bars match your search criteria</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
              {(searchQuery || hasActiveFilters) && (
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
