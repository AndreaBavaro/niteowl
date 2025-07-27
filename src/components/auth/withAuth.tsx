'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ComponentType } from 'react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAuthComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    console.log('[withAuth] isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

    useEffect(() => {
      console.log('[withAuth] useEffect triggered. isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
      if (!isLoading && !isAuthenticated) {
        console.log('[withAuth] Redirecting to /signup');
        router.replace('/signup');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      console.log('[withAuth] Rendering loading spinner.');
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      console.log('[withAuth] Not authenticated, returning null for redirect.');
      // Return null while redirecting
      return null;
    }

    console.log('[withAuth] Rendering wrapped component.');
    return <WrappedComponent {...props} />;
  };

  // Set a display name for easier debugging
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
}
