import React, { useState } from 'react';
import { Phone, X, Sparkles, ArrowRight } from 'lucide-react';

interface ContactWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ContactWidget: React.FC<ContactWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Channels with elegant luxury styling (no harsh neon colors)
  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Atelier',
      subtitle: 'Direct chat with studio manager for acquisitions & admissions',
      value: '+91 98100 88231',
      href: 'https://wa.me/919810088231?text=Hello%20Artist%20Kuldeep%20Singh%2C%20I%20am%20reaching%20out%20from%20your%20website%20regarding%20artworks%20and%20masterclasses.',
      btnText: 'Open Chat',
      badge: 'Quickest Response',
      iconColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      icon: (
        <svg className="w-4 h-4 fill-emerald-700" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.761.882 2.79.883h.001c3.181 0 5.767-2.587 5.768-5.766.001-3.18-2.585-5.769-5.768-5.769zm3.391 8.232c-.146.415-.844.787-1.164.836-.319.05-.724.084-2.316-.576-1.591-.659-2.617-2.275-2.697-2.381-.079-.107-.645-.858-.645-1.636s.404-1.157.548-1.314c.143-.158.312-.197.416-.197.104 0 .209.002.3.007.096.005.225-.036.352.269.13.313.444 1.082.483 1.162.039.079.065.172.013.277-.052.105-.078.17-.156.262-.079.091-.166.204-.237.274-.079.077-.162.161-.07.319.092.157.409.675.877 1.092.602.537 1.109.703 1.267.782.158.079.25.066.342-.04.092-.105.394-.458.499-.615.105-.158.21-.132.353-.079.144.053.914.431 1.071.51.157.079.262.118.3.184.039.066.039.381-.107.796z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.178L2 22l4.981-1.398A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.053c-1.642 0-3.178-.49-4.473-1.332l-.321-.208-2.964.83.829-2.946-.226-.339A8.046 8.046 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8.053-8 8.053z"/>
        </svg>
      )
    },
    {
      id: 'phone',
      name: 'Direct Phone Call',
      subtitle: '+91 98100 88231 (Mon - Sat • 10 AM - 7 PM IST)',
      value: '+91 98100 88231',
      href: 'tel:+919810088231',
      btnText: 'Call Studio',
      badge: 'Voice Call',
      iconColor: 'bg-stone-100 text-stone-800 border border-stone-200',
      icon: <Phone className="w-4 h-4 text-stone-800" />
    },
    {
      id: 'instagram',
      name: 'Instagram Gallery',
      subtitle: '@artistkuldeepsingh • Studio WIP, reels & new releases',
      value: '@artistkuldeepsingh',
      href: 'https://instagram.com/artistkuldeepsingh',
      btnText: 'View Instagram',
      badge: 'Official',
      iconColor: 'bg-pink-50 text-pink-700 border border-pink-200',
      icon: (
        <svg className="w-4 h-4 fill-pink-700" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      id: 'youtube',
      name: 'YouTube Channel',
      subtitle: '@artistkuldeepsingh • Painting timelapses & lectures',
      value: '@artistkuldeepsingh',
      href: 'https://youtube.com/@artistkuldeepsingh',
      btnText: 'Watch Videos',
      badge: 'Tutorials',
      iconColor: 'bg-red-50 text-red-700 border border-red-200',
      icon: (
        <svg className="w-4 h-4 fill-red-600" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      subtitle: '@artistkuldeep • Art announcements & thoughts',
      value: '@artistkuldeep',
      href: 'https://x.com/artistkuldeep',
      btnText: 'Follow on X',
      badge: 'Thoughts',
      iconColor: 'bg-stone-100 text-stone-900 border border-stone-200',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Luxury Floating Pill: Warm White with Gold Atelier Monogram */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md text-stone-800 shadow-xl border border-stone-300 hover:border-artisan-gold hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open Atelier Concierge"
        >
          {/* Subtle Atelier Monogram */}
          <div className="w-6 h-6 rounded-full bg-[#1A1816] text-artisan-gold flex items-center justify-center font-serif text-[11px] font-bold shadow-xs">
            K
          </div>

          <span className="font-serif text-xs font-semibold text-stone-900 tracking-wide">
            Contact Atelier
          </span>

          <span className="w-1.5 h-1.5 rounded-full bg-artisan-gold" />
        </button>
      </div>

      {/* Contact Concierge Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="relative bg-[#1A1816] text-white p-6 sm:p-7">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-artisan-gold/20 text-artisan-gold text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Atelier Concierge & Direct Connect</span>
              </div>
              <h3 className="font-serif text-2xl font-bold tracking-tight">
                Connect with Artist Kuldeep Singh
              </h3>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Direct channels for bespoke painting commissions, academy admissions, or general inquiries.
              </p>
            </div>

            {/* Channels List */}
            <div className="p-5 sm:p-6 space-y-2.5 max-h-[65vh] overflow-y-auto">
              {channels.map((ch) => (
                <a
                  key={ch.id}
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-artisan-gold shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${ch.iconColor} shrink-0 shadow-2xs`}>
                        {ch.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-stone-900 group-hover:text-artisan-crimson transition-colors">
                            {ch.name}
                          </h4>
                          {ch.badge && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                              {ch.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                          {ch.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-stone-600 group-hover:text-black">
                      <span className="hidden sm:inline text-[11px]">{ch.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Studio Note / Location Footer */}
            <div className="bg-stone-100/80 border-t border-stone-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-stone-500 text-[11px]">
              <span>📍 Atelier: Bheem Nagar, Erich, UP, India</span>
              <span className="font-medium text-stone-700">support@kuldeepsingh.art</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
