import { createClient } from '@supabase/supabase-js';

/**
 * @deprecated Use getSupabaseBrowserClient instead.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);