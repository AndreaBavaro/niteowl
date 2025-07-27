'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import getSupabaseBrowserClient from '@/lib/supabase/client';

interface PhoneAuthProps {
  onSuccess?: (isExistingUser: boolean) => void;
  onCancel?: () => void;
  onBack?: () => void;
  showNameInput?: boolean;
}

export default function PhoneAuth({ onSuccess, onCancel, onBack, showNameInput }: PhoneAuthProps) {
  const { signInWithPhone, verifyOTP } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
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

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
              🦉
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
              {step === 'phone' && isExistingUser ? 'Welcome Back!' : 'Welcome to NightOwl TO'}
            </h1>
            <p className="text-gray-400 mt-2">
              {step === 'phone' ? 'Enter your phone number to get started' : `Enter the code sent to ${phoneNumber}`}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(416) 555-0123"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length < 14}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm text-center text-2xl tracking-widest"
                  required
                  disabled={loading}
                  maxLength={6}
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-full py-2 px-4 text-gray-400 hover:text-white transition-colors duration-200"
                  disabled={loading}
                >
                  ← Back to phone number
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 space-y-2">
            {onBack && (
              <button
                onClick={onBack}
                className="w-full py-2 px-4 text-gray-400 hover:text-white transition-colors duration-200"
                disabled={loading}
              >
                ← Back to options
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
