import React from 'react';
import { CheckCircle2, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { TIMELINE, AWARDS } from '../data/achievements';
import { MagneticButton } from '../components/ui/MagneticButton';

interface AboutPageProps {
  setActivePage: (page: 'home' | 'about' | 'courses' | 'store') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActivePage }) => {
  return (
    <div className="relative z-10 pt-28 sm:pt-36 pb-28">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO HEADER */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-artisan-gold/10 border border-artisan-gold/30 text-xs font-bold text-artisan-charcoal">
            <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
            <span>12 Years of Devoted Artistic Practice (2014 – 2026)</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#1A1816] leading-[1.1]">
            A Life Dedicated to the Alchemy of Light, Oil & Form.
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Julian Vance has spent over a decade perfecting the discipline of classical European oil painting, anatomical draftsmanship, and pigment chemistry, bringing historical reverence into modern gallery spaces.
          </p>
        </div>

        {/* Large Visual Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12">
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop"
                alt="Julian Vance Studio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-xs uppercase tracking-widest text-artisan-gold font-bold block">
                  Studio Focus
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl mt-1">
                  The Sanctuary in Chelsea, New York
                </h3>
                <p className="text-xs text-stone-300">
                  Where centuries-old techniques meet boundless contemporary scale
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-stone-200 shadow-soft-lux space-y-4">
              <h3 className="font-serif font-bold text-2xl text-stone-900">
                The Creative Philosophy
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                "In an era dominated by instantaneous digital algorithms, the act of grinding raw mineral earth into cold-pressed oil and applying it layer-by-layer to hand-stretched linen is an act of spiritual defiance.
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                A painting should possess physical gravity. It should change as the sun moves across your room, revealing hidden glazes at twilight that were invisible at noon."
              </p>
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-artisan-charcoal text-white font-serif flex items-center justify-center font-bold">
                  JV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Julian Vance</h4>
                  <p className="text-[11px] text-stone-500">Master Painter & Atelier Founder</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-stone-200">
                <span className="font-serif font-bold text-3xl text-artisan-crimson">12+</span>
                <p className="text-xs text-stone-600 font-medium mt-1">Years Continuous Practice</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-stone-200">
                <span className="font-serif font-bold text-3xl text-artisan-gold">450+</span>
                <p className="text-xs text-stone-600 font-medium mt-1">Original Works in Collections</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. THE 12-YEAR TIMELINE (2014 TO 2026) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson">
            Evolution of Mastery
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            The 12-Year Atelier Journey
          </h2>
          <p className="text-xs text-stone-500">
            A chronological timeline of milestones, residencies, museum showcases, and breakthroughs.
          </p>
        </div>

        <div className="relative border-l-2 border-stone-200 ml-4 sm:ml-32 space-y-12">
          {TIMELINE.map((item, idx) => (
            <div key={idx} className="relative pl-8 sm:pl-10 group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-artisan-crimson group-hover:scale-125 transition-transform" />

              {/* Year Stamp on left for desktop */}
              <div className="sm:absolute sm:-left-36 sm:top-1 text-xs font-bold text-artisan-crimson sm:text-right sm:w-28 mb-1 sm:mb-0">
                {item.year}
              </div>

              {/* Milestone Card */}
              <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 space-y-3 group-hover:border-stone-400">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {item.milestoneType}
                  </span>
                  {item.highlightMetric && (
                    <span className="text-[11px] font-semibold text-artisan-ochre bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      ★ {item.highlightMetric}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900">
                  {item.title}
                </h3>

                <p className="text-xs text-artisan-gold font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.roleOrLocation}
                </p>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. AWARDS & INSTITUTIONAL RECOGNITION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-stone-100/60 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-gold">
              Honors & Accolades
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              International Awards & Medals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AWARDS.map((award, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-artisan-crimson">{award.year}</span>
                  <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                    {award.badgeText}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-stone-900">
                    {award.award}
                  </h4>
                  <p className="text-xs text-stone-500">{award.institution}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{award.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. MATERIALS & ATELIER CRAFT */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson">
              Material Purity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Why an Atelier Vance Painting Endures Centuries.
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every canvas created in the studio follows archival conservation protocols pioneered by Renaissance masters, ensuring structural integrity and luminous permanence.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">100% Belgian Claessens Linen</h4>
                  <p className="text-xs text-stone-500">Woven from pure flax, double-sized with rabbit skin glue and lead-oil ground.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Hand-Ground Mineral Pigments</h4>
                  <p className="text-xs text-stone-500">Real Lapis Lazuli, French Ochres, and Cadmium mixed with cold-pressed walnut oil.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Natural Dammar Resin & Beeswax Varnish</h4>
                  <p className="text-xs text-stone-500">Breathable protective film shielding against UV degradation and environmental dust.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <MagneticButton
                onClick={() => setActivePage('store')}
                variant="primary"
                size="md"
              >
                <span>Acquire a Painting</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop"
                alt="Pigment mixing"
                className="rounded-3xl aspect-[4/5] object-cover shadow-lg border border-stone-200"
              />
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop"
                alt="Studio drawing"
                className="rounded-3xl aspect-[4/5] object-cover shadow-lg border border-stone-200 mt-8"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
