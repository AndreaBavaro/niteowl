import { User } from '@supabase/supabase-js';
import { mockUser } from './mockUser';

const MOCK_SESSION_KEY = 'mock_supabase_session';

// Mock auth methods that match the Supabase auth interface
const mockAuthMethods = {
  getSession: async () => {
    if (typeof window === 'undefined') return { data: { session: null }, error: null };
    const sessionStr = localStorage.getItem(MOCK_SESSION_KEY);
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      return { data: { session }, error: null };
    }
    return { data: { session: null }, error: null };
  },

  signInWithOtp: async (options: { email?: string; phone?: string }) => {
    if (typeof window === 'undefined') return { data: { user: null, session: null }, error: { message: 'Cannot sign in on server' } };
    console.log(`Mock sign-in attempt with:`, options);
    const session = {
      provider_token: null,
      access_token: 'mock-access-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'mock-refresh-token',
      token_type: 'bearer',
      user: mockUser,
    };

    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('storage')); // Notify of session change

    return { data: { user: mockUser, session }, error: null };
  },

  signOut: async () => {
    if (typeof window === 'undefined') return { error: { message: 'Cannot sign out on server' } };
    localStorage.removeItem(MOCK_SESSION_KEY);
    window.dispatchEvent(new Event('storage')); // Notify of session change
    console.log('Mock user signed out');
    return { error: null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const listener = () => {
      const sessionStr = localStorage.getItem(MOCK_SESSION_KEY);
      const session = sessionStr ? JSON.parse(sessionStr) : null;
      const event = session ? 'SIGNED_IN' : 'SIGNED_OUT';
      callback(event, session);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', listener);
      // Initial call
      listener();
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            if (typeof window !== 'undefined') {
              window.removeEventListener('storage', listener);
              console.log('Unsubscribed from mock auth state change');
            }
          },
        },
      },
    };
  },
};

// This object mimics the Supabase client structure with an 'auth' property
export const mockAuth = {
  auth: mockAuthMethods,
  // Add other Supabase client methods as needed
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
    }),
  }),
};
