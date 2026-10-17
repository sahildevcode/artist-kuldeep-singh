import React, { useState } from 'react';
import { X, Sparkles, User, Lock, Mail, Shield, BookOpen, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithCredentials, registerWithCredentials } = useAuth();
  const [role, setRole] = useState<'collector' | 'student'>('student');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Kripya valid email address enter karein.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMsg('Password kam se kam 6 characters ka hona chahiye.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        const displayName = name.trim() || (role === 'collector' ? 'Art Collector' : 'Academy Scholar');
        const res = await registerWithCredentials(cleanEmail, cleanPassword, displayName, role);
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed. Kripya punah prayas karein.');
        } else {
          setEmail('');
          setPassword('');
          setName('');
        }
      } else {
        const res = await loginWithCredentials(cleanEmail, cleanPassword);
        if (!res.success) {
          setErrorMsg(res.error || 'Galat email ya password. Kripya punah prayas karein.');
        } else {
          setEmail('');
          setPassword('');
        }
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
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
            Access private previews, track authentications, or stream masterclasses
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Role Toggle Switch */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setRole('collector')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                role === 'collector'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-artisan-gold" />
              Art Collector
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setRole('student')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                role === 'student'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-artisan-crimson" />
              Masterclass Student
            </button>
          </div>

          {/* Role Helper Description */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-center">
            <p className="text-xs text-stone-600 font-medium">
              {role === 'student'
                ? isRegister
                  ? 'Create your official academy account to enroll in live masterclasses & recorded modules.'
                  : 'Sign in with your registered student email and password to access your batch & live streaming.'
                : isRegister
                  ? 'Create your collector profile to acquire originals & access provenance records.'
                  : 'Sign in with your collector email and password to view private acquisitions.'}
            </p>
          </div>

          {/* Security Alert / Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
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
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
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
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password (minimum 6 characters)
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
              disabled={isLoading}
              className="w-full py-3 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : isRegister ? (
                'Create Secure Atelier Account'
              ) : (
                'Sign In to Portal'
              )}
            </MagneticButton>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setErrorMsg('');
                setIsRegister(!isRegister);
              }}
              className="text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
            >
              {isRegister
                ? 'Already have an account? Sign In'
                : "Don't have an account yet? Register / Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
