'use client';

import React, { useState, useEffect } from 'react';

interface ForYouHeaderProps {
  userName: string;
  showTime?: boolean;
  isCollapsed?: boolean;
  className?: string;
}

const ForYouHeader = React.forwardRef<HTMLElement, ForYouHeaderProps>(({ 
  userName,
  showTime = true,
  isCollapsed = false,
  className = ''
}, ref) => {
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header 
      ref={ref}
      className={`transition-all duration-300 ${
        isCollapsed ? 'h-[56px] py-3' : 'h-[96px] py-6'
      } ${className}`}
      data-collapsed={isCollapsed}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`font-black tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent transition-all duration-300 leading-none ${
          isCollapsed ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl lg:text-7xl'
        }`}>
          Good evening, {userName} 👋
        </h1>
        {showTime && !isCollapsed && mounted && (
          <p className="text-neutral-400 text-xl font-medium tracking-wide mt-3 hidden md:block">
            {currentTime}
          </p>
        )}
      </div>
    </header>
  );
});

ForYouHeader.displayName = 'ForYouHeader';

export default ForYouHeader;
