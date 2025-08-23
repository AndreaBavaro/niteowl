'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Music, 
  DollarSign, 
  Star,
  TreePine,
  Building2,
  Disc3,
  Mic,
  UtensilsCrossed,
  Circle,
  Gamepad2,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  FileText
} from 'lucide-react';
import { 
  CreateBarSubmissionInput, 
  CreateBarSubmissionSchema,
  MusicGenre,
  DayOfWeek,
  LineupTimeRange,
  CoverFrequency,
  CoverAmount,
  AgeGroup,
  CapacitySize
} from '@/lib/types';
import {
  Step1BasicInfo,
  Step2Description,
  Step3Music,
  Step4CrowdTiming,
  Step5PricingEvents,
  Step6FeaturesReview
} from './BarFormSteps';

interface FormErrors {
  [key: string]: string;
}

interface DuplicateInfo {
  existingBars: Array<{ id: string; name: string; neighbourhood: string }>;
  pendingSubmissions: Array<{ id: string; name: string; neighbourhood: string; status: string }>;
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

const STEPS = [
  { id: 1, title: 'Basic Info', progress: 17 },
  { id: 2, title: 'Description', progress: 33 },
  { id: 3, title: 'Music', progress: 50 },
  { id: 4, title: 'Crowd & Timing', progress: 67 },
  { id: 5, title: 'Pricing & Events', progress: 83 },
  { id: 6, title: 'Features & Review', progress: 100 }
];

export default function MultiStepBarForm() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateBarSubmissionInput>>({
    name: '',
    neighbourhood: '',
    address: '',
    description: '',
    typical_lineup_min: '0-10 min',
    cover_frequency: 'No cover',
    typical_vibe: '',
    top_music: [],
    age_group_min: '18-21',
    live_music_days: [],
    has_patio: false,
    has_rooftop: false,
    has_dancefloor: false,
    karaoke_nights: [],
    has_food: false,
    has_pool_table: false,
    has_arcade_games: false,
    longest_line_days: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    message: string;
    duplicates: DuplicateInfo;
  } | null>(null);

  // Redirect if not authenticated
  if (!user) {
    router.push('/auth');
    return null;
  }

  const musicGenres: MusicGenre[] = ['House', 'EDM', 'Hip-hop', 'Rap', 'Top 40', 'Pop', 'Mixed/Variety', 'Live bands', 'City-pop', 'Jazz'];
  const daysOfWeek: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const lineupTimes: LineupTimeRange[] = ['0-10 min', '15-30 min', '30+ min'];
  const coverFrequencies: CoverFrequency[] = ['No cover', 'Sometimes', 'Yes-always'];
  const coverAmounts: CoverAmount[] = ['Under $10', '$10-$20', 'Over $20'];
  const ageGroups: AgeGroup[] = ['18-21', '22-25', '25-30'];
  const capacitySizes: CapacitySize[] = ['Intimate (<50)', 'Medium (50-150)', 'Large (150-300)', 'Very Large (300+)'];

  const handleInputChange = (field: keyof CreateBarSubmissionInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if ((field === 'name' || field === 'neighbourhood') && duplicateWarning) {
      setDuplicateWarning(null);
    }
  };

  const handleArrayToggle = (field: keyof CreateBarSubmissionInput, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.name?.trim()) newErrors.name = 'Bar name is required';
        if (!formData.neighbourhood?.trim()) newErrors.neighbourhood = 'Neighbourhood is required';
        if (!formData.address?.trim()) newErrors.address = 'Address is required';
        break;
      case 2:
        if (!formData.description?.trim()) newErrors.description = 'Description is required';
        if (!formData.typical_vibe?.trim()) newErrors.typical_vibe = 'Typical vibe is required';
        break;
      case 3:
        if (!formData.top_music || formData.top_music.length === 0) {
          newErrors.top_music = 'Please select at least one music genre';
        }
        break;
      case 4:
        if (!formData.age_group_min) newErrors.age_group_min = 'Minimum age group is required';
        if (!formData.typical_lineup_min) newErrors.typical_lineup_min = 'Typical lineup time is required';
        break;
      case 5:
        if (!formData.cover_frequency) newErrors.cover_frequency = 'Cover frequency is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    const validationResult = CreateBarSubmissionSchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors: FormErrors = {};
      validationResult.error.errors.forEach(error => {
        const field = error.path[0] as string;
        newErrors[field] = error.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setDuplicateWarning(null);

    try {
      const response = await fetch('/api/bar-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => router.push('/for-you'), 2000);
      } else if (response.status === 409) {
        setDuplicateWarning({
          message: data.message,
          duplicates: data.duplicates
        });
      } else {
        setErrors({ submit: data.message || 'Failed to submit bar' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred while submitting' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentStepData = () => STEPS.find(step => step.id === currentStep);

  const renderProgressBar = () => {
    const currentStepData = getCurrentStepData();
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Step {currentStep} of 6: {currentStepData?.title}
          </h2>
          <span className="text-sm text-zinc-400">
            {currentStepData?.progress}% Complete
          </span>
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${currentStepData?.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          {STEPS.map((step) => (
            <span 
              key={step.id} 
              className={`${step.id <= currentStep ? 'text-green-400' : 'text-zinc-500'}`}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Success screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Bar Submitted Successfully!</h2>
          <p className="text-zinc-400">Redirecting you back to the app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {renderProgressBar()}
        
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
          {/* Step content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && (
              <Step1BasicInfo 
                formData={formData} 
                errors={errors} 
                handleInputChange={handleInputChange} 
                handleArrayToggle={handleArrayToggle} 
              />
            )}
            {currentStep === 2 && (
              <Step2Description 
                formData={formData} 
                errors={errors} 
                handleInputChange={handleInputChange} 
                handleArrayToggle={handleArrayToggle} 
              />
            )}
            {currentStep === 3 && (
              <Step3Music 
                formData={formData} 
                errors={errors} 
                handleInputChange={handleInputChange} 
                handleArrayToggle={handleArrayToggle} 
              />
            )}
            {currentStep === 4 && (
              <Step4CrowdTiming 
                formData={formData} 
                errors={errors} 
                handleInputChange={handleInputChange} 
                handleArrayToggle={handleArrayToggle} 
              />
            )}
            {currentStep === 5 && (
              <Step5PricingEvents 
                formData={formData} 
                errors={errors} 
                handleInputChange={handleInputChange} 
                handleArrayToggle={handleArrayToggle} 
              />
            )}
            {currentStep === 6 && (
              <Step6FeaturesReview 
                formData={formData} 
                errors={errors} 
                handleInputChange={handleInputChange} 
                handleArrayToggle={handleArrayToggle} 
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium rounded-lg transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Submit Bar
                  </>
                )}
              </button>
            )}
          </div>

          {/* Error messages */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-400/30 rounded-lg">
              {Object.values(errors).map((error, index) => (
                <p key={index} className="text-red-400 text-sm">{error}</p>
              ))}
            </div>
          )}

          {/* Duplicate warning */}
          {duplicateWarning && (
            <div className="mt-4 p-4 bg-yellow-900/50 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-400 text-sm">{duplicateWarning.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
