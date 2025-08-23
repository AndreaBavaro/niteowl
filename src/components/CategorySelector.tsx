'use client';

import React, { useState } from 'react';
import { Zap, Star, Clock, TreePine, Wine, DollarSign, MapPin, ChevronDown, X, Check } from 'lucide-react';

export type CategoryType = 'discoverTonight' | 'hiddenGems' | 'yourRegulars' | 'patios' | 'happyHour' | 'freeCover' | 'nearYou';

interface CategoryOption {
  id: CategoryType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface CategorySelectorProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  categoryCounts?: Record<CategoryType, number>;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  categoryCounts = {}
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const categories: CategoryOption[] = [
    {
      id: 'discoverTonight',
      label: 'Discover Tonight',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'hiddenGems',
      label: 'Hidden Gems',
      icon: <Star className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'yourRegulars',
      label: 'Your Regulars',
      icon: <Clock className="w-5 h-5" />,
      color: 'from-zinc-500 to-zinc-600'
    },
    {
      id: 'patios',
      label: 'Patios',
      icon: <TreePine className="w-5 h-5" />,
      color: 'from-green-600 to-teal-600'
    },
    {
      id: 'happyHour',
      label: 'Happy Hour',
      icon: <Wine className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'freeCover',
      label: 'Free Cover',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'nearYou',
      label: 'Near You',
      icon: <MapPin className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const currentCategory = categories.find(cat => cat.id === selectedCategory);
  const currentCount = categoryCounts[selectedCategory] || 0;

  const handleMobileCategorySelect = (categoryId: CategoryType) => {
    onCategoryChange(categoryId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop: Full Category Tabs */}
      <div className="hidden md:block sticky top-[96px] z-20 bg-neutral-900/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex bg-neutral-800/80 rounded-2xl p-1.5 border border-neutral-600/50 shadow-xl overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              const count = categoryCounts[category.id] || 0;
              
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 min-h-[48px] whitespace-nowrap
                    ${isSelected
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg shadow-black/20`
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-700/60'
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-neutral-700/50'}`}>
                    {category.icon}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black tracking-tight">
                      {category.label}
                    </span>
                    {count > 0 && (
                      <span className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                        {count} venues
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Compact Category Button */}
      <div className="md:hidden sticky top-[64px] z-20 bg-neutral-900/95 backdrop-blur-sm border-b border-white/5">
        <div className="px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`
              w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200
              bg-gradient-to-r ${currentCategory?.color} text-white shadow-lg
            `}
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg">
                {currentCategory?.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{currentCategory?.label}</span>
                <span className="text-xs text-white/80">{currentCount} venues</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Category Selection Modal */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-neutral-900 rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Select Category</h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.id;
                const count = categoryCounts[category.id] || 0;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleMobileCategorySelect(category.id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                      ${isSelected
                        ? `bg-gradient-to-r ${category.color} text-white`
                        : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50 hover:text-white'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-neutral-700/50'}`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex flex-col items-start">
                        <span className="font-bold">{category.label}</span>
                        <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                          {count} venues
                        </span>
                      </div>
                      {isSelected && <Check className="w-5 h-5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategorySelector;
