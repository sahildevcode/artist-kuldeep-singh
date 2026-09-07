import React, { useState } from 'react';
import { X, Lock, Key, ShieldCheck, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';

interface AdminLoginModalProps {
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess }) => {
  const { isAdminModalOpen, setIsAdminModalOpen, adminLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const ok = adminLogin(email, password);
      setLoading(false);
      if (ok) {
        setEmail('');
        setPassword('');
        if (onSuccess) onSuccess();
      } else {
        setError('Invalid studio credentials. Please check your admin ID and password.');
      }
    }, 400);
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@kuldeepsingh.art');
    setPassword('kuldeep2026');
    setError(null);
    setLoading(true);
    setTimeout(() => {
      adminLogin('admin@kuldeepsingh.art', 'kuldeep2026');
      setLoading(false);
      if (onSuccess) onSuccess();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#161412] text-stone-100 rounded-3xl border border-artisan-gold/40 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Decorative Golden Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-artisan-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-artisan-crimson/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsAdminModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Studio Insignia */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-artisan-gold to-amber-600 text-stone-950 mx-auto flex items-center justify-center shadow-lg border border-white/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-artisan-gold block">
              Authorized Studio Atelier Access
            </span>
            <h2 className="font-serif font-bold text-2xl text-white mt-1">
              Artist Kuldeep Singh
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Master Atelier & Course Control Center
            </p>
          </div>
        </div>

        {/* Quick Demo Fill Helper */}
        <div className="mb-5 p-3 rounded-2xl bg-white/5 border border-artisan-gold/20 flex items-center justify-between gap-3 text-xs">
          <div className="text-left">
            <span className="text-artisan-gold font-bold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> Demo Owner Credentials
            </span>
            <span className="text-[10px] text-stone-400 block">
              ID: admin@kuldeepsingh.art • Pass: kuldeep2026
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="px-3 py-1.5 bg-artisan-gold hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-xs"
          >
            Auto Fill & Enter
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
              Studio Admin ID / Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kuldeepsingh.art"
                required
                className="w-full bg-[#201D1A] border border-stone-700/80 focus:border-artisan-gold focus:ring-1 focus:ring-artisan-gold rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-stone-500 outline-none transition-all"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="w-full bg-[#201D1A] border border-stone-700/80 focus:border-artisan-gold focus:ring-1 focus:ring-artisan-gold rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-stone-500 outline-none transition-all"
              />
              <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <MagneticButton
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-artisan-gold to-amber-500 hover:from-amber-400 hover:to-artisan-gold text-stone-950 font-bold flex items-center justify-center gap-2 text-sm shadow-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-stone-950/40 border-t-stone-950 rounded-full animate-spin" />
                <span>Verifying Atelier Credentials...</span>
              </div>
            ) : (
              <span>Unlock Admin Dashboard</span>
            )}
          </MagneticButton>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-800 text-center">
          <p className="text-[11px] text-stone-500">
            Confidential Atelier Management System • Encrypted Local Vault
          </p>
        </div>
      </div>
    </div>
  );
};
