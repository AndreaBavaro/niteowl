'use client';

import React from 'react';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';

interface PhoneAuthProps {
  onSuccess?: (isExistingUser: boolean) => void;
  onCancel?: () => void;
  onBack?: () => void;
  showNameInput?: boolean;
}

export default function PhoneAuth({ onSuccess, onCancel, onBack, showNameInput }: PhoneAuthProps) {
  const { state, actions } = usePhoneAuth();
  const { step, phoneNumber, otp, loading, error, mounted, isExistingUser } = state;
  const { handlePhoneChange, handlePhoneSubmit, handleOtpSubmit, setOtp, goBackToPhone } = actions;

  const handlePhoneFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePhoneSubmit(onSuccess);
  };

  const handleOtpFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleOtpSubmit(onSuccess);
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePhoneChange(e.target.value);
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
            <form onSubmit={handlePhoneFormSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneInputChange}
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
            <form onSubmit={handleOtpFormSubmit} className="space-y-6">
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
                  onClick={goBackToPhone}
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
