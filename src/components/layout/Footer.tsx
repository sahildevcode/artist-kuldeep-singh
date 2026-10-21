import React, { useState } from 'react';
import { ArrowUpRight, Check, MapPin, ShieldCheck, Phone } from 'lucide-react';

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
          
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-5 space-y-4 sm:space-y-5">
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
                <span>Atelier & Studio: Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Support: +91 8858060101 • artistkuldeepsingh26@gmail.com</span>
              </div>
            </div>

            {/* Direct Connect Channels (WhatsApp, Call, Instagram, YouTube, Twitter) */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://wa.me/918858060101?text=Hello%20Artist%20Kuldeep%20Singh%2C%20I%20am%20reaching%20out%20from%20your%20website"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Atelier"
                className="w-8 h-8 rounded-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.761.882 2.79.883h.001c3.181 0 5.767-2.587 5.768-5.766.001-3.18-2.585-5.769-5.768-5.769zm3.391 8.232c-.146.415-.844.787-1.164.836-.319.05-.724.084-2.316-.576-1.591-.659-2.617-2.275-2.697-2.381-.079-.107-.645-.858-.645-1.636s.404-1.157.548-1.314c.143-.158.312-.197.416-.197.104 0 .209.002.3.007.096.005.225-.036.352.269.13.313.444 1.082.483 1.162.039.079.065.172.013.277-.052.105-.078.17-.156.262-.079.091-.166.204-.237.274-.079.077-.162.161-.07.319.092.157.409.675.877 1.092.602.537 1.109.703 1.267.782.158.079.25.066.342-.04.092-.105.394-.458.499-.615.105-.158.21-.132.353-.079.144.053.914.431 1.071.51.157.079.262.118.3.184.039.066.039.381-.107.796z"/>
                </svg>
              </a>
              <a
                href="tel:+918858060101"
                title="Direct Phone Call"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.instagram.com/artist_kuldeep_singh?exln=dXA3Znl1bXcyeWw5"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram Gallery"
                className="w-8 h-8 rounded-full bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@artistkuldeepsingh?si=6Jt3uFkpQUsRKlum"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube Art Channel"
                className="w-8 h-8 rounded-full bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/918858060101"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Direct"
                className="w-8 h-8 rounded-full bg-emerald-700/20 hover:bg-emerald-700 text-emerald-400 hover:text-white flex items-center justify-center transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Exploration Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
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

          {/* Newsletter & Payment Security Badge (4 cols) */}
          <div className="md:col-span-4 space-y-4">
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
          <span>Operating Entity: Kuldeep Singh Gautam (Artist Atelier & Academy) • Delhi, India</span>
          <span className="text-stone-600">100% Insured Delivery • Certificate of Authenticity Included</span>
        </div>
      </div>
    </footer>
  );
};
