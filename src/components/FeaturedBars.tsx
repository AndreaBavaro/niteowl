
import { supabase } from '@/lib/supabase';
import { Bar } from '@/lib/types';
import Link from 'next/link';
import { Clock, DollarSign, Users, Star, MapPin, ArrowRight } from 'lucide-react';

// Server component to fetch featured bars
async function getFeaturedBars(): Promise<Bar[]> {
  if (!supabase) {
    console.warn('Supabase client not available');
    return [];
  }

  const { data, error } = await supabase
    .from('bars')
    .select('*')
    .order('service_rating', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured bars:', error);
    return [];
  }

  return data || [];
}

// Featured bar card component
function FeaturedBarCard({ bar }: { bar: Bar }) {
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
      <div className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors cursor-pointer border border-zinc-800 h-full">
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
        </div>

        <div className="flex flex-wrap gap-1">
          {bar.top_music.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

// Featured bars section
export default async function FeaturedBars() {
  const bars = await getFeaturedBars();

  if (bars.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-400">
          {!supabase ? 'Database connection not available.' : 'No bars available yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bars.map((bar) => (
        <FeaturedBarCard key={bar.id} bar={bar} />
      ))}
    </div>
  );
}

// Loading skeleton
export function FeaturedBarsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 animate-pulse">
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
          </div>
          <div className="flex gap-1">
            <div className="h-5 bg-zinc-700 rounded-full w-12"></div>
            <div className="h-5 bg-zinc-700 rounded-full w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
