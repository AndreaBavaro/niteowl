'use client';

import { useState, useCallback, useMemo } from 'react';
import { Bar } from '@/lib/types';
import { CategoryType } from '@/components/CategorySelector';

interface VenueQueueState {
  [key: string]: { // category key
    hiddenVenues: string[]; // venue IDs that have been hidden
    viewedVenues: string[]; // venue IDs that have been viewed/interacted with
  };
}

interface UseVenueQueueReturn {
  getVisibleVenues: (category: CategoryType, allVenues: Bar[]) => Bar[];
  hideVenue: (category: CategoryType, venueId: string) => void;
  resetCategory: (category: CategoryType) => void;
  getHiddenCount: (category: CategoryType) => number;
}

export const useVenueQueue = (): UseVenueQueueReturn => {
  const [queueState, setQueueState] = useState<VenueQueueState>({});

  const getVisibleVenues = useCallback((category: CategoryType, allVenues: Bar[]): Bar[] => {
    const categoryState = queueState[category];
    
    if (!categoryState || categoryState.hiddenVenues.length === 0) {
      return allVenues;
    }

    // Get venues that haven't been hidden
    const visibleVenues = allVenues.filter(venue => 
      !categoryState.hiddenVenues.includes(venue.id)
    );

    // If no visible venues remain, reset and show all venues again
    if (visibleVenues.length === 0) {
      // Reset the category state
      setQueueState(prev => ({
        ...prev,
        [category]: {
          hiddenVenues: [],
          viewedVenues: []
        }
      }));
      return allVenues;
    }

    // If we have very few visible venues left (less than 3), start showing hidden ones again
    if (visibleVenues.length < 3 && allVenues.length > 3) {
      const hiddenVenues = allVenues.filter(venue => 
        categoryState.hiddenVenues.includes(venue.id)
      );
      
      // Add back the oldest hidden venues to reach at least 3 visible
      const venuesToRestore = hiddenVenues.slice(0, 3 - visibleVenues.length);
      const restoredIds = venuesToRestore.map(v => v.id);
      
      // Update state to remove restored venues from hidden list
      setQueueState(prev => ({
        ...prev,
        [category]: {
          ...categoryState,
          hiddenVenues: categoryState.hiddenVenues.filter(id => !restoredIds.includes(id))
        }
      }));
      
      return [...visibleVenues, ...venuesToRestore];
    }

    return visibleVenues;
  }, [queueState]);

  const hideVenue = useCallback((category: CategoryType, venueId: string) => {
    setQueueState(prev => {
      const categoryState = prev[category] || { hiddenVenues: [], viewedVenues: [] };
      
      // Don't hide if already hidden
      if (categoryState.hiddenVenues.includes(venueId)) {
        return prev;
      }

      return {
        ...prev,
        [category]: {
          ...categoryState,
          hiddenVenues: [...categoryState.hiddenVenues, venueId],
          viewedVenues: categoryState.viewedVenues.includes(venueId) 
            ? categoryState.viewedVenues 
            : [...categoryState.viewedVenues, venueId]
        }
      };
    });
  }, []);

  const resetCategory = useCallback((category: CategoryType) => {
    setQueueState(prev => ({
      ...prev,
      [category]: {
        hiddenVenues: [],
        viewedVenues: []
      }
    }));
  }, []);

  const getHiddenCount = useCallback((category: CategoryType): number => {
    return queueState[category]?.hiddenVenues.length || 0;
  }, [queueState]);

  return {
    getVisibleVenues,
    hideVenue,
    resetCategory,
    getHiddenCount
  };
};
