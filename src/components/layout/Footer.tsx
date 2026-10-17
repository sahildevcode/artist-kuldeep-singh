import React, { useState } from 'react';
import { ArrowUpRight, Check, MapPin, ShieldCheck, FileText, RefreshCw, Truck, Mail, Phone, Lock } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: any) => void;
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

  const navigateTo = (page: string) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#151311] text-stone-300 pt-16 sm:pt-20 pb-12 overflow-hidden border-t border-stone-800">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-artisan-crimson/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-artisan-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10 pb-14 border-b border-stone-800/80">
          
          {/* Brand Column (4 cols) */}
          <div className="md:col-span-4 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-100 text-[#151311] flex items-center justify-center font-serif text-xl font-bold">
                K
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                KULDEEP <span className="font-light text-artisan-gold">SINGH</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dedicated to the resurgence of classical figurative discipline infused with raw contemporary expression. 
              Over 12 years of painting, educating artists globally, and creating timeless heirlooms for discerning collectors worldwide.
            </p>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-artisan-gold shrink-0 mt-0.5" />
                <span>Atelier: South Extension Part II, New Delhi 110049, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Support: +91 98100 88231 • support@kuldeepsingh.art</span>
              </div>
            </div>
          </div>

          {/* Exploration Links (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">Exploration</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-white transition-colors flex items-center gap-1 group text-left"
                >
                  Home Showcase
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors flex items-center gap-1 group text-left"
                >
                  12Y Legacy & Bio
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('courses')}
                  className="hover:text-white transition-colors flex items-center gap-1 group text-left"
                >
                  Masterclasses
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('store')}
                  className="hover:text-white transition-colors flex items-center gap-1 group text-left"
                >
                  Original Gallery Store
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('student-portal')}
                  className="hover:text-white text-artisan-gold font-semibold transition-colors flex items-center gap-1 group text-left"
                >
                  🎓 Student Portal
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Razorpay Compliance Policies (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-artisan-gold" />
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigateTo('terms')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-500 group-hover:text-artisan-gold" />
                  <span>Terms & Conditions</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('privacy')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-stone-500 group-hover:text-artisan-gold" />
                  <span>Privacy Policy</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('refund')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-500 group-hover:text-artisan-gold" />
                  <span>Refund & Cancellation</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shipping')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 group text-left"
                >
                  <Truck className="w-3.5 h-3.5 text-stone-500 group-hover:text-artisan-gold" />
                  <span>Shipping & Delivery Policy</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white text-emerald-400 font-medium transition-colors flex items-center gap-1.5 group text-left"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Contact Us & Grievance</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Payment Security Badge (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold">Collector Gazette</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Receive private previews of newly completed canvases 48 hours prior to public release.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are on the Collector VIP list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="bg-stone-900 border border-stone-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-artisan-gold flex-1"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-stone-200 text-[#151311] px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all"
                >
                  Join
                </button>
              </form>
            )}

            {/* Razorpay Trust Badge */}
            <div className="pt-2">
              <div className="p-3 bg-stone-900/90 border border-stone-800 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Razorpay Verified Payment Gateway</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-tight">
                  256-bit SSL Banking Encryption • UPI, Cards, NetBanking, International FX
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Artist Kuldeep Singh Atelier & Fine Art Studio. All Rights Reserved.</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-[11px]">
            <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('refund')} className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Refund Policy
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('shipping')} className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Shipping Policy
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors underline-offset-4 hover:underline">
              Contact Us
            </button>
          </div>
        </div>

        {/* Local SEO & Authenticity Guarantee */}
        <div className="pt-5 mt-5 border-t border-stone-800/50 text-[10px] sm:text-[11px] text-stone-500 flex flex-wrap items-center justify-between gap-2">
          <span>Operating Entity: Kuldeep Singh Fine Art Atelier • New Delhi, India</span>
          <span className="text-stone-600">100% Insured Delivery • Certificate of Authenticity Included</span>
        </div>
      </div>
    </footer>
  );
};
