import React, { useState } from 'react';
import { X, Sparkles, User, Lock, Mail, Shield, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const [role, setRole] = useState<'collector' | 'student'>('student');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your valid email address.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setErrorMsg('Please enter your password (minimum 4 characters).');
      return;
    }

    const displayName = name.trim() || (role === 'collector' ? 'Art Collector' : 'Academy Scholar');
    login(cleanEmail, displayName, role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-[#1A1816] text-white p-6 text-center relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
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

        {/* Role Toggle Switch */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200">
            <button
              type="button"
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
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
            <p className="text-xs text-stone-600 font-medium">
              {role === 'student'
                ? 'Sign in with your registered student email and password to access your live classes, meeting link, and recorded lectures.'
                : 'Sign in with your collector email and password to view private acquisitions and certificates of authenticity.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
              {errorMsg}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kuldeep Singh"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800"
                />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-stone-800"
                />
              </div>
            </div>

            <MagneticButton
              type="submit"
              variant="primary"
              className="w-full py-3 mt-2"
            >
              {isRegister ? 'Create Fine Art Account' : 'Sign In to Portal'}
            </MagneticButton>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
            >
              {isRegister
                ? 'Already have an atelier profile? Sign In'
                : "Don't have an account? Request Access / Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
