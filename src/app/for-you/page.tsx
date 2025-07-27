'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ForYouPageClient from '@/components/ForYouPageClient';
import { Bar } from '@/lib/types';

export default function ForYouPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<{
    perfectForTonight: Bar[];
    yourVibe: Bar[];
    quickEntry: Bar[];
    trendingInArea: Bar[];
  }>({ perfectForTonight: [], yourVibe: [], quickEntry: [], trendingInArea: [] });
  const [barsLoading, setBarsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signup');
    }
  }, [isAuthenticated, isLoading, router]);

  // Check access status
  useEffect(() => {
    if (user && user.access_status !== 'approved') {
      router.push('/waiting');
    }
  }, [user, router]);

  // Fetch recommendations from server-side API
  useEffect(() => {
    if (user && user.access_status === 'approved') {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    if (!user?.id) return;
    
    try {
      setBarsLoading(true);
      const response = await fetch(`/api/recommendations?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || {
          perfectForTonight: [],
          yourVibe: [],
          quickEntry: [],
          trendingInArea: []
        });
      } else {
        console.error('Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setBarsLoading(false);
    }
  };

  // Show loading state
  if (isLoading || barsLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your personalized experience...</div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <ForYouPageClient user={user} recommendations={recommendations} />;
}
