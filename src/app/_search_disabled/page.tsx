import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Bar } from '@/lib/types';
import SearchPageClient from '@/components/SearchPageClient';

// Server component to fetch bars data
async function getBars(): Promise<Bar[]> {
  // Handle mock mode
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    // Return mock bars data
    return [
      {
        id: 'bar-1',
        name: 'Rebel Nightclub',
        slug: 'rebel-nightclub',
        neighbourhood: 'Entertainment District',
        address: '69 Polson St, Toronto, ON',
        description: 'Toronto\'s largest nightclub with world-class DJs.',
        typical_lineup_min: '30+ min',
        typical_lineup_max: undefined,
        cover_frequency: 'Yes-always',
        cover_amount: '$20-30',
        typical_vibe: 'High-energy dance club',
        top_music: ['House', 'EDM'],
        age_group_min: '18-21',
        age_group_max: '25-30',
        service_rating: 4.2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'bar-2',
        name: 'TOYBOX',
        slug: 'toybox',
        neighbourhood: 'King West',
        address: '473 Adelaide St W, Toronto, ON',
        description: 'Upscale nightclub with VIP bottle service.',
        typical_lineup_min: '15-30 min',
        typical_lineup_max: '30+ min',
        cover_frequency: 'Sometimes',
        cover_amount: '$15-25',
        typical_vibe: 'Upscale and exclusive',
        top_music: ['Hip-hop', 'Top 40'],
        age_group_min: '22-25',
        age_group_max: '25-30',
        service_rating: 4.5,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'bar-3',
        name: 'The Hoxton',
        slug: 'the-hoxton',
        neighbourhood: 'King West',
        address: '69 Bathurst St, Toronto, ON',
        description: 'Trendy rooftop bar with city views.',
        typical_lineup_min: '15-30 min',
        typical_lineup_max: null,
        cover_frequency: 'No cover',
        cover_amount: null,
        typical_vibe: 'Trendy and social',
        top_music: ['Indie', 'Alternative'],
        age_group_min: '25-30',
        age_group_max: '30+',
        service_rating: 4.1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase
      .from('bars')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching bars:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBars:', error);
    return [];
  }
}

async function SearchPage() {
  const bars = await getBars();

  return <SearchPageClient bars={bars} />;
}

export default SearchPage;
