import React from 'react';

interface NiteFinderLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NiteFinderLogo: React.FC<NiteFinderLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wolf silhouette with gradient */}
        <defs>
          <linearGradient id="wolfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6b21a8" />
          </linearGradient>
          <linearGradient id="headphonesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </linearGradient>
        </defs>
        
        {/* Wolf body/head shape */}
        <path
          d="M100 30 C120 25, 140 35, 150 55 C155 70, 150 85, 145 95 L145 120 C145 140, 140 160, 130 175 C120 185, 110 190, 100 190 C90 190, 80 185, 70 175 C60 160, 55 140, 55 120 L55 95 C50 85, 45 70, 50 55 C60 35, 80 25, 100 30 Z"
          fill="url(#wolfGradient)"
        />
        
        {/* Wolf ears */}
        <path
          d="M75 45 C70 35, 75 25, 85 30 C90 35, 85 45, 80 50 Z"
          fill="url(#wolfGradient)"
        />
        <path
          d="M125 45 C130 35, 125 25, 115 30 C110 35, 115 45, 120 50 Z"
          fill="url(#wolfGradient)"
        />
        
        {/* Wolf snout */}
        <ellipse
          cx="100"
          cy="85"
          rx="15"
          ry="10"
          fill="url(#wolfGradient)"
        />
        
        {/* Headphones */}
        <circle
          cx="70"
          cy="65"
          r="12"
          fill="url(#headphonesGradient)"
          stroke="#9333ea"
          strokeWidth="2"
        />
        <circle
          cx="130"
          cy="65"
          r="12"
          fill="url(#headphonesGradient)"
          stroke="#9333ea"
          strokeWidth="2"
        />
        <path
          d="M82 60 Q100 50, 118 60"
          stroke="url(#headphonesGradient)"
          strokeWidth="3"
          fill="none"
        />
        
        {/* Nightlife crowd silhouettes at bottom */}
        <g transform="translate(0, 140)">
          {/* Person 1 */}
          <circle cx="60" cy="25" r="8" fill="white" opacity="0.8" />
          <rect x="55" y="33" width="10" height="20" fill="white" opacity="0.8" />
          <path d="M50 45 L55 40 L65 40 L70 45" fill="white" opacity="0.8" />
          
          {/* Person 2 */}
          <circle cx="100" cy="20" r="10" fill="white" opacity="0.9" />
          <rect x="93" y="30" width="14" height="25" fill="white" opacity="0.9" />
          <path d="M85 50 L93 43 L107 43 L115 50" fill="white" opacity="0.9" />
          
          {/* Person 3 */}
          <circle cx="140" cy="25" r="8" fill="white" opacity="0.8" />
          <rect x="135" y="33" width="10" height="20" fill="white" opacity="0.8" />
          <path d="M130 45 L135 40 L145 40 L150 45" fill="white" opacity="0.8" />
        </g>
        
        {/* Sparkles/stars for nightlife effect */}
        <g fill="white" opacity="0.7">
          <path d="M30 40 L32 44 L36 42 L32 46 L30 50 L28 46 L24 42 L28 44 Z" />
          <path d="M170 60 L171 62 L173 61 L171 63 L170 65 L169 63 L167 61 L169 62 Z" />
          <path d="M160 30 L161 32 L163 31 L161 33 L160 35 L159 33 L157 31 L159 32 Z" />
          <path d="M40 80 L41 82 L43 81 L41 83 L40 85 L39 83 L37 81 L39 82 Z" />
        </g>
      </svg>
    </div>
  );
};
