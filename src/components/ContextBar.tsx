'use client';

import React from 'react';

interface ContextChipProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  isActive?: boolean;
  isGhost?: boolean;
  onClick: () => void;
  'aria-expanded'?: boolean;
}

const ContextChip: React.FC<ContextChipProps> = ({
  icon,
  label,
  value,
  isActive = false,
  isGhost = false,
  onClick,
  ...ariaProps
}) => {
  const ariaExpanded = ariaProps['aria-expanded'];

  return (
    <button
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-label={`${label}: ${value || 'not set'}. Opens editor.`}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 min-h-[36px] md:min-h-[44px]
        ${isGhost
          ? 'border-2 border-dashed border-neutral-600 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300'
          : isActive
            ? 'bg-purple-600/20 text-purple-200 border border-purple-400/40 shadow-lg shadow-purple-500/10'
            : 'bg-neutral-800/80 text-neutral-200 border border-neutral-600/50 hover:bg-neutral-700/80 hover:text-white'
        }
      `}
    >
      {icon && (
        <span className="text-base md:hidden">{icon}</span>
      )}
      <div className="flex flex-col items-start">
        <span className="text-xs opacity-75 whitespace-nowrap hidden md:block">{label}</span>
        <span className="font-bold whitespace-nowrap text-xs md:text-sm">{value || 'Set'}</span>
      </div>
    </button>
  );
};

interface ContextBarProps {
  area?: string;
  vibe?: string;
  tonight?: string;
  points: number;
  onAreaClick: () => void;
  onVibeClick: () => void;
  onTonightClick: () => void;
  onPointsClick: () => void;
  activeChip?: 'area' | 'vibe' | 'tonight' | 'points';
}

const ContextBar: React.FC<ContextBarProps> = ({
  area,
  vibe,
  tonight,
  points,
  activeChip,
  onAreaClick,
  onVibeClick,
  onTonightClick,
  onPointsClick
}) => {
  return (
    <div className="sticky top-[64px] z-20 bg-neutral-900/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xs font-medium text-neutral-400 tracking-wider uppercase">Your Preferences</h2>
          <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
          <ContextChip
            label="📍 Area"
            value={area}
            isActive={activeChip === 'area'}
            onClick={onAreaClick}
          />
          <ContextChip
            label="🎵 Vibe"
            value={vibe}
            isActive={activeChip === 'vibe'}
            onClick={onVibeClick}
          />
          <ContextChip
            label="🕘 Time"
            value={tonight}
            isActive={activeChip === 'tonight'}
            onClick={onTonightClick}
          />
          <ContextChip
            label="⚡ Match"
            value={points?.toString()}
            isActive={activeChip === 'points'}
            isGhost={!points}
            onClick={onPointsClick}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextBar;
