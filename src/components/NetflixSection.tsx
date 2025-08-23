'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NetflixVenueCard } from './NetflixVenueCard';
import { Bar } from '@/lib/types';

interface NetflixSectionProps {
  title: string;
  venues: Bar[];
  priority?: boolean;
}

export const NetflixSection: React.FC<NetflixSectionProps> = ({ 
  title, 
  venues, 
  priority = false 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; // Scroll 80% of container width
      const newScrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Check scroll buttons after animation
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [venues]);

  if (venues.length === 0) return null;

  return (
    <div className="relative mb-12 group">
      {/* Section Title */}
      <h2 className="text-2xl font-bold text-white mb-4 px-4 md:px-8">
        {title}
      </h2>
      
      {/* Scroll Container */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
        
        {/* Venues Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {venues.map((venue, index) => (
            <div key={venue.id} className="flex-none">
              <NetflixVenueCard 
                venue={venue} 
                priority={priority && index < 4} // Priority loading for first 4 cards in first section
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
