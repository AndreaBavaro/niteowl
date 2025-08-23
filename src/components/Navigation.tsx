'use client';

import Link from 'next/link';
import { Menu, X, Home, Search, MapPin, User, Heart, Zap, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigation } from '@/hooks/useNavigation';

export default function Navigation() {
  const { state, actions } = useNavigation();
  const { isOpen, user, isAuthenticated } = state;
  const { toggleMenu, closeMenu, handleSignOut } = actions;

  return (
    <nav className="bg-zinc-900/80 backdrop-blur-md text-white border-b border-zinc-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">🦉</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">NightOwl TO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/bars" className="text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 font-medium">
              Bars
            </Link>
            <Link href="/search" className="text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 font-medium">
              Search
            </Link>
            {user && (
              <Link href="/recommendations" className="text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 font-medium">
                For You
              </Link>
            )}
            
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-bold text-green-400">{user.loyalty_points} pts</span>
                </div>
                <Link href="/profile" className="flex items-center space-x-2 text-zinc-300 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-200">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline font-medium">{user.full_name || 'User'}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800/50">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
              <Link
                href="/bars"
                className="block px-3 py-2 text-base font-medium hover:text-purple-400 transition-colors"
                onClick={closeMenu}
              >
                Bars
              </Link>
              <Link
                href="/search"
                className="block px-3 py-2 text-base font-medium hover:text-purple-400 transition-colors"
                onClick={closeMenu}
              >
                Search
              </Link>
              {user && (
                <Link
                  href="/recommendations"
                  className="block px-3 py-2 text-base font-medium hover:text-purple-400 transition-colors"
                  onClick={closeMenu}
                >
                  For You
                </Link>
              )}
              
              <div className="border-t border-gray-700 pt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium hover:text-purple-400 transition-colors"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 text-base font-medium hover:text-purple-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block px-3 py-2 text-base font-medium hover:text-purple-400 transition-colors"
                      onClick={closeMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-3 py-2 text-base font-medium hover:text-purple-400 transition-colors"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
