'use client';

import { createBrowserClient } from '@supabase/ssr';
import { mockAuth } from '../mock/mockAuth';

// Define the type for the Supabase client
export type TypedSupabaseClient = ReturnType<typeof createBrowserClient>;

let client: TypedSupabaseClient | undefined;
let mockClient: TypedSupabaseClient | undefined;

function getSupabaseBrowserClient() {
  // If mock data is enabled, return a mock client.
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    if (mockClient) {
      return mockClient;
    }
    console.log('Using MOCK Supabase client');
    // Cast the mockAuth object to the required type.
    mockClient = mockAuth as any as TypedSupabaseClient;
    return mockClient;
  }

  // Otherwise, return the real client.
  if (client) {
    return client;
  }

  console.log('Using REAL Supabase client');
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}

export default getSupabaseBrowserClient;
