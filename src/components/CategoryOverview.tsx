'use client';

import React from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryType } from './CategorySelector';

interface CategoryOverviewProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  categoryCounts: Record<CategoryType, number>;
  onFiltersClick: () => void;
  hasActiveFilters?: boolean;
}

const categoryLabels: Record<CategoryType, string> = {
  discoverTonight: 'Discover Tonight',
  hiddenGems: 'Hidden Gems',
  yourRegulars: 'Your Regulars'
};

const CategoryOverview: React.FC<CategoryOverviewProps> = ({
  selectedCategory,
  onCategoryChange,
  categoryCounts,
  onFiltersClick,
  hasActiveFilters = false
}) => {
  // Get all category keys for navigation
  const categoryKeys = Object.keys(categoryLabels) as CategoryType[];
  const currentIndex = categoryKeys.indexOf(selectedCategory);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < categoryKeys.length - 1;
  
  const goToPrevious = () => {
    if (canGoLeft) {
      onCategoryChange(categoryKeys[currentIndex - 1]);
    }
  };
  
  const goToNext = () => {
    if (canGoRight) {
      onCategoryChange(categoryKeys[currentIndex + 1]);
    }
  };
  
  const currentLabel = categoryLabels[selectedCategory];
  const currentCount = categoryCounts[selectedCategory] || 0;

  return (
    <div className="sticky top-[140px] z-20 bg-neutral-900/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Left Chevron */}
            <button
              onClick={goToPrevious}
              disabled={!canGoLeft}
              className={`p-2 rounded-full transition-all duration-200 ${
                canGoLeft 
                  ? 'text-white hover:bg-white/10 hover:scale-110' 
                  : 'text-neutral-600 cursor-not-allowed'
              }`}
              aria-label="Previous category"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Active Category Display */}
            <div className="flex flex-col items-start">
              <span className="font-bold text-xl tracking-tight text-white">
                {currentLabel}
              </span>
              <span className="text-sm font-medium text-purple-300">
                {currentCount} venue{currentCount !== 1 ? 's' : ''}
              </span>
            </div>
            
            {/* Right Chevron */}
            <button
              onClick={goToNext}
              disabled={!canGoRight}
              className={`p-2 rounded-full transition-all duration-200 ${
                canGoRight 
                  ? 'text-white hover:bg-white/10 hover:scale-110' 
                  : 'text-neutral-600 cursor-not-allowed'
              }`}
              aria-label="Next category"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Filters Button */}
          <button
            onClick={onFiltersClick}
            className={`
              flex items-center gap-2 h-10 px-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-200
              ${hasActiveFilters
                ? 'bg-purple-600/20 text-purple-200 border border-purple-400/40 shadow-lg shadow-purple-500/10'
                : 'bg-neutral-800/80 text-neutral-300 border border-neutral-600/50 hover:bg-neutral-700/80 hover:text-white'
              }
            `}
            aria-label="Open filters"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryOverview;
