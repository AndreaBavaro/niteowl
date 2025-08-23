import { Suspense } from 'react';
import Link from 'next/link';
import { Clock, DollarSign, Users, ArrowRight } from 'lucide-react';
import FeaturedBars, { FeaturedBarsSkeleton } from '@/components/FeaturedBars';

function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8 animate-slide-in-up">
              <h1 className="text-6xl md:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">
                  NiteFinder
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 via-green-300 to-emerald-400 bg-clip-text text-transparent animate-shimmer">
                  TO
                </span>
              </h1>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-purple-500 rounded-full" />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-zinc-300 mb-12 leading-relaxed max-w-3xl mx-auto animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              Your ultimate guide to Toronto's nightlife. Get <span className="text-green-400 font-semibold">real-time insights</span>, 
              <span className="text-purple-400 font-semibold">crowd levels</span>, and <span className="text-blue-400 font-semibold">vibe checks</span> for the city's hottest spots. 
              Own the night, every night.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <Link 
                href="/demo"
                className="group bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-black font-bold px-10 py-4 rounded-2xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
              >
                <span className="mr-3">✨</span>
                Try Demo Experience
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/signup"
                className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="mr-3">🚀</span>
                Join Exclusive Beta
              </Link>
              <Link 
                href="/bars"
                className="group border-2 border-zinc-600 hover:border-zinc-400 bg-zinc-900/50 backdrop-blur-sm text-white font-bold px-10 py-4 rounded-2xl transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:bg-zinc-800/50"
              >
                <span className="mr-3">🍻</span>
                Browse Bars
              </Link>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-32 left-10 animate-float" style={{ animationDelay: '0s' }}>
              <div className="w-4 h-4 bg-green-400/30 rounded-full blur-sm" />
            </div>
            <div className="absolute top-48 right-16 animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-6 h-6 bg-purple-400/30 rounded-full blur-sm" />
            </div>
            <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-3 h-3 bg-blue-400/30 rounded-full blur-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Bars Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Top Rated Bars</h2>
            <p className="text-zinc-400">Highest rated bars based on service and experience</p>
          </div>
          <Link 
            href="/bars"
            className="text-green-400 hover:text-green-300 font-medium inline-flex items-center transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <Suspense fallback={<FeaturedBarsSkeleton />}>
          <FeaturedBars />
        </Suspense>
      </div>

      {/* Features Section */}
      <div className="bg-zinc-900/50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose NightOwl TO?</h2>
            <p className="text-zinc-400 text-lg">Your nocturnal companion for Toronto's best nightlife experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-400/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-Time Wait Times</h3>
              <p className="text-zinc-400">Know exactly how long you'll wait before heading out</p>
            </div>

            <div className="text-center">
              <div className="bg-green-400/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cover Charge Info</h3>
              <p className="text-zinc-400">Budget accordingly with accurate cover charge details</p>
            </div>

            <div className="text-center">
              <div className="bg-green-400/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Crowd Insights</h3>
              <p className="text-zinc-400">Find bars that match your vibe and age group</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
