import { Suspense } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Bar } from '@/lib/types';
import Link from 'next/link';
import { Clock, DollarSign, Users, Star, MapPin } from 'lucide-react';
import BarsSearchClient from '@/components/BarsSearchClient';

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

// Server component to fetch bars data
async function getBars(): Promise<Bar[]> {
  // Handle mock mode
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    // Return mock bars data
    return [
      {
        id: 'bar-1',
        name: 'Rebel Nightclub',
        slug: 'rebel-nightclub',
        neighbourhood: 'Entertainment District',
        address: '69 Polson St, Toronto, ON',
        description: 'Toronto\'s largest nightclub with world-class DJs.',
        typical_lineup_min: '30+ min',
        typical_lineup_max: undefined,
        longest_line_days: ['Fri', 'Sat'],
        cover_frequency: 'Yes-always',
        cover_amount: 'Over $20',
        typical_vibe: 'High-energy dance club',
        top_music: ['House', 'EDM'],
        age_group_min: '18-21',
        age_group_max: '25-30',
        service_rating: 4.2,
        live_music_days: ['Fri', 'Sat'],
        has_patio: false,
        has_rooftop: false,
        has_dancefloor: true,
        karaoke_nights: [],
        has_food: true,
        capacity_size: 'Large',
        has_pool_table: false,
        has_arcade_games: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'bar-2',
        name: 'TOYBOX',
        slug: 'toybox',
        neighbourhood: 'King West',
        address: '473 Adelaide St W, Toronto, ON',
        description: 'Upscale nightclub with VIP bottle service.',
        typical_lineup_min: '15-30 min',
        typical_lineup_max: '30+ min',
        longest_line_days: ['Fri', 'Sat'],
        cover_frequency: 'Sometimes',
        cover_amount: '$10-$20',
        typical_vibe: 'Upscale and exclusive',
        top_music: ['Hip-hop', 'Top 40'],
        age_group_min: '22-25',
        age_group_max: '25-30',
        service_rating: 4.5,
        live_music_days: [],
        has_patio: false,
        has_rooftop: true,
        has_dancefloor: true,
        karaoke_nights: [],
        has_food: true,
        capacity_size: 'Medium',
        has_pool_table: false,
        has_arcade_games: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase
      .from('bars')
      .select('*')
      .order('service_rating', { ascending: false });

    if (error) {
      console.error('Error fetching bars:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBars:', error);
    return [];
  }
}

async function BarsPage() {
  const bars = await getBars();

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

          {bars.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-400 text-lg">No bars available yet.</p>
            </div>
          ) : (
            <BarsSearchClient bars={bars} />
          )}
        </div>
      </div>
    </div>
  );
}

export default BarsPage;
