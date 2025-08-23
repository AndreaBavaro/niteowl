import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RecommendationScore {
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
    karaoke_nights?: string[];
    live_music_days?: string[];
    has_food: boolean;
    capacity_size?: string;
    has_pool_table: boolean;
    has_arcade_games: boolean;
  };
  totalScore: number;
  reasoning: string[];
}

export function useRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async (limit: number = 10) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/personalized-recommendations?limit=${limit}`, {
        headers: {
          'x-user-id': user.id
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load recommendations');
      }
      
      setRecommendations(data.recommendations || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading recommendations');
      console.error('Error loading recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refreshRecommendations = useCallback(async (limit: number = 10) => {
    return loadRecommendations(limit);
  }, [loadRecommendations]);

  const getRecommendationForBar = useCallback((barId: string) => {
    return recommendations.find(rec => rec.bar.id === barId);
  }, [recommendations]);

  const getTopRecommendations = useCallback((count: number = 5) => {
    return recommendations.slice(0, count);
  }, [recommendations]);

  const getRecommendationsByNeighborhood = useCallback((neighborhood: string) => {
    return recommendations.filter(rec => 
      rec.bar.neighbourhood.toLowerCase() === neighborhood.toLowerCase()
    );
  }, [recommendations]);

  const getRecommendationsByMusicGenre = useCallback((musicGenre: string) => {
    return recommendations.filter(rec => 
      rec.bar.top_music?.some(genre => 
        genre.toLowerCase().includes(musicGenre.toLowerCase())
      )
    );
  }, [recommendations]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    recommendations,
    isLoading,
    error,
    loadRecommendations,
    refreshRecommendations,
    getRecommendationForBar,
    getTopRecommendations,
    getRecommendationsByNeighborhood,
    getRecommendationsByMusicGenre,
    clearError
  };
}
