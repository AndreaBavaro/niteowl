'use client';

import { Phone, AlertCircle, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { useSmartSignup, PhoneCheckResult } from '@/hooks/useSmartSignup';
import { useRouter } from 'next/navigation';

export default function SmartSignup() {
  const { state, actions } = useSmartSignup();
  const { phone, otp, step, phoneResult, loading, error } = state;
  const { setPhone, setOtp, setError, formatPhoneNumber, handlePhoneSubmit, handleOTPSubmit, goBackToPhone } = actions;
  const router = useRouter();


  const handlePhoneFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePhoneSubmit();
  };

  const handleOTPFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleOTPSubmit();
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
                onClick={goBackToPhone}
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
          <form onSubmit={handlePhoneFormSubmit} className="space-y-6">
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
          <form onSubmit={handleOTPFormSubmit} className="space-y-6">
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
              onClick={goBackToPhone}
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
