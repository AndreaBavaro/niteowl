'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface EmailAuthProps {
  onBack: () => void;
  onSuccess: () => void;
  showNameInput?: boolean;
}

export default function EmailAuth({ onBack, onSuccess, showNameInput = true }: EmailAuthProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'name'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentToEmail, setSentToEmail] = useState('');

  const { signInWithEmail, verifyEmailOTP } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          onSuccess();
        }
      }
    } catch (err) {
      console.log('❌ Email Auth Debug - Exception:', err);
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Name will be saved in the main auth flow
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Email Step */}
        {step === 'email' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 mb-4">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-green-400 to-emerald-400 bg-clip-text text-transparent">
                Enter Your Email
              </h1>
              <p className="text-gray-300">
                We'll send you a verification code
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-md"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Enter Verification Code
              </h1>
              <p className="text-gray-300">
                Code sent to <span className="text-green-400">{sentToEmail}</span>
              </p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-md text-center text-2xl tracking-widest"
                  maxLength={6}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          </div>
        )}

        {/* Name Step */}
        {step === 'name' && showNameInput && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-purple-400 to-pink-400 bg-clip-text text-transparent">
                What's Your Name?
              </h1>
              <p className="text-gray-300">
                Help us personalize your experience
              </p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
