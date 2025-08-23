'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Bell, User, ArrowLeft } from 'lucide-react';

export const NetflixNavigation: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Back to original For You */}
            <Link 
              href="/for-you"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Original</span>
            </Link>
            
            {/* Logo */}
            <Link href="/for-you-netflix" className="text-2xl font-bold text-white">
              Nite Owl
            </Link>
            
            {/* Netflix-style menu items */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <button className="text-white font-medium">Home</button>
              <button className="text-neutral-400 hover:text-neutral-200 transition-colors">Bars</button>
              <button className="text-neutral-400 hover:text-neutral-200 transition-colors">Clubs</button>
              <button className="text-neutral-400 hover:text-neutral-200 transition-colors">Restaurants</button>
              <button className="text-neutral-400 hover:text-neutral-200 transition-colors">My List</button>
            </div>
          </div>
          
          {/* Right side - User actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {/* Notifications */}
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            {/* User Profile */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 text-neutral-400 hover:text-white transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden md:block text-sm">{user?.first_name || 'User'}</span>
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-sm border border-neutral-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/favorites" 
                    className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors"
                  >
                    My Favorites
                  </Link>
                  <button 
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-800/50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
