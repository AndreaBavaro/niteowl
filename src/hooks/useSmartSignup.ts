'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export interface PhoneCheckResult {
  userExists: boolean;
  accessStatus: 'pending' | 'approved' | 'rejected';
  hasRecentSession: boolean;
  hasPreferences: boolean;
  nextStep: string;
  skipOTP: boolean;
  user?: {
    id: string;
    phone: string;
    full_name: string;
    access_status: string;
  } | null;
  error?: string;
}

export type SmartSignupStep = 'phone' | 'otp' | 'message';

export interface SmartSignupState {
  phone: string;
  otp: string;
  step: SmartSignupStep;
  phoneResult: PhoneCheckResult | null;
  loading: boolean;
  error: string;
}

export interface SmartSignupActions {
  setPhone: (phone: string) => void;
  setOtp: (otp: string) => void;
  setError: (error: string) => void;
  formatPhoneNumber: (value: string) => string;
  handlePhoneSubmit: () => Promise<void>;
  handleOTPSubmit: () => Promise<void>;
  handleDirectRouting: (result: PhoneCheckResult) => void;
  goBackToPhone: () => void;
}

export function useSmartSignup() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<SmartSignupStep>('phone');
  const [phoneResult, setPhoneResult] = useState<PhoneCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { checkPhoneStatus, signInWithPhone, verifyOTP, updateLastActive } = useAuth();
  const router = useRouter();

  const formatPhoneNumber = useCallback((value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for North American numbers (no + sign)
    if (digits.length <= 10) {
      const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        return `${match[1] ? `(${match[1]}` : ''}${match[1] && match[1].length === 3 ? ') ' : ''}${match[2]}${match[2] && match[3] ? '-' : ''}${match[3]}`;
      }
    }
    return value;
  }, []);

  const handleDirectRouting = useCallback((result: PhoneCheckResult) => {
    switch (result.nextStep) {
      case 'preferences':
        router.push('/auth/preferences');
        break;
      case 'recommendations':
        router.push('/recommendations');
        break;
      default:
        router.push('/auth/onboarding');
    }
  }, [router]);

  const handlePhoneSubmit = useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      // Extract digits - no + sign needed
      const digits = phone.replace(/\D/g, '');
      const cleanPhone = digits.startsWith('1') ? digits : `1${digits}`;

      // Check phone status
      const result = await checkPhoneStatus(cleanPhone);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Cast the result to the correct type since checkPhoneStatus returns the API response
      const phoneResult = result as PhoneCheckResult;
      setPhoneResult(phoneResult);

      // Handle different scenarios
      if (!phoneResult.userExists) {
        // New user - send OTP
        const { error: otpError } = await signInWithPhone(cleanPhone);
        if (otpError) {
          setError(otpError || 'Failed to send OTP');
        } else {
          setStep('otp');
        }
      } else if (phoneResult.skipOTP && phoneResult.hasRecentSession) {
        // User has recent session - skip OTP and route directly
        await updateLastActive();
        handleDirectRouting(phoneResult);
      } else if (phoneResult.accessStatus === 'rejected') {
        // Rejected user - show message
        setStep('message');
      } else {
        // Existing user needs OTP verification
        const { error: otpError } = await signInWithPhone(cleanPhone);
        if (otpError) {
          setError(otpError || 'Failed to send OTP');
        } else {
          setStep('otp');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [phone, checkPhoneStatus, signInWithPhone, updateLastActive, handleDirectRouting]);

  const handleOTPSubmit = useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      const digits = phone.replace(/\D/g, '');
      const cleanPhone = digits.startsWith('1') ? digits : `1${digits}`;

      const { error: verifyError } = await verifyOTP(cleanPhone, otp);
      
      if (verifyError) {
        setError(verifyError || 'Invalid OTP');
        setLoading(false);
        return;
      }

      // Update last active timestamp
      await updateLastActive();

      // Route based on phone check result
      if (phoneResult) {
        handleDirectRouting(phoneResult);
      } else {
        router.push('/auth/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [phone, otp, verifyOTP, updateLastActive, phoneResult, handleDirectRouting, router]);

  const goBackToPhone = useCallback(() => {
    setStep('phone');
    setOtp('');
    setError('');
  }, []);

  const state: SmartSignupState = {
    phone,
    otp,
    step,
    phoneResult,
    loading,
    error
  };

  const actions: SmartSignupActions = {
    setPhone,
    setOtp,
    setError,
    formatPhoneNumber,
    handlePhoneSubmit,
    handleOTPSubmit,
    handleDirectRouting,
    goBackToPhone
  };

  return {
    state,
    actions
  };
}
