'use client';

import { createBrowserClient } from '@supabase/ssr';

// Define the type for the Supabase client
export type TypedSupabaseClient = ReturnType<typeof createBrowserClient>;

let client: TypedSupabaseClient | undefined;

function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}

export default getSupabaseBrowserClient;
