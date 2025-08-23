// Mock data for user bar experience features
import { UserFavorite, UserVisit, RecommendationScore } from './types';

export const mockUserFavorites: UserFavorite[] = [
  {
    id: 'fav-1',
    user_id: 'mock-user-id-12345',
    bar_id: 'bar-1',
    created_at: '2024-01-15T20:30:00Z',
    bar: {
      id: 'bar-1',
      name: 'Rebel Nightclub',
      slug: 'rebel-nightclub',
      neighbourhood: 'Entertainment District',
      address: '69 Polson St, Toronto, ON',
      description: 'Toronto\'s largest nightclub with world-class DJs and an incredible sound system.',
      typical_vibe: 'High-energy dance club',
      top_music: ['House', 'EDM'],
      has_rooftop: false,
      has_patio: true,
      has_dancefloor: true
    }
  },
  {
    id: 'fav-2',
    user_id: 'mock-user-id-12345',
    bar_id: 'bar-2',
    created_at: '2024-01-10T19:45:00Z',
    bar: {
      id: 'bar-2',
      name: 'TOYBOX',
      slug: 'toybox',
      neighbourhood: 'King West',
      address: '473 Adelaide St W, Toronto, ON',
      description: 'Upscale nightclub with VIP bottle service and celebrity sightings.',
      typical_vibe: 'Upscale and exclusive',
      top_music: ['Hip-hop', 'Top 40'],
      has_rooftop: false,
      has_patio: false,
      has_dancefloor: true
    }
  },
  {
    id: 'fav-3',
    user_id: 'mock-user-id-12345',
    bar_id: 'bar-3',
    created_at: '2024-01-05T21:15:00Z',
    bar: {
      id: 'bar-3',
      name: 'Coda',
      slug: 'coda',
      neighbourhood: 'Entertainment District',
      address: '794 Bathurst St, Toronto, ON',
      description: 'Underground techno club with intimate atmosphere and cutting-edge sound.',
      typical_vibe: 'Underground and intimate',
      top_music: ['House', 'EDM'],
      has_rooftop: false,
      has_patio: false,
      has_dancefloor: true
    }
  }
];

export const mockUserVisits: UserVisit[] = [
  {
    id: 'visit-1',
    user_id: 'mock-user-id-12345',
    bar_id: 'bar-1',
    visit_date: '2024-01-20',
    experience_rating: 9,
    comment: 'Amazing night! The DJ was incredible and the crowd was so energetic. Definitely coming back.',
    reported_wait_time: '15-30 min',
    reported_cover_charge: '$10-$20',
    reported_music_genres: ['House', 'EDM'],
    reported_vibe: 'High-energy dance floor with great vibes',
    reported_age_group: '22-25',
    reported_service_rating: 8,
    time_of_visit: 'peak_night',
    group_size: 'small_group',
    special_event: 'Guest DJ from Berlin',
    created_at: '2024-01-21T02:30:00Z',
    bar: {
      id: 'bar-1',
      name: 'Rebel Nightclub',
      slug: 'rebel-nightclub',
      neighbourhood: 'Entertainment District',
      address: '69 Polson St, Toronto, ON'
    }
  },
  {
    id: 'visit-2',
    user_id: 'mock-user-id-12345',
    bar_id: 'bar-2',
    visit_date: '2024-01-15',
    experience_rating: 7,
    comment: 'Good vibes but quite expensive. The bottle service area was nice though.',
    reported_wait_time: '30+ min',
    reported_cover_charge: 'Over $20',
    reported_music_genres: ['Hip-hop', 'Top 40'],
    reported_vibe: 'Upscale crowd, good for networking',
    reported_age_group: '25-30',
    reported_service_rating: 9,
    time_of_visit: 'peak_night',
    group_size: 'couple',
    special_event: '',
    created_at: '2024-01-16T01:45:00Z',
    bar: {
      id: 'bar-2',
      name: 'TOYBOX',
      slug: 'toybox',
      neighbourhood: 'King West',
      address: '473 Adelaide St W, Toronto, ON'
    }
  },
  {
    id: 'visit-3',
    user_id: 'mock-user-id-12345',
    bar_id: 'bar-4',
    visit_date: '2024-01-12',
    experience_rating: 8,
    comment: 'Great rooftop atmosphere! Perfect for a date night.',
    reported_wait_time: '0-10 min',
    reported_cover_charge: 'Under $10',
    reported_music_genres: ['Jazz', 'Mixed/Variety'],
    reported_vibe: 'Romantic and relaxed',
    reported_age_group: '25-30',
    reported_service_rating: 9,
    time_of_visit: 'early_evening',
    group_size: 'couple',
    special_event: 'Live Jazz Night',
    created_at: '2024-01-13T00:30:00Z',
    bar: {
      id: 'bar-4',
      name: 'The Rooftop',
      slug: 'the-rooftop',
      neighbourhood: 'King West',
      address: '318 Wellington St W, Toronto, ON'
    }
  },
  {
    id: 'visit-4',
    user_id: 'mock-user-id-12345',
    bar_id: 'bar-5',
    visit_date: '2024-01-08',
    experience_rating: 6,
    comment: 'Decent spot but got too crowded later in the night.',
    reported_wait_time: '15-30 min',
    reported_cover_charge: '$10-$20',
    reported_music_genres: ['Top 40', 'Pop'],
    reported_vibe: 'Crowded but fun',
    reported_age_group: '18-21',
    reported_service_rating: 6,
    time_of_visit: 'late_night',
    group_size: 'large_group',
    special_event: 'Birthday Party',
    created_at: '2024-01-09T03:15:00Z',
    bar: {
      id: 'bar-5',
      name: 'The Hoxton',
      slug: 'the-hoxton',
      neighbourhood: 'Queen West',
      address: '303 Queen St W, Toronto, ON'
    }
  }
];

export const mockRecommendations: RecommendationScore[] = [
  {
    bar: {
      id: 'bar-6',
      name: 'Rebel House',
      slug: 'rebel-house',
      neighbourhood: 'Entertainment District',
      address: '69 Polson St, Toronto, ON',
      description: 'Sister venue to Rebel with a more intimate house music focus.',
      typical_vibe: 'Underground house vibes',
      top_music: ['House', 'EDM'],
      has_rooftop: false,
      has_patio: false,
      has_dancefloor: true,
      karaoke_nights: [],
      live_music_days: ['Fri', 'Sat'],
      has_food: false,
      capacity_size: 'medium',
      has_pool_table: false,
      has_arcade_games: false
    },
    totalScore: 8.7,
    reasoning: [
      'Matches your favorite music genres (House, EDM)',
      'Located in Entertainment District (your preferred area)',
      'Similar vibe to your highly-rated visits',
      'Popular with your age group (22-25)'
    ]
  },
  {
    bar: {
      id: 'bar-7',
      name: 'Vertigo',
      slug: 'vertigo',
      neighbourhood: 'King West',
      address: '372 Bay St, Toronto, ON',
      description: 'Rooftop bar with stunning city views and craft cocktails.',
      typical_vibe: 'Sophisticated rooftop experience',
      top_music: ['Jazz', 'Mixed/Variety'],
      has_rooftop: true,
      has_patio: true,
      has_dancefloor: false,
      karaoke_nights: [],
      live_music_days: ['Thu', 'Fri'],
      has_food: true,
      capacity_size: 'medium',
      has_pool_table: false,
      has_arcade_games: false
    },
    totalScore: 8.3,
    reasoning: [
      'Great for couples (matches your visit patterns)',
      'Located in King West (your second favorite neighborhood)',
      'High service ratings from community',
      'Perfect for early evening visits'
    ]
  },
  {
    bar: {
      id: 'bar-8',
      name: 'The Ballroom',
      slug: 'the-ballroom',
      neighbourhood: 'Queen West',
      address: '145 John St, Toronto, ON',
      description: 'Multi-level venue with different music on each floor.',
      typical_vibe: 'Diverse crowd and music',
      top_music: ['Hip-hop', 'House', 'Top 40'],
      has_rooftop: false,
      has_patio: false,
      has_dancefloor: true,
      karaoke_nights: ['Wed'],
      live_music_days: ['Sat'],
      has_food: true,
      capacity_size: 'large',
      has_pool_table: false,
      has_arcade_games: true
    },
    totalScore: 7.9,
    reasoning: [
      'Variety of music genres you enjoy',
      'Good for both small and large groups',
      'Located in Queen West area',
      'High community ratings for service'
    ]
  },
  {
    bar: {
      id: 'bar-9',
      name: 'Lost & Found',
      slug: 'lost-and-found',
      neighbourhood: 'Kensington Market',
      address: '577 King St W, Toronto, ON',
      description: 'Eclectic bar with vintage decor and live music.',
      typical_vibe: 'Artsy and alternative',
      top_music: ['Live bands', 'Mixed/Variety'],
      has_rooftop: false,
      has_patio: true,
      has_dancefloor: false,
      karaoke_nights: ['Tue', 'Thu'],
      live_music_days: ['Fri', 'Sat', 'Sun'],
      has_food: true,
      capacity_size: 'small',
      has_pool_table: true,
      has_arcade_games: false
    },
    totalScore: 7.5,
    reasoning: [
      'Exploration bonus - new neighborhood for you',
      'Live music matches your interests',
      'Great for intimate group experiences',
      'Unique atmosphere different from your usual spots'
    ]
  },
  {
    bar: {
      id: 'bar-10',
      name: 'Lavelle',
      slug: 'lavelle',
      neighbourhood: 'Entertainment District',
      address: '627 King St W, Toronto, ON',
      description: 'Upscale rooftop pool club with panoramic city views.',
      typical_vibe: 'Luxury poolside experience',
      top_music: ['House', 'Top 40'],
      has_rooftop: true,
      has_patio: true,
      has_dancefloor: true,
      karaoke_nights: [],
      live_music_days: [],
      has_food: true,
      capacity_size: 'large',
      has_pool_table: false,
      has_arcade_games: false
    },
    totalScore: 7.2,
    reasoning: [
      'Premium experience in your favorite area',
      'House music matches your preferences',
      'Great for special occasions',
      'Rooftop setting you seem to enjoy'
    ]
  }
];

// Helper functions for mock data management
export const getMockUserFavorites = (userId: string) => {
  // Try to get from localStorage first, fallback to default mock data
  try {
    const stored = localStorage.getItem('mock_user_favorites');
    if (stored) {
      const allFavorites: UserFavorite[] = JSON.parse(stored);
      return allFavorites.filter((fav: UserFavorite) => fav.user_id === userId);
    }
  } catch (error) {
    console.warn('Error reading mock favorites from localStorage:', error);
  }
  
  // Fallback to default mock data
  return mockUserFavorites.filter(fav => fav.user_id === userId);
};

export const getMockUserVisits = (userId: string) => {
  return mockUserVisits.filter(visit => visit.user_id === userId);
};

export const getMockRecommendations = (userId: string, limit: number = 10) => {
  return mockRecommendations.slice(0, limit);
};

// Mock data persistence helpers
export const saveMockFavorite = (favorite: UserFavorite) => {
  const favorites = getMockUserFavorites(favorite.user_id);
  favorites.push(favorite);
  // In a real implementation, this would save to localStorage
  localStorage.setItem('mock_user_favorites', JSON.stringify(favorites));
};

export const removeMockFavorite = (userId: string, barId: string) => {
  try {
    // Get all favorites from localStorage
    const stored = localStorage.getItem('mock_user_favorites');
    let allFavorites: UserFavorite[] = [];
    
    if (stored) {
      allFavorites = JSON.parse(stored);
    } else {
      // Initialize with default mock data if nothing in localStorage
      allFavorites = [...mockUserFavorites];
    }
    
    // Remove the specific favorite
    const updated = allFavorites.filter(fav => !(fav.user_id === userId && fav.bar_id === barId));
    localStorage.setItem('mock_user_favorites', JSON.stringify(updated));
  } catch (error) {
    console.error('Error removing mock favorite:', error);
    throw error;
  }
};

export const saveMockVisit = (visit: UserVisit) => {
  const visits = getMockUserVisits(visit.user_id);
  visits.unshift(visit); // Add to beginning
  localStorage.setItem('mock_user_visits', JSON.stringify(visits));
};

export const updateMockVisit = (visitId: string, updatedVisit: UserVisit) => {
  const visits = getMockUserVisits(updatedVisit.user_id);
  const index = visits.findIndex(v => v.id === visitId);
  if (index !== -1) {
    visits[index] = updatedVisit;
    localStorage.setItem('mock_user_visits', JSON.stringify(visits));
  }
};

export const removeMockVisit = (userId: string, visitId: string) => {
  const visits = getMockUserVisits(userId);
  const updated = visits.filter(visit => visit.id !== visitId);
  localStorage.setItem('mock_user_visits', JSON.stringify(updated));
};
