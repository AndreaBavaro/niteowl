import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Bar, Submission, UserPreferences, User, SearchFilters } from './types';

// Helper function to check if supabase is available
const isSupabaseAvailable = () => {
  if (!supabase) {
    console.warn('Supabase client not available. Please check your environment variables.');
    return false;
  }
  return true;
};

// Auth hook
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseAvailable()) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase!.auth.getSession();
      setUser(session?.user as User || null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user as User || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};

// Bars hook
export const useBars = () => {
  const [data, setData] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBars = async () => {
      if (!isSupabaseAvailable()) {
        setError('Database not available');
        setLoading(false);
        return;
      }
      
      try {
        const { data: bars, error } = await supabase!
          .from('bars')
          .select('*')
          .order('name');

        if (error) throw error;
        setData(bars || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBars();
  }, []);

  return { data, loading, error };
};

// Bar details hook
export const useBar = (slug: string) => {
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBar = async () => {
      if (!slug) return;
      
      if (!isSupabaseAvailable()) {
        setError('Database not available');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase!
          .from('bars')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setBar(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bar not found');
      } finally {
        setLoading(false);
      }
    };

    fetchBar();
  }, [slug]);

  return { bar, loading, error };
};

// Search bars hook
export const useSearchBars = (query: string, filters?: SearchFilters) => {
  const [results, setResults] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchBars = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      if (!isSupabaseAvailable()) {
        setError('Database not available');
        setLoading(false);
        return;
      }

      try {
        let supabaseQuery = supabase!
          .from('bars')
          .select('*')
          .or(`name.ilike.%${query}%, neighbourhood.ilike.%${query}%`);

        // Apply filters if provided
        if (filters?.neighbourhoods && filters.neighbourhoods.length > 0) {
          supabaseQuery = supabaseQuery.in('neighbourhood', filters.neighbourhoods);
        }

        const { data, error } = await supabaseQuery;

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchBars, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, filters]);

  return { results, loading, error };
};

// Recommendations hook
export const useRecommendations = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // For now, return popular bars as recommendations
        // In the future, this would use a recommendation algorithm
        const { data: bars, error } = await supabase
          .from('bars')
          .select('*')
          .limit(10);

        if (error) throw error;
        setData(bars || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  return { data, loading, error };
};

// Bar submissions hook
export const useBarSubmissions = (barId?: string) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isSupabaseAvailable()) {
        setError('Database not available');
        setLoading(false);
        return;
      }
      
      try {
        let query = supabase!
          .from('bar_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (barId) {
          query = query.eq('bar_id', barId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setSubmissions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [barId]);

  return { submissions, loading, error };
};
