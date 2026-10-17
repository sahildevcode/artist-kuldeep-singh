import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, Lock, Mail, Shield, BookOpen, Loader2, AtSign, CheckCircle2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithCredentials,
    sendRegistrationOtp,
    verifyRegistrationOtp,
    checkUsernameAvailability
  } = useAuth();

  const [role, setRole] = useState<'collector' | 'student'>('student');
  // 1. Default view is STRICTLY Registration as requested
  const [isRegister, setIsRegister] = useState(true);
  const [regStep, setRegStep] = useState<'form' | 'otp'>('form');

  // Registration Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Sign In Field (Supports Email OR Username)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Status & Feedback
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [demoOtpNotice, setDemoOtpNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMsg('');
      setInfoMsg('');
      setDemoOtpNotice(null);
    }
  }, [isAuthModalOpen]);

  // Debounced check for username availability
  useEffect(() => {
    if (!isRegister || regStep !== 'form') return;
    const clean = username.trim().toLowerCase();
    if (!clean) {
      setUsernameStatus('idle');
      return;
    }
    if (clean.length < 3 || !/^[a-z0-9_]+$/.test(clean)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailability(clean);
        if (res.available) {
          setUsernameStatus('available');
        } else {
          setUsernameStatus('taken');
        }
      } catch {
        setUsernameStatus('available');
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [username, isRegister, regStep, checkUsernameAvailability]);

  if (!isAuthModalOpen) return null;

  // Handle Step 1: Send Registration OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setDemoOtpNotice(null);

    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setErrorMsg('Kripya apna pura naam enter karein.');
      return;
    }
    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMsg('Kripya ek unique username chunein (kam se kam 3 characters).');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      setErrorMsg('Username me sirf letters, numbers aur underscore (_) allow hain.');
      return;
    }
    if (usernameStatus === 'taken') {
      setErrorMsg(`Username "@${cleanUsername}" pehle se kisi aur ne le rakha hai. Kripya doosra username chunein.`);
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Kripya ek valid email address enter karein.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMsg('Password kam se kam 6 characters ka hona chahiye.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await sendRegistrationOtp(cleanEmail, cleanUsername, cleanPassword, cleanName, role);
      if (res.success) {
        setRegStep('otp');
        setInfoMsg(`Verification code sent to ${cleanEmail}. Please enter the 6-digit OTP below.`);
        if (res.demoOtp) {
          setDemoOtpNotice(res.demoOtp);
          setOtp(res.demoOtp);
        }
      } else {
        setErrorMsg(res.error || 'Registration failed. Kripya punah prayas karein.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server error. Kripya punah prayas karein.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 2: Verify Registration OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMsg('Kripya pura 6-digit OTP code enter karein.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyRegistrationOtp(email.trim().toLowerCase(), cleanOtp);
      if (res.success) {
        // Reset form
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setOtp('');
        setRegStep('form');
      } else {
        setErrorMsg(res.error || 'Galat ya expired OTP code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Kripya punah prayas karein.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign In (Dual Email OR Username)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanIdentifier = loginIdentifier.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanIdentifier) {
      setErrorMsg('Kripya apna registered email ya username enter karein.');
      return;
    }
    if (!cleanPassword) {
      setErrorMsg('Kripya password enter karein.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginWithCredentials(cleanIdentifier, cleanPassword);
      if (res.success) {
        setLoginIdentifier('');
        setLoginPassword('');
      } else {
        setErrorMsg(res.error || 'Galat credentials. Kripya punah prayas karein.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server error. Kripya punah prayas karein.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => !isLoading && setIsAuthModalOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-[#1A1816] text-white p-6 text-center relative">
          <button
            onClick={() => !isLoading && setIsAuthModalOpen(false)}
            disabled={isLoading}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-artisan-gold/20 text-artisan-gold flex items-center justify-center mx-auto mb-3 border border-artisan-gold/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-xl tracking-tight">
            Kuldeep Singh Atelier & Academy
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            {isRegister
              ? 'New Student / Collector Official Registration'
              : 'Sign In with Registered Email or Username'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Main Mode Toggle: Registration (Default) vs Sign In */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setErrorMsg('');
                setInfoMsg('');
                setIsRegister(true);
                setRegStep('form');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                isRegister
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <User className="w-3.5 h-3.5 text-artisan-gold" />
              1. Register (New)
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setErrorMsg('');
                setInfoMsg('');
                setIsRegister(false);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                !isRegister
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-artisan-crimson" />
              2. Sign In
            </button>
          </div>

          {/* Role Toggle Switch */}
          <div className="grid grid-cols-2 p-1 bg-stone-50 rounded-xl border border-stone-200 text-xs">
            <button
              type="button"
              disabled={isLoading || regStep === 'otp'}
              onClick={() => setRole('student')}
              className={`py-1.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'student'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <BookOpen className="w-3 h-3 text-artisan-crimson" />
              Masterclass Student
            </button>
            <button
              type="button"
              disabled={isLoading || regStep === 'otp'}
              onClick={() => setRole('collector')}
              className={`py-1.5 font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'collector'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Shield className="w-3 h-3 text-artisan-gold" />
              Art Collector
            </button>
          </div>

          {/* Information & Policy Note */}
          <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70 text-center">
            <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
              🔒 <strong>Security Policy:</strong> 1 Email = 1 Permanent Account. Account sharing across phone and laptop is strictly monitored.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Info Message */}
          {infoMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Demo OTP Banner for Local/Simulator verification */}
          {demoOtpNotice && (
            <div className="p-2.5 bg-yellow-50 border border-yellow-300 rounded-xl text-center space-y-1">
              <p className="text-[11px] font-bold text-yellow-900">
                ⚡ Verification Code (Pre-filled for Local Testing):
              </p>
              <div className="text-base font-mono font-black tracking-widest text-stone-900 bg-white inline-block px-3 py-1 rounded border border-yellow-200">
                {demoOtpNotice}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* A. REGISTRATION FLOW                                     */}
          {/* ======================================================== */}
          {isRegister ? (
            regStep === 'form' ? (
              // Step 1: Account Details Form
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kuldeep Singh"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800 disabled:bg-stone-50"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Unique Username <span className="text-red-500">*</span>
                    </label>
                    {usernameStatus === 'checking' && (
                      <span className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                      </span>
                    )}
                    {usernameStatus === 'available' && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Available
                      </span>
                    )}
                    {usernameStatus === 'taken' && (
                      <span className="text-[10px] text-red-600 font-bold flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3" /> Already Taken
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="e.g. artist_kuldeep"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800 disabled:bg-stone-50 lowercase font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Lowercase letters, numbers & underscore (_) only. You can log in using this username later.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Permanent Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800 disabled:bg-stone-50"
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    1 Email can only be registered once and will be locked upon course purchase.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Create Password (minimum 6 characters) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800 disabled:bg-stone-50"
                    />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  variant="primary"
                  disabled={isLoading || usernameStatus === 'taken'}
                  className="w-full py-3 mt-3 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending 6-Digit OTP...</span>
                    </>
                  ) : (
                    'Verify Email & Send OTP →'
                  )}
                </MagneticButton>
              </form>
            ) : (
              // Step 2: 6-Digit Email OTP Verification Form
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-900">Enter Verification Code</h4>
                  <p className="text-xs text-stone-500">
                    Enter the 6-digit code sent to <strong className="text-stone-800">{email}</strong>
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    disabled={isLoading}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[12px] text-2xl font-mono font-black py-3 bg-white border-2 border-artisan-gold rounded-2xl text-stone-900 focus:outline-none focus:border-stone-900 disabled:bg-stone-50 shadow-inner"
                  />
                </div>

                <MagneticButton
                  type="submit"
                  variant="primary"
                  disabled={isLoading || otp.length < 6}
                  className="w-full py-3 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying code...</span>
                    </>
                  ) : (
                    'Confirm OTP & Activate Atelier Account'
                  )}
                </MagneticButton>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setRegStep('form');
                      setErrorMsg('');
                    }}
                    className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Edit Details
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleSendOtp}
                    className="text-xs text-artisan-crimson hover:underline font-bold"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )
          ) : (
            // ========================================================
            // B. SIGN IN VIEW (Supports Email OR Unique Username)
            // ========================================================
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Registered Email or Unique Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. artist_kuldeep or name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800 disabled:bg-stone-50"
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Enter either your chosen @username or your registered email address.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    disabled={isLoading}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800 disabled:bg-stone-50"
                  />
                </div>
              </div>

              <MagneticButton
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full py-3 mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  'Sign In to Atelier & Academy'
                )}
              </MagneticButton>
            </form>
          )}

          {/* Quick Switch Link */}
          <div className="text-center pt-2 border-t border-stone-100">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setErrorMsg('');
                setInfoMsg('');
                setDemoOtpNotice(null);
                setIsRegister(!isRegister);
                setRegStep('form');
              }}
              className="text-xs text-stone-600 hover:text-stone-900 transition-colors font-medium hover:underline"
            >
              {isRegister
                ? 'Already have an account? Sign In with Email or Username →'
                : "Don't have an account yet? Register / Create Account →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
