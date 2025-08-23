'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bar, UserProfile } from '@/lib/types';

export interface Recommendations {
  // Legacy sections (keeping for backward compatibility)
  perfectForTonight: Bar[];
  yourVibe: Bar[];
  quickEntry: Bar[];
  trendingInArea: Bar[];
  // New discovery-focused sections
  discoverTonight: Bar[]; // New bars matching user taste (65% weight)
  hiddenGems: Bar[]; // Lesser-known spots with special events
  yourRegulars: Bar[]; // Familiar favorites (35% weight, less prominent)
}

export interface ForYouPageState {
  currentTime: string;
  recommendations: Recommendations;
}

export interface ForYouPageActions {
  updateTime: () => void;
  generateBarImage: (barName: string) => string;
}

export function useForYouPage(user: UserProfile, initialRecommendations: Recommendations) {
  const [currentTime, setCurrentTime] = useState('');
  const [recommendations] = useState<Recommendations>(initialRecommendations);

  const updateTime = useCallback(() => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const greeting = now.getHours() < 12 ? 'Good morning' : 
                    now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
    setCurrentTime(`${greeting}! It's ${timeString} in Toronto`);
  }, []);

  const generateBarImage = useCallback((barName: string) => {
    const imageId = Math.abs(barName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 1000 + 100;
    return `https://picsum.photos/400/240?random=${imageId}`;
  }, []);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateTime]);

  const state: ForYouPageState = {
    currentTime,
    recommendations
  };

  const actions: ForYouPageActions = {
    updateTime,
    generateBarImage
  };

  return {
    state,
    actions
  };
}
