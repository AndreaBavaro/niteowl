import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserFavorite {
  id: string;
  bar_id: string;
  created_at: string;
  bar: {
    id: string;
    name: string;
    slug: string;
    neighbourhood: string;
    address: string;
    description: string;
    typical_vibe: string;
    top_music: string[];
    has_rooftop: boolean;
    has_patio: boolean;
    has_dancefloor: boolean;
  };
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/user-favorites', {
        headers: {
          'x-user-id': user.id
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load favorites');
      }
      
      setFavorites(data.favorites || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading favorites');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const addFavorite = useCallback(async (barId: string) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    setError(null);
    
    try {
      const response = await fetch('/api/user-favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ bar_id: barId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add favorite');
      }
      
      // Add the new favorite to the list
      setFavorites(prev => [data.favorite, ...prev]);
      
      return { success: true, favorite: data.favorite };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while adding favorite';
      setError(errorMessage);
      console.error('Error adding favorite:', err);
      return { success: false, error: errorMessage };
    }
  }, [user?.id]);

  const removeFavorite = useCallback(async (barId: string) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    setError(null);
    
    try {
      const response = await fetch(`/api/user-favorites?bar_id=${barId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove favorite');
      }
      
      // Remove the favorite from the list
      setFavorites(prev => prev.filter(fav => fav.bar_id !== barId));
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while removing favorite';
      setError(errorMessage);
      console.error('Error removing favorite:', err);
      return { success: false, error: errorMessage };
    }
  }, [user?.id]);

  const isFavorite = useCallback((barId: string) => {
    return favorites.some(fav => fav.bar_id === barId);
  }, [favorites]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    favorites,
    isLoading,
    error,
    loadFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearError
  };
}
