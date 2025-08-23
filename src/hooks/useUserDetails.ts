'use client';

import { useState, useCallback } from 'react';

export interface UserDetailsState {
  name: string;
  loading: boolean;
  error: string;
}

export interface UserDetailsActions {
  setName: (name: string) => void;
  setError: (error: string) => void;
  handleSubmit: (onComplete: (name: string) => void) => Promise<void>;
  clearError: () => void;
}

export function useUserDetails() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (onComplete: (name: string) => void) => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      onComplete(name.trim());
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [name]);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const state: UserDetailsState = {
    name,
    loading,
    error
  };

  const actions: UserDetailsActions = {
    setName,
    setError,
    handleSubmit,
    clearError
  };

  return {
    state,
    actions
  };
}
