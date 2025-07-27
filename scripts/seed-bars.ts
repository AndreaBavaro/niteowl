import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import type { Bar, LineupTimeRange, CoverFrequency, CoverAmount, AgeGroup, MusicGenre, DayOfWeek } from '../src/lib/types';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Initialize Supabase client with service role key for seeding
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Environment check:');
console.log('- Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('- Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables for seeding');
  console.error('Make sure .env.local contains:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to parse lineup time ranges
function parseLineupTime(timeStr: string): { min: LineupTimeRange; max?: LineupTimeRange } {
  // Normalize the time string first
  const normalizedStr = timeStr.replace('30 + min', '30+ min');
  const times = normalizedStr.split(' or ').map(t => t.trim()) as LineupTimeRange[];
  return {
    min: times[0],
    max: times.length > 1 ? times[1] : undefined
  };
}

// Helper function to parse cover info
function parseCoverInfo(coverStr: string): { frequency: CoverFrequency; amount?: CoverAmount } {
  const parts = coverStr.split(' / ');
  let frequencyStr = parts[0].trim();
  
  // Handle multiple values - take the first one
  if (frequencyStr.includes(' or ')) {
    frequencyStr = frequencyStr.split(' or ')[0].trim();
  }
  
  const frequency = frequencyStr as CoverFrequency;
  
  let amount: CoverAmount | undefined;
  if (parts.length > 1) {
    let amountStr = parts[1].trim();
    // Handle multiple amounts - take the first one
    if (amountStr.includes(' or ')) {
      amountStr = amountStr.split(' or ')[0].trim();
    }
    amount = amountStr as CoverAmount;
  }
  
  return { frequency, amount };
}

// Helper function to parse age groups
function parseAgeGroup(ageStr: string): { min: AgeGroup; max?: AgeGroup } {
  const ages = ageStr.split(' or ').map(a => a.trim()) as AgeGroup[];
  return {
    min: ages[0],
    max: ages.length > 1 ? ages[1] : undefined
  };
}

// Helper function to parse music genres
function parseMusic(musicStr: string): MusicGenre[] {
  return musicStr.split(', ').map(m => m.trim()) as MusicGenre[];
}

// Helper function to parse days
function parseDays(daysStr: string): DayOfWeek[] {
  if (daysStr === '—' || !daysStr.trim()) return [];
  return daysStr.split(', ').map(d => d.trim()) as DayOfWeek[];
}

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Bar data from the provided table
const barData = [
  {
    name: "AMPM",
    typical_lineup: "30 + min or 15-30 min",
    longest_line_days: "Fri, Sat, Sun",
    cover: "Yes-always or Sometimes / $10-$20",
    typical_vibe: "Mostly dancing/ loud (100 %)",
    top_music: "House, EDM",
    age_group: "22-25 or 25-30",
    service_rating: 8.0
  },
  {
    name: "Baby Huey",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "Sometimes / Under $10",
    typical_vibe: "Mostly dancing/ loud (100 %)",
    top_music: "Hip-hop, Rap",
    age_group: "25-30",
    service_rating: 7.0
  },
  {
    name: "Bangarang",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Mostly dancing/ loud (100 %)",
    top_music: "Top 40, Pop",
    age_group: "22-25",
    service_rating: 5.0
  },
  {
    name: "Bar 222",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Mixed/Variety",
    age_group: "25-30",
    service_rating: 7.0
  },
  {
    name: "Barchef",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Mixed/Variety",
    age_group: "22-25",
    service_rating: 10.0
  },
  {
    name: "Belfast",
    typical_lineup: "15-30 min",
    longest_line_days: "Fri, Sat",
    cover: "Sometimes / $10-$20 or Over $20",
    typical_vibe: "Mix socialize/dance (100 %)",
    top_music: "Top 40, Pop",
    age_group: "22-25",
    service_rating: 7.3
  },
  {
    name: "Cherry's High Dive",
    typical_lineup: "15-30 min or 30 + min",
    longest_line_days: "Fri, Sat",
    cover: "No cover or Yes-always / Under $10",
    typical_vibe: "Drinks & talk (50 %) / Socialize & dance (50 %)",
    top_music: "Mixed/Variety",
    age_group: "22-25 or 25-30",
    service_rating: 8.0
  },
  {
    name: "Coda",
    typical_lineup: "15-30 min",
    longest_line_days: "Fri, Sat",
    cover: "Yes-always / Over $20",
    typical_vibe: "Mostly dancing/ loud (100 %)",
    top_music: "House, EDM",
    age_group: "25-30",
    service_rating: 10.0
  },
  {
    name: "Dog and Bear",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover or Sometimes / Under $10",
    typical_vibe: "Socialize & dance (100 %)",
    top_music: "Top 40, Pop",
    age_group: "25-30",
    service_rating: 8.5
  },
  {
    name: "Fifth Social Club",
    typical_lineup: "30 + min",
    longest_line_days: "Fri",
    cover: "Yes-always or Sometimes / $10-$20",
    typical_vibe: "Mostly dancing/ loud (100 %)",
    top_music: "Mixed/Variety",
    age_group: "18-21 or 22-25",
    service_rating: 7.0
  },
  {
    name: "Harriet's Rooftop",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Socialize & dance (100 %)",
    top_music: "Hip-hop, Rap",
    age_group: "25-30",
    service_rating: 8.5
  },
  {
    name: "Isabelle's",
    typical_lineup: "15-30 min",
    longest_line_days: "Fri, Sat, Thu",
    cover: "Sometimes or Yes-always / $10-$20",
    typical_vibe: "Socialize & dance (100 %)",
    top_music: "Hip-hop, Rap",
    age_group: "22-25",
    service_rating: 7.0
  },
  {
    name: "Local (Liberty Village)",
    typical_lineup: "15-30 min",
    longest_line_days: "Fri, Sat",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Top 40, Pop",
    age_group: "25-30",
    service_rating: 7.0
  },
  {
    name: "Mother",
    typical_lineup: "30 + min",
    longest_line_days: "Fri, Sat, Sun",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Mixed/Variety",
    age_group: "25-30",
    service_rating: 8.0
  },
  {
    name: "PJ O'Brien's",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "Sometimes / Under $10",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Live bands",
    age_group: "25-30",
    service_rating: 8.0
  },
  {
    name: "Parlour",
    typical_lineup: "15-30 min or 30 + min",
    longest_line_days: "Fri, Sat",
    cover: "Sometimes or No cover / $10-$20",
    typical_vibe: "Socialize & dance (100 %)",
    top_music: "Hip-hop, Rap",
    age_group: "22-25 or 25-30",
    service_rating: 7.2
  },
  {
    name: "Paris Texas",
    typical_lineup: "15-30 min or 30 + min",
    longest_line_days: "Fri, Sat, Thu",
    cover: "Sometimes or No cover / Under $10 or Over $20",
    typical_vibe: "Socialize & dance (100 %)",
    top_music: "Mixed/Variety",
    age_group: "22-25",
    service_rating: 7.1
  },
  {
    name: "Petty Cash",
    typical_lineup: "0-10 min or 15-30 min",
    longest_line_days: "Sat",
    cover: "Sometimes / $10-$20 or No cover",
    typical_vibe: "Drinks & talk (67 %)",
    top_music: "Top 40, Pop",
    age_group: "22-25",
    service_rating: 8.0
  },
  {
    name: "Ruby Soho",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Mixed/Variety",
    age_group: "22-25",
    service_rating: 7.0
  },
  {
    name: "Slice of Life",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "City-pop, Jazz",
    age_group: "25-30",
    service_rating: 10.0
  },
  {
    name: "Soluna",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Socialize & dance (100 %)",
    top_music: "House, EDM",
    age_group: "22-25",
    service_rating: 8.0
  },
  {
    name: "The Only",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Live bands",
    age_group: "25-30",
    service_rating: 7.0
  },
  {
    name: "The Warehouse",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Mixed/Variety",
    age_group: "22-25",
    service_rating: 7.0
  },
  {
    name: "Track & Field",
    typical_lineup: "30 + min",
    longest_line_days: "Fri, Sat",
    cover: "Yes-always / $10-$20",
    typical_vibe: "Socialize & dance (100 %)",
    top_music: "Hip-hop, Rap",
    age_group: "22-25",
    service_rating: 5.0
  },
  {
    name: "Two Cats",
    typical_lineup: "30 + min",
    longest_line_days: "Thu, Fri, Sat",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Mixed/Variety",
    age_group: "22-25",
    service_rating: 7.0
  },
  {
    name: "Wheatsheaf",
    typical_lineup: "15-30 min or 30 + min",
    longest_line_days: "Fri, Sat, Thu",
    cover: "Yes-always or Sometimes / $10-$20 or Under $10",
    typical_vibe: "Socialize & dance (78 %)",
    top_music: "Live bands, Top 40",
    age_group: "22-25",
    service_rating: 7.0
  },
  {
    name: "Writer's Room Bar",
    typical_lineup: "0-10 min",
    longest_line_days: "—",
    cover: "No cover",
    typical_vibe: "Drinks & talk (100 %)",
    top_music: "Live bands",
    age_group: "22-25",
    service_rating: 8.0
  }
];

async function seedBars() {
  console.log('🌱 Starting bar seeding process...');

  try {
    // Transform the data
    const barsToInsert = barData.map(bar => {
      const lineupTime = parseLineupTime(bar.typical_lineup);
      const coverInfo = parseCoverInfo(bar.cover);
      const ageGroup = parseAgeGroup(bar.age_group);
      const musicGenres = parseMusic(bar.top_music);
      const longLineDays = parseDays(bar.longest_line_days);

      return {
        name: bar.name,
        slug: createSlug(bar.name),
        canonical_name: bar.name,
        neighbourhood: null, // Will be added later with real data
        address: null, // Will be added later with real data
        description: `${bar.typical_vibe} Known for ${bar.top_music.toLowerCase()} music.`,
        latitude: null,
        longitude: null,
        typical_lineup_min: lineupTime.min,
        typical_lineup_max: lineupTime.max,
        longest_line_days: longLineDays,
        cover_frequency: coverInfo.frequency,
        cover_amount: coverInfo.amount,
        typical_vibe: bar.typical_vibe,
        top_music: musicGenres,
        age_group_min: ageGroup.min,
        age_group_max: ageGroup.max,
        service_rating: bar.service_rating
      };
    });

    // Insert bars into database
    const { data, error } = await supabase
      .from('bars')
      .insert(barsToInsert)
      .select();

    if (error) {
      console.error('❌ Error inserting bars:', error);
      return;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} bars`);
    console.log('📊 Sample bars inserted:');
    data?.slice(0, 3).forEach(bar => {
      console.log(`  - ${bar.name} (${bar.slug})`);
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Run the seeding
if (require.main === module) {
  seedBars()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedBars };
