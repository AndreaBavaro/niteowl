import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserBarVisitInput } from '@/lib/types';

interface UserVisit {
  id: string;
  bar_id: string;
  visit_date: string;
  experience_rating: number;
  comment?: string;
  reported_wait_time?: string;
  reported_cover_charge?: string;
  reported_music_genres?: string[];
  reported_vibe?: string;
  reported_age_group?: string;
  reported_service_rating?: number;
  time_of_visit?: string;
  group_size?: string;
  special_event?: string;
  created_at: string;
  bar: {
    id: string;
    name: string;
    slug: string;
    neighbourhood: string;
    address: string;
  };
}

export function useBarVisits() {
  const { user } = useAuth();
  const [visits, setVisits] = useState<UserVisit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVisits = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user-visits', {
        headers: {
          'x-user-id': user.id
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load visits');
      }
      
      setVisits(data.visits || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading visits');
      console.error('Error loading visits:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const logVisit = useCallback(async (visitData: UserBarVisitInput) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    setError(null);
    
    try {
      const response = await fetch('/api/user-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(visitData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to log visit');
      }
      
      // Add the new visit to the list
      setVisits(prev => [data.visit, ...prev]);
      
      return { success: true, visit: data.visit };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while logging visit';
      setError(errorMessage);
      console.error('Error logging visit:', err);
      return { success: false, error: errorMessage };
    }
  }, [user?.id]);

  const updateVisit = useCallback(async (visitId: string, visitData: UserBarVisitInput) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    setError(null);
    
    try {
      const response = await fetch(`/api/user-visits?visit_id=${visitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify(visitData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update visit');
      }
      
      // Update the visit in the list
      setVisits(prev => prev.map(visit => 
        visit.id === visitId ? data.visit : visit
      ));
      
      return { success: true, visit: data.visit };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating visit';
      setError(errorMessage);
      console.error('Error updating visit:', err);
      return { success: false, error: errorMessage };
    }
  }, [user?.id]);

  const deleteVisit = useCallback(async (visitId: string) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    setError(null);
    
    try {
      const response = await fetch(`/api/user-visits?visit_id=${visitId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete visit');
      }
      
      // Remove the visit from the list
      setVisits(prev => prev.filter(visit => visit.id !== visitId));
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while deleting visit';
      setError(errorMessage);
      console.error('Error deleting visit:', err);
      return { success: false, error: errorMessage };
    }
  }, [user?.id]);

  const getVisitsForBar = useCallback((barId: string) => {
    return visits.filter(visit => visit.bar_id === barId);
  }, [visits]);

  const hasVisitedBar = useCallback((barId: string) => {
    return visits.some(visit => visit.bar_id === barId);
  }, [visits]);

  const getAverageRatingForBar = useCallback((barId: string) => {
    const barVisits = getVisitsForBar(barId);
    if (barVisits.length === 0) return null;
    
    const totalRating = barVisits.reduce((sum, visit) => sum + visit.experience_rating, 0);
    return totalRating / barVisits.length;
  }, [getVisitsForBar]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    visits,
    isLoading,
    error,
    loadVisits,
    logVisit,
    updateVisit,
    deleteVisit,
    getVisitsForBar,
    hasVisitedBar,
    getAverageRatingForBar,
    clearError
  };
}
