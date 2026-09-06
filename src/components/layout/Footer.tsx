import React, { useState } from 'react';
import { ArrowUpRight, Check, MapPin, Sparkles } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: 'home' | 'about' | 'courses' | 'store') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#151311] text-stone-300 pt-20 pb-12 overflow-hidden border-t border-stone-800">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-artisan-crimson/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-artisan-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone-800/80">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 text-[#151311] flex items-center justify-center font-serif text-xl font-bold">
                A
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                AURA <span className="font-light text-artisan-gold">STUDIO</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Dedicated to the resurgence of classical figurative discipline infused with raw contemporary expression. 
              Over 12 years of painting, educating artists globally, and creating timeless heirlooms for discerning collectors worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <MapPin className="w-4 h-4 text-artisan-gold" />
              <span>Manhattan Studio: 524 W 26th St, Chelsea, New York</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Sparkles className="w-4 h-4 text-artisan-crimson" />
              <span>Florence Atelier: Via Maggio 18, Santo Spirito, Italy</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">Exploration</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActivePage('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  Home Showcase
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  12-Year Legacy & Awards
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('courses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  Fine Art Masterclasses
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1 group"
                >
                  Original Artworks Store
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">Collector Gazette</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Receive private previews of newly completed canvases 48 hours before public gallery releases, plus free masterclass studio notes.
            </p>
            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You are on the Collector VIP list. Welcome.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-stone-900 border border-stone-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-artisan-gold flex-1"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-stone-200 text-[#151311] px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all"
                >
                  Join
                </button>
              </form>
            )}
            <p className="text-[11px] text-stone-500">
              * Strictly private. No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Julian Vance Atelier & Aura Studio Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Certificates of Authenticity Included</span>
            <span>•</span>
            <span>Insured International Fine Art Crating</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
