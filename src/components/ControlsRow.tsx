'use client';

import React from 'react';

interface SortSegmentProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

const SortSegment: React.FC<SortSegmentProps> = ({ options, value, onChange }) => {
  return (
    <div className="flex bg-neutral-800/80 rounded-full p-1 border border-neutral-600/50 shadow-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            h-10 px-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 min-h-[44px]
            ${value === option.value
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-700/60'
            }
          `}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

interface ControlsRowProps {
  sortValue: string;
  onSortChange: (value: string) => void;
  onFiltersClick: () => void;
  updatedAt: string;
  hasActiveFilters?: boolean;
}

const ControlsRow: React.FC<ControlsRowProps> = ({
  sortValue,
  onSortChange,
  onFiltersClick,
  updatedAt,
  hasActiveFilters = false
}) => {
  const sortOptions = [
    { value: 'match', label: 'Match' },
    { value: 'cover', label: 'Cover' },
    { value: 'wait', label: 'Wait' },
    { value: 'rating', label: 'Rating' }
  ];

  return (
    <div className="sticky top-[48px] z-30 bg-neutral-900/80 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <SortSegment
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
          />
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400 font-medium tracking-wider uppercase">
              Updated {updatedAt}
            </span>
            <button
              onClick={onFiltersClick}
              className={`
                flex items-center gap-2 h-10 px-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 min-h-[44px]
                ${hasActiveFilters
                  ? 'bg-purple-600/20 text-purple-200 border border-purple-400/40 shadow-lg shadow-purple-500/10'
                  : 'bg-neutral-800/80 text-neutral-300 border border-neutral-600/50 hover:bg-neutral-700/80 hover:text-white'
                }
              `}
              aria-label="Open filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
              </svg>
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsRow;
