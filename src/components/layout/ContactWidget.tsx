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
      value: '+91 8858060101',
      href: 'https://wa.me/918858060101?text=Hello%20Artist%20Kuldeep%20Singh%2C%20I%20am%20reaching%20out%20from%20your%20website%20regarding%20artworks%20and%20masterclasses.',
      btnText: 'Open Chat',
      badge: 'Quickest Response',
      iconColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      icon: (
        <svg className="w-4 h-4 fill-emerald-700" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      )
    },
    {
      id: 'phone',
      name: 'Direct Phone Call',
      subtitle: '+91 8858060101 (Mon - Sat • 10 AM - 7 PM IST)',
      value: '+91 8858060101',
      href: 'tel:+918858060101',
      btnText: 'Call Studio',
      badge: 'Voice Call',
      iconColor: 'bg-stone-100 text-stone-800 border border-stone-200',
      icon: <Phone className="w-4 h-4 text-stone-800" />
    },
    {
      id: 'instagram',
      name: 'Instagram Gallery',
      subtitle: '@artist_kuldeep_singh • Studio WIP, reels & new releases',
      value: '@artist_kuldeep_singh',
      href: 'https://www.instagram.com/artist_kuldeep_singh?exln=dXA3Znl1bXcyeWw5',
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
      href: 'https://youtube.com/@artistkuldeepsingh?si=6Jt3uFkpQUsRKlum',
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
      {/* Luxury Floating Pill: Compact, Warm White with Gold Atelier Monogram */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-md text-stone-800 shadow-lg border border-stone-300 hover:border-artisan-gold hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Contact Us"
        >
          {/* Subtle Atelier Monogram */}
          <div className="w-5 h-5 rounded-full bg-[#1A1816] text-artisan-gold flex items-center justify-center font-serif text-[10px] font-bold shadow-xs">
            K
          </div>

          <span className="font-serif text-[11px] sm:text-xs font-semibold text-stone-900 tracking-wide">
            Contact Us
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
              <span>📍 Atelier & Studio: Delhi, India</span>
              <span className="font-medium text-stone-700">artistkuldeepsingh26@gmail.com</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
