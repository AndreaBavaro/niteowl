'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type EmailAuthStep = 'email' | 'otp' | 'name';

export interface EmailAuthState {
  step: EmailAuthStep;
  email: string;
  otp: string;
  name: string;
  loading: boolean;
  error: string;
  sentToEmail: string;
}

export interface EmailAuthActions {
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  setName: (name: string) => void;
  setError: (error: string) => void;
  handleEmailSubmit: (onSuccess?: () => void) => Promise<void>;
  handleOtpSubmit: (onSuccess?: () => void, showNameInput?: boolean) => Promise<void>;
  handleNameSubmit: (onSuccess?: () => void) => Promise<void>;
  goBackToEmail: () => void;
}

export function useEmailAuth() {
  const { signInWithEmail, verifyEmailOTP } = useAuth();
  const [step, setStep] = useState<EmailAuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentToEmail, setSentToEmail] = useState('');

  const handleEmailSubmit = useCallback(async (onSuccess?: () => void) => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Email Auth Debug - Sending OTP to:', email);
      const { error } = await signInWithEmail(email.trim());
      
      if (error) {
        console.log('❌ Email Auth Debug - Error:', error);
        setError(typeof error === 'string' ? error : 'Failed to send verification code');
      } else {
        console.log('✅ Email Auth Debug - OTP sent successfully');
        setSentToEmail(email.trim());
        setStep('otp');
      }
    } catch (err) {
      console.log('❌ Email Auth Debug - Exception:', err);
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  }, [email, signInWithEmail]);

  const handleOtpSubmit = useCallback(async (
    onSuccess?: () => void, 
    showNameInput: boolean = true
  ) => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Email Auth Debug - Verifying OTP for:', sentToEmail);
      const { error } = await verifyEmailOTP(sentToEmail, otp.trim());
      
      if (error) {
        console.log('❌ Email Auth Debug - Verification error:', error);
        setError(typeof error === 'string' ? error : 'Invalid verification code');
      } else {
        console.log('✅ Email Auth Debug - OTP verified successfully');
        if (showNameInput) {
          setStep('name');
        } else {
          if (onSuccess) onSuccess();
        }
      }
    } catch (err) {
      console.log('❌ Email Auth Debug - Exception:', err);
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  }, [otp, sentToEmail, verifyEmailOTP]);

  const handleNameSubmit = useCallback(async (onSuccess?: () => void) => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Name will be saved in the main auth flow
    if (onSuccess) onSuccess();
  }, [name]);

  const goBackToEmail = useCallback(() => {
    setStep('email');
    setError('');
  }, []);

  const state: EmailAuthState = {
    step,
    email,
    otp,
    name,
    loading,
    error,
    sentToEmail
  };

  const actions: EmailAuthActions = {
    setEmail,
    setOtp,
    setName,
    setError,
    handleEmailSubmit,
    handleOtpSubmit,
    handleNameSubmit,
    goBackToEmail
  };

  return {
    state,
    actions
  };
}
