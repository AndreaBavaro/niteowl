'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface NavigationState {
  isOpen: boolean;
  user: any;
  isAuthenticated: boolean;
}

export interface NavigationActions {
  setIsOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  handleSignOut: () => void;
}

export function useNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
    setIsOpen(false);
  }, [signOut]);

  const state: NavigationState = {
    isOpen,
    user,
    isAuthenticated
  };

  const actions: NavigationActions = {
    setIsOpen,
    toggleMenu,
    closeMenu,
    handleSignOut
  };

  return {
    state,
    actions
  };
}
