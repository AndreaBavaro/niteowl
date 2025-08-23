import { 
  MapPin, 
  Music, 
  Users, 
  DollarSign, 
  Star,
  TreePine,
  Building2,
  Disc3,
  UtensilsCrossed,
  Circle,
  Gamepad2,
  FileText
} from 'lucide-react';
import { 
  CreateBarSubmissionInput, 
  MusicGenre,
  DayOfWeek,
  LineupTimeRange,
  CoverFrequency,
  CoverAmount,
  AgeGroup,
  CapacitySize
} from '@/lib/types';

interface StepProps {
  formData: Partial<CreateBarSubmissionInput>;
  errors: { [key: string]: string };
  handleInputChange: (field: keyof CreateBarSubmissionInput, value: any) => void;
  handleArrayToggle: (field: keyof CreateBarSubmissionInput, value: string) => void;
}

const TORONTO_NEIGHBORHOODS = [
  'King West', 'Queen West', 'Entertainment District', 'Financial District',
  'Distillery District', 'Kensington Market', 'Ossington', 'Dundas West',
  'Junction', 'Leslieville', 'Riverdale', 'Corktown', 'Liberty Village',
  'CityPlace', 'Harbourfront', 'St. Lawrence Market', 'Church-Wellesley',
  'Yorkville', 'Annex', 'Little Italy', 'Little Portugal', 'Chinatown',
  'Parkdale', 'Roncesvalles', 'High Park', 'Bloor West', 'Danforth',
  'Beaches', 'Other'
];

const musicGenres: MusicGenre[] = ['House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'];
const daysOfWeek: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const lineupTimes: LineupTimeRange[] = ['0-10 min', '15-30 min', '30+ min'];
const coverFrequencies: CoverFrequency[] = ['No cover', 'Sometimes', 'Yes-always'];
const coverAmounts: CoverAmount[] = ['Under $10', '$10-$20', 'Over $20'];
const ageGroups: AgeGroup[] = ['18-21', '22-25', '25-30'];
const capacitySizes: CapacitySize[] = ['Intimate (<50)', 'Medium (50-150)', 'Large (150-300)', 'Very Large (300+)'];

export const Step1BasicInfo = ({ formData, errors, handleInputChange }: StepProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <MapPin className="w-12 h-12 text-green-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Basic Information</h3>
      <p className="text-zinc-400">Let's start with the basics about this bar</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Bar Name *
      </label>
      <input
        type="text"
        value={formData.name || ''}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Enter the bar name"
        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Neighbourhood *
      </label>
      <select
        value={formData.neighbourhood || ''}
        onChange={(e) => handleInputChange('neighbourhood', e.target.value)}
        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="">Select neighbourhood</option>
        {TORONTO_NEIGHBORHOODS.map(neighborhood => (
          <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
        ))}
      </select>
      {errors.neighbourhood && <p className="text-red-400 text-sm mt-1">{errors.neighbourhood}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Address *
      </label>
      <input
        type="text"
        value={formData.address || ''}
        onChange={(e) => handleInputChange('address', e.target.value)}
        placeholder="Enter the full address"
        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
    </div>
  </div>
);

export const Step2Description = ({ formData, errors, handleInputChange }: StepProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <FileText className="w-12 h-12 text-purple-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Description & Vibe</h3>
      <p className="text-zinc-400">Tell us about the atmosphere and capacity</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Description *
      </label>
      <textarea
        value={formData.description || ''}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="Describe the bar's atmosphere, style, and what makes it unique..."
        rows={4}
        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
      />
      {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Typical Vibe *
      </label>
      <input
        type="text"
        value={formData.typical_vibe || ''}
        onChange={(e) => handleInputChange('typical_vibe', e.target.value)}
        placeholder="e.g., Upscale cocktail lounge, Casual sports bar, High-energy dance club"
        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      {errors.typical_vibe && <p className="text-red-400 text-sm mt-1">{errors.typical_vibe}</p>}
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Capacity Size
      </label>
      <select
        value={formData.capacity_size || ''}
        onChange={(e) => handleInputChange('capacity_size', e.target.value)}
        className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        <option value="">Select capacity (optional)</option>
        {capacitySizes.map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
    </div>
  </div>
);

export const Step3Music = ({ formData, errors, handleArrayToggle }: StepProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <Music className="w-12 h-12 text-blue-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Music Preferences</h3>
      <p className="text-zinc-400">What type of music does this bar typically play?</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-4">
        Top Music Genres * (Select all that apply)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {musicGenres.map(genre => (
          <button
            key={genre}
            type="button"
            onClick={() => handleArrayToggle('top_music', genre)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              (formData.top_music || []).includes(genre)
                ? 'bg-blue-500 text-white border-2 border-blue-400'
                : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 border-2 border-transparent'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      {errors.top_music && <p className="text-red-400 text-sm mt-2">{errors.top_music}</p>}
      <p className="text-sm text-zinc-500 mt-2">
        Selected: {(formData.top_music || []).length} genre{(formData.top_music || []).length !== 1 ? 's' : ''}
      </p>
    </div>
  </div>
);

export const Step4CrowdTiming = ({ formData, errors, handleInputChange, handleArrayToggle }: StepProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Crowd & Timing</h3>
      <p className="text-zinc-400">Tell us about the typical crowd and wait times</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Minimum Age Group *
        </label>
        <select
          value={formData.age_group_min || ''}
          onChange={(e) => handleInputChange('age_group_min', e.target.value)}
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        >
          <option value="">Select minimum age group</option>
          {ageGroups.map(age => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
        {errors.age_group_min && <p className="text-red-400 text-sm mt-1">{errors.age_group_min}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Maximum Age Group
        </label>
        <select
          value={formData.age_group_max || ''}
          onChange={(e) => handleInputChange('age_group_max', e.target.value)}
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        >
          <option value="">Select maximum age group (optional)</option>
          {ageGroups.map(age => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Typical Lineup Time *
        </label>
        <select
          value={formData.typical_lineup_min || ''}
          onChange={(e) => handleInputChange('typical_lineup_min', e.target.value)}
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        >
          {lineupTimes.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        {errors.typical_lineup_min && <p className="text-red-400 text-sm mt-1">{errors.typical_lineup_min}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Maximum Lineup Time
        </label>
        <select
          value={formData.typical_lineup_max || ''}
          onChange={(e) => handleInputChange('typical_lineup_max', e.target.value)}
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        >
          <option value="">Select max lineup time (optional)</option>
          {lineupTimes.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Longest Line Days
      </label>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {daysOfWeek.map(day => (
          <label key={day} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(formData.longest_line_days || []).includes(day)}
              onChange={() => handleArrayToggle('longest_line_days', day)}
              className="rounded border-zinc-600 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="text-zinc-300 text-sm">{day}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export const Step5PricingEvents = ({ formData, errors, handleInputChange, handleArrayToggle }: StepProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Pricing & Events</h3>
      <p className="text-zinc-400">Cover charges and special events</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Cover Frequency *
        </label>
        <select
          value={formData.cover_frequency || ''}
          onChange={(e) => handleInputChange('cover_frequency', e.target.value)}
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {coverFrequencies.map(freq => (
            <option key={freq} value={freq}>{freq}</option>
          ))}
        </select>
        {errors.cover_frequency && <p className="text-red-400 text-sm mt-1">{errors.cover_frequency}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Cover Amount
        </label>
        <select
          value={formData.cover_amount || ''}
          onChange={(e) => handleInputChange('cover_amount', e.target.value)}
          className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select cover amount (optional)</option>
          {coverAmounts.map(amount => (
            <option key={amount} value={amount}>{amount}</option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Live Music Days
      </label>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {daysOfWeek.map(day => (
          <label key={day} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(formData.live_music_days || []).includes(day)}
              onChange={() => handleArrayToggle('live_music_days', day)}
              className="rounded border-zinc-600 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-zinc-300 text-sm">{day}</span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-2">
        Karaoke Nights
      </label>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
        {daysOfWeek.map(day => (
          <label key={day} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(formData.karaoke_nights || []).includes(day)}
              onChange={() => handleArrayToggle('karaoke_nights', day)}
              className="rounded border-zinc-600 text-pink-500 focus:ring-pink-500"
            />
            <span className="text-zinc-300 text-sm">{day}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

export const Step6FeaturesReview = ({ formData, handleInputChange }: StepProps) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">Features & Review</h3>
      <p className="text-zinc-400">Final details and review your submission</p>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-white mb-4">Features & Amenities</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: 'has_patio', label: 'Patio', icon: TreePine, color: 'text-green-400' },
          { key: 'has_rooftop', label: 'Rooftop', icon: Building2, color: 'text-blue-400' },
          { key: 'has_dancefloor', label: 'Dancefloor', icon: Disc3, color: 'text-purple-400' },
          { key: 'has_food', label: 'Food Service', icon: UtensilsCrossed, color: 'text-yellow-400' },
          { key: 'has_pool_table', label: 'Pool Table', icon: Circle, color: 'text-cyan-400' },
          { key: 'has_arcade_games', label: 'Arcade Games', icon: Gamepad2, color: 'text-red-400' }
        ].map(feature => {
          const IconComponent = feature.icon;
          return (
            <label key={feature.key} className="flex items-center space-x-3 cursor-pointer p-3 bg-zinc-700/50 rounded-lg hover:bg-zinc-700 transition-colors">
              <input
                type="checkbox"
                checked={!!(formData as any)[feature.key]}
                onChange={(e) => handleInputChange(feature.key as keyof CreateBarSubmissionInput, e.target.checked)}
                className="rounded border-zinc-600 text-purple-500 focus:ring-purple-500"
              />
              <IconComponent className={`w-4 h-4 ${feature.color}`} />
              <span className="text-zinc-300 text-sm">{feature.label}</span>
            </label>
          );
        })}
      </div>
    </div>

    {/* Review Summary */}
    <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
      <h4 className="text-lg font-semibold text-white mb-4">Review Your Submission</h4>
      <div className="space-y-2 text-sm">
        <div><span className="text-zinc-400">Name:</span> <span className="text-white">{formData.name}</span></div>
        <div><span className="text-zinc-400">Neighbourhood:</span> <span className="text-white">{formData.neighbourhood}</span></div>
        <div><span className="text-zinc-400">Address:</span> <span className="text-white">{formData.address}</span></div>
        <div><span className="text-zinc-400">Music:</span> <span className="text-white">{(formData.top_music || []).join(', ')}</span></div>
        <div><span className="text-zinc-400">Age Group:</span> <span className="text-white">{formData.age_group_min}{formData.age_group_max ? ` - ${formData.age_group_max}` : ''}</span></div>
        <div><span className="text-zinc-400">Cover:</span> <span className="text-white">{formData.cover_frequency}{formData.cover_amount ? ` (${formData.cover_amount})` : ''}</span></div>
      </div>
    </div>
  </div>
);
