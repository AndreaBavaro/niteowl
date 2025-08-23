'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, LogOut, Menu, X, Home, Plus, Award, BarChart3, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function TopNavigation() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navigateToProfile = () => {
    router.push('/profile');
    setIsMenuOpen(false);
  };

  const navigateToHome = () => {
    router.push('/for-you');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Home */}
          <div className="flex items-center">
            <button
              onClick={navigateToHome}
              className="text-white font-bold text-xl hover:text-green-400 transition-colors"
            >
              NiteOwl
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bars, neighborhoods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => router.push('/for-you')}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => router.push('/for-you-netflix')}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Netflix Style</span>
            </button>
            
            <button
              onClick={() => router.push('/submit-bar')}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Bar</span>
            </button>
            
            {user?.reviewer_status === 'approved' && (
              <>
                <button
                  onClick={() => router.push('/community-reviews')}
                  className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>Reviews</span>
                </button>
                
                <button
                  onClick={() => router.push('/admin/analytics')}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
              </>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-zinc-300 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            
            {/* User Avatar - Clickable for Profile */}
            <button
              onClick={navigateToProfile}
              className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-700 hover:bg-zinc-700 transition-colors"
            >
              <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
                {/* Loyalty Points Badge */}
                {user?.loyalty_points && user.loyalty_points > 0 && (
                  <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    <span className="text-[10px]">⚡</span>
                  </div>
                )}
              </div>
              <span className="text-white text-sm font-medium hidden lg:block">
                {user?.full_name || 'User'}
              </span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => router.push('/search')}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {/* Profile with Loyalty Points Badge */}
            <button
              onClick={navigateToProfile}
              className="relative"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              {user?.loyalty_points && user.loyalty_points > 0 && (
                <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {user.loyalty_points > 99 ? '99+' : user.loyalty_points}
                </div>
              )}
            </button>
            
            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-zinc-800 border-t border-zinc-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={navigateToHome}
                className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => {
                  router.push('/submit-bar');
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                <Plus className="w-5 h-5" />
                Submit Bar
              </button>
              {user?.reviewer_status === 'approved' && (
                <>
                  <button
                    onClick={() => {
                      router.push('/community-reviews');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-green-400 hover:text-green-300 hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                  >
                    <Award className="w-5 h-5" />
                    Community Reviews
                  </button>
                  
                  <button
                    onClick={() => {
                      router.push('/admin/analytics');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-blue-400 hover:text-blue-300 hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Analytics Dashboard
                  </button>
                </>
              )}
              <button
                onClick={navigateToProfile}
                className="flex items-center gap-3 text-zinc-300 hover:text-white hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                <User className="w-5 h-5" />
                Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 text-zinc-300 hover:text-red-400 hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
              
              {/* Mobile User Info */}
              <div className="flex items-center gap-3 px-3 py-2 mt-4 bg-zinc-700 rounded-md">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">{user?.full_name || 'User'}</div>
                  <div className="text-zinc-400 text-sm">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
