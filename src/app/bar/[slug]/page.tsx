import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Bar } from '@/lib/types';
import Link from 'next/link';
import { 
  Clock, 
  DollarSign, 
  Users, 
  Star, 
  MapPin, 
  Music, 
  Calendar,
  ArrowLeft,
  Heart
} from 'lucide-react';


// Server component to fetch bar by slug
async function getBar(slug: string): Promise<Bar | null> {
  if (!supabase) {
    console.warn('Supabase client not available');
    return null;
  }

  const { data, error } = await supabase
    .from('bars')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching bar:', error);
    return null;
  }

  return data;
}

// Server component to fetch similar bars
async function getSimilarBars(currentBar: Bar): Promise<Bar[]> {
  if (!supabase) return [];

  // Find bars with similar music genres or age groups
  const { data, error } = await supabase
    .from('bars')
    .select('*')
    .neq('id', currentBar.id)
    .limit(3);

  if (error) {
    console.error('Error fetching similar bars:', error);
    return [];
  }

  return data || [];
}

// Bar detail component
async function BarDetail({ slug }: { slug: string }) {
  const bar = await getBar(slug);

  if (!bar) {
    notFound();
  }

  const similarBars = await getSimilarBars(bar);

  const getCoverDisplay = () => {
    if (bar.cover_frequency === 'No cover') return 'Free Entry';
    if (bar.cover_frequency === 'Sometimes') {
      return `Sometimes ${bar.cover_amount || 'Cover Charge'}`;
    }
    return `${bar.cover_amount || 'Cover Charge'} (Always)`;
  };

  const getLineupDisplay = () => {
    if (bar.typical_lineup_max) {
      return `${bar.typical_lineup_min} - ${bar.typical_lineup_max}`;
    }
    return bar.typical_lineup_min;
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
        <Link 
          href="/bars" 
          className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all bars
        </Link>

        {/* Main Bar Info */}
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-zinc-700/50 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-green-100 to-purple-100 bg-clip-text text-transparent mb-3">{bar.name}</h1>
              {bar.neighbourhood && (
                <div className="flex items-center text-zinc-400 text-lg">
                  <MapPin className="w-5 h-5 mr-2" />
                  {bar.neighbourhood}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-xl border border-green-500/30">
                <Star className="w-6 h-6 mr-2 fill-current text-green-400" />
                <span className="text-2xl font-bold text-green-400">{bar.service_rating}</span>
                <span className="text-zinc-400 ml-1 text-lg">/10</span>
              </div>
              <button className="p-3 bg-gradient-to-r from-pink-500/20 to-red-500/20 hover:from-pink-500/30 hover:to-red-500/30 rounded-full transition-all duration-300 border border-pink-500/30 hover:border-pink-500/50 hover:scale-110">
                <Heart className="w-6 h-6 text-pink-400" />
              </button>
            </div>
          </div>

          {/* Description */}
          {bar.description && (
            <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
              {bar.description}
            </p>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Wait Time */}
            <div className="bg-zinc-700/30 backdrop-blur-sm rounded-xl p-5 border border-zinc-600/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Wait Time</h3>
              </div>
              <p className="text-zinc-300">{getLineupDisplay()}</p>
              {bar.longest_line_days.length > 0 && (
                <p className="text-zinc-500 text-sm mt-1">
                  Longest on: {bar.longest_line_days.join(', ')}
                </p>
              )}
            </div>

            {/* Cover Charge */}
            <div className="bg-zinc-700/30 backdrop-blur-sm rounded-xl p-5 border border-zinc-600/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Cover</h3>
              </div>
              <p className="text-zinc-300">{getCoverDisplay()}</p>
            </div>

            {/* Age Group */}
            <div className="bg-zinc-700/30 backdrop-blur-sm rounded-xl p-5 border border-zinc-600/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Crowd</h3>
              </div>
              <p className="text-zinc-300 text-lg font-medium">
                Ages {bar.age_group_min}
                {bar.age_group_max && bar.age_group_max !== bar.age_group_min && ` - ${bar.age_group_max}`}
              </p>
            </div>

            {/* Service Rating */}
            <div className="bg-zinc-700/30 backdrop-blur-sm rounded-xl p-5 border border-zinc-600/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/10">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg mr-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Service</h3>
              </div>
              <p className="text-zinc-300 text-lg font-medium">{bar.service_rating}/10</p>
            </div>
          </div>

          {/* Vibe & Music */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vibe */}
            <div className="bg-zinc-700/30 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 hover:border-indigo-400/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-xl mr-4">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Vibe</h3>
              </div>
              <p className="text-zinc-300 leading-relaxed text-lg">{bar.typical_vibe}</p>
            </div>

            {/* Music */}
            <div className="bg-zinc-700/30 backdrop-blur-sm rounded-2xl p-8 border border-zinc-600/30 hover:border-green-400/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-500/20 rounded-xl mr-4">
                  <Music className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Music</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {bar.top_music.map((genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-xl text-sm font-medium border border-green-500/30 hover:border-green-400/50 transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Bars */}
        {similarBars.length > 0 && (
          <div className="bg-zinc-800/30 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent mb-8">Similar Bars</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarBars.map((similarBar) => (
                <Link key={similarBar.id} href={`/bar/${similarBar.slug}`}>
                  <div className="bg-zinc-700/40 backdrop-blur-sm rounded-xl p-6 hover:bg-zinc-600/40 transition-all duration-300 cursor-pointer border border-zinc-600/30 hover:border-green-400/50 hover:scale-105 hover:shadow-lg hover:shadow-green-500/10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white hover:text-green-400 transition-colors">{similarBar.name}</h3>
                      <div className="flex items-center bg-green-500/20 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 mr-1 fill-current text-green-400" />
                        <span className="text-sm text-green-400 font-medium">{similarBar.service_rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {similarBar.top_music.slice(0, 2).map((genre) => (
                        <span
                          key={genre}
                          className="px-3 py-1 bg-zinc-600/50 text-zinc-300 text-xs rounded-full border border-zinc-500/30"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function BarDetailSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="h-6 bg-zinc-700 rounded w-32 mb-6 animate-pulse"></div>
        <div className="bg-zinc-900 rounded-lg p-8 mb-8 border border-zinc-800 animate-pulse">
          <div className="h-10 bg-zinc-700 rounded w-64 mb-4"></div>
          <div className="h-6 bg-zinc-700 rounded w-48 mb-6"></div>
          <div className="h-20 bg-zinc-700 rounded w-full mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-zinc-800 rounded-lg p-4">
                <div className="h-6 bg-zinc-700 rounded w-24 mb-2"></div>
                <div className="h-4 bg-zinc-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component (Server Component)
async function BarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={<BarDetailSkeleton />}>
      <BarDetail slug={slug} />
    </Suspense>
  );
}

export default BarPage;
