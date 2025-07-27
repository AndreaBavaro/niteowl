'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Phone, AlertCircle, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

interface PhoneCheckResult {
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

export default function SmartSignup() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'message'>('phone');
  const [phoneResult, setPhoneResult] = useState<PhoneCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { checkPhoneStatus, signInWithPhone, verifyOTP, updateLastActive } = useAuth();
  const router = useRouter();

  const formatPhoneNumber = (value: string) => {
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
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        // Fallback for new users
        router.push('/waiting');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleDirectRouting = (result: PhoneCheckResult) => {
    switch (result.nextStep) {
      case 'waiting':
        router.push('/waiting');
        break;
      case 'for-you':
        router.push('/for-you');
        break;
      case 'preferences':
        router.push('/preferences');
        break;
      default:
        router.push('/waiting');
    }
  };

  const getStatusIcon = () => {
    if (!phoneResult) return null;
    
    switch (phoneResult.accessStatus) {
      case 'approved':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-8 h-8 text-red-400" />;
      case 'pending':
        return <Clock className="w-8 h-8 text-yellow-400" />;
      default:
        return <AlertCircle className="w-8 h-8 text-blue-400" />;
    }
  };

  const getStatusColor = () => {
    if (!phoneResult) return 'text-white';
    
    switch (phoneResult.accessStatus) {
      case 'approved':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  if (step === 'message' && phoneResult) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            
            <h2 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
              {phoneResult.accessStatus === 'rejected' ? 'Access Denied' : 'Status Update'}
            </h2>
            
            <p className="text-zinc-300 mb-6">
              {phoneResult.accessStatus === 'rejected' 
                ? 'Your access request has been denied. Please contact support for more information.'
                : phoneResult.accessStatus === 'pending'
                ? 'Your access request is being reviewed. You\'ll be notified once approved.'
                : 'Welcome! Your account has been approved.'}
            </p>

            <div className="space-y-3">
              {phoneResult.accessStatus === 'pending' && (
                <button
                  onClick={() => router.push('/waiting')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Continue to Waiting Room
                </button>
              )}
              
              <button
                onClick={() => {
                  setStep('phone');
                  setPhone('');
                  setPhoneResult(null);
                  setError('');
                }}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Try Different Number
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 'phone' ? 'Enter Your Phone' : 'Verify Code'}
          </h1>
          <p className="text-zinc-400">
            {step === 'phone' 
              ? 'We\'ll check your access status and send a verification code if needed'
              : `We sent a 6-digit code to ${phone}`
            }
          </p>
        </div>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !phone}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-zinc-700 disabled:to-zinc-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-zinc-300 mb-2">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-zinc-700 disabled:to-zinc-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verify Code'
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
              className="w-full text-zinc-400 hover:text-white transition-colors duration-200"
            >
              ← Back to phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
