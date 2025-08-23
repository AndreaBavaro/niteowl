'use client';

import { useState, useCallback } from 'react';

export interface PreferencesData {
  age: number;
  music_preferences: string[];
  neighbourhood: string;
}

export interface PreferencesState {
  age: number;
  musicPreferences: string[];
  neighbourhood: string;
  error: string;
  loading: boolean;
}

export interface PreferencesActions {
  setAge: (age: number) => void;
  toggleMusicGenre: (genre: string) => void;
  setNeighbourhood: (neighbourhood: string) => void;
  setError: (error: string) => void;
  submitPreferences: (onComplete: (preferences: PreferencesData) => Promise<void>) => Promise<void>;
  validateForm: () => boolean;
}

export function usePreferences() {
  const [age, setAge] = useState<number>(0);
  const [musicPreferences, setMusicPreferences] = useState<string[]>([]);
  const [neighbourhood, setNeighbourhood] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMusicGenre = useCallback((genre: string) => {
    setMusicPreferences(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  }, []);

  const validateForm = useCallback(() => {
    if (!age || age < 18 || age > 99) {
      setError('Please enter a valid age between 18 and 99');
      return false;
    }
    
    if (musicPreferences.length === 0) {
      setError('Please select at least one music genre');
      return false;
    }
    
    if (!neighbourhood) {
      setError('Please select your neighbourhood');
      return false;
    }

    setError('');
    return true;
  }, [age, musicPreferences.length, neighbourhood]);

  const submitPreferences = useCallback(async (
    onComplete: (preferences: PreferencesData) => Promise<void>
  ) => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onComplete({
        age: age,
        music_preferences: musicPreferences,
        neighbourhood: neighbourhood
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [age, musicPreferences, neighbourhood, validateForm]);

  const isFormValid = age >= 18 && age <= 99 && musicPreferences.length > 0 && neighbourhood;

  const state: PreferencesState = {
    age,
    musicPreferences,
    neighbourhood,
    error,
    loading
  };

  const actions: PreferencesActions = {
    setAge,
    toggleMusicGenre,
    setNeighbourhood,
    setError,
    submitPreferences,
    validateForm
  };

  return {
    state,
    actions,
    isFormValid
  };
}
