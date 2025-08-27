import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User } from '@/lib/types';
import { getMockUser } from '@/lib/mockData';
import ProfilePageClient from '@/components/ProfilePageClient';

// Server component to get user data
async function getUserProfile() {
  // Handle mock mode
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    const getMockUserProfile = () => {
      const baseProfile = {
        id: 'mock-user-id-12345',
        email: 'mock.user@example.com',
        phone: '+11234567890',
        full_name: 'Mock User',
        avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=mock-user`,
        first_neighbourhood: 'King West',
        second_neighbourhood: 'Entertainment District',
        third_neighbourhood: 'Queen West',
        preferred_music: ['House', 'Rap'],
        age: 25,
        access_status: 'approved',
        loyalty_points: 100,
        last_active_at: new Date().toISOString(),
        created_at: new Date('2023-01-01T00:00:00Z').toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Load any saved preferences from localStorage (handled client-side)
      return baseProfile;
    };
    
    return getMockUserProfile();
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

    // Get current user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      console.error('Auth error:', authError);
      return null;
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profileError || !userProfile) {
      console.error('Profile error:', profileError);
      return null;
    }

    return userProfile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

export default async function ProfilePage() {
  const user = await getUserProfile();

  // User will be redirected by middleware if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading your profile...</div>
        </div>
      </div>
    );
  }

  return <ProfilePageClient user={user} />;
}
