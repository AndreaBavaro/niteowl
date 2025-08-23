'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import getSupabaseBrowserClient from '@/lib/supabase/client';

export type PhoneAuthStep = 'phone' | 'otp';

export interface PhoneAuthState {
  step: PhoneAuthStep;
  phoneNumber: string;
  otp: string;
  loading: boolean;
  error: string;
  sentToPhone: string;
  isExistingUser: boolean;
  mounted: boolean;
}

export interface PhoneAuthActions {
  setPhoneNumber: (phone: string) => void;
  setOtp: (otp: string) => void;
  setError: (error: string) => void;
  handlePhoneSubmit: (onSuccess?: (isExistingUser: boolean) => void) => Promise<void>;
  handleOtpSubmit: (onSuccess?: (isExistingUser: boolean) => void) => Promise<void>;
  handlePhoneChange: (value: string) => void;
  goBackToPhone: () => void;
  formatPhoneNumber: (value: string) => string;
}

export function usePhoneAuth() {
  const { signInWithPhone, verifyOTP } = useAuth();
  const [step, setStep] = useState<PhoneAuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentToPhone, setSentToPhone] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPhoneNumber = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  }, [formatPhoneNumber]);

  const handlePhoneSubmit = useCallback(async (
    onSuccess?: (isExistingUser: boolean) => void
  ) => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        setLoading(false);
        return;
      }
      
      const rpcPhone = `1${cleanPhone}`;
      const authPhone = `+1${cleanPhone}`;
      const supabase = getSupabaseBrowserClient();

      console.log('Checking for user with phone number (for RPC):', rpcPhone);

      // Check if user exists
      const { data: userData, error: rpcError } = await supabase.rpc('get_user_id_by_phone', {
        p_phone_number: rpcPhone,
      });

      if (rpcError) {
        console.error('Error checking user existence:', rpcError);
        setError('Could not verify phone number. Please try again.');
        setLoading(false);
        return;
      }

      const userExists = userData && userData.length > 0;
      setIsExistingUser(userExists);

      const { error: signInError } = await signInWithPhone(authPhone);
      
      if (signInError) {
        setError(signInError?.message || 'Failed to send verification code');
      } else {
        setSentToPhone(authPhone);
        setStep('otp');
      }
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, signInWithPhone]);

  const handleOtpSubmit = useCallback(async (
    onSuccess?: (isExistingUser: boolean) => void
  ) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await verifyOTP(sentToPhone, otp);
      
      if (error) {
        setError(error?.message || 'Invalid verification code');
      } else {
        if (onSuccess) {
          onSuccess(isExistingUser);
        }
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sentToPhone, otp, verifyOTP, isExistingUser]);

  const goBackToPhone = useCallback(() => {
    setStep('phone');
  }, []);

  const state: PhoneAuthState = {
    step,
    phoneNumber,
    otp,
    loading,
    error,
    sentToPhone,
    isExistingUser,
    mounted
  };

  const actions: PhoneAuthActions = {
    setPhoneNumber,
    setOtp,
    setError,
    handlePhoneSubmit,
    handleOtpSubmit,
    handlePhoneChange,
    goBackToPhone,
    formatPhoneNumber
  };

  return {
    state,
    actions
  };
}
