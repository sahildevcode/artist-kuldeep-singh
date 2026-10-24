import React, { useState } from 'react';
import { CheckCircle2, Sparkles, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';
import { useStudioData } from '../context/StudioDataContext';

interface AboutPageProps {
  setActivePage: (page: 'home' | 'about' | 'courses' | 'store') => void;
}

const SHOWCASE_SECTIONS = [
  {
    id: 'originals',
    title: 'Originals',
    description:
      'One-of-one artworks created by Artist Kuldeep Singh. Each original painting is a unique expression of story, culture, and craftsmanship created entirely by hand and available to collectors seeking a singular piece of art.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Artist Kuldeep Singh creating an original painting in studio',
    reverse: false,
    action: 'store',
    actionText: 'Explore Originals',
  },
  {
    id: 'prints',
    title: 'Prints',
    description:
      "These limited-edition prints make Artist Kuldeep Singh's work accessible while preserving the richness, detail, and emotion of the original piece.",
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Limited edition archival art print framed in architectural space',
    reverse: true,
    action: 'store',
    actionText: 'Browse Fine Art Prints',
  },
  {
    id: 'projects',
    title: 'Projects',
    description:
      'From luxury brand collaborations and immersive installations to custom commissions and experiential spaces, discover how art transforms environments, products, and cultural conversations.',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Curated artistic projects and architectural installations',
    reverse: false,
    action: null,
    actionText: null,
  },
  {
    id: 'exhibitions',
    title: 'Exhibitions',
    description:
      "A showcase of exhibitions, gallery presentations, and curated experiences that bring Artist Kuldeep Singh's artistic vision to life and invite viewers into his world of storytelling.",
    image: 'https://images.unsplash.com/photo-1531247448606-44fa13e90a6c?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Curated gallery exhibition with art collectors',
    reverse: true,
    action: null,
    actionText: null,
  },
];

const FAQS = [
  {
    question: 'Do the artworks come framed?',
    answer:
      'Yes, all original paintings come encased in custom museum-grade, hand-crafted timber frames with archival museum backing. For limited-edition prints, you may select our bespoke framing option or receive them safely rolled inside heavy-duty archival tubes.',
  },
  {
    question: 'How are artworks shipped?',
    answer:
      'Artworks are custom-crated with multi-layer shock absorption, moisture-resistant barriers, and corner protection. Each delivery is tracked end-to-end and insured for full commercial value during transit.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to collectors worldwide via DHL Express and FedEx International Priority with complete door-to-door tracking and white-glove customs clearance support.',
  },
  {
    question: 'Can I commission a custom piece or private project?',
    answer:
      'Artist Kuldeep Singh accepts a limited number of bespoke commissions each year for private residences, institutional collections, and architectural projects. Reach out via our inquiry form to discuss scale and timeline.',
  },
  {
    question: 'Are limited edition prints numbered and signed?',
    answer:
      'Every limited-edition print is individually numbered, hand-signed by Artist Kuldeep Singh, and accompanied by a serialized Certificate of Authenticity embossed with the atelier seal.',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({ setActivePage }) => {
  const { artistProfile, awards } = useStudioData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  const bioStory = Array.isArray(artistProfile?.bioStory) && artistProfile.bioStory.length > 0
    ? artistProfile.bioStory
    : [
        'Artist Kuldeep Singh has spent over a decade perfecting the discipline of classical European oil painting, anatomical draftsmanship, and pigment chemistry, bringing historical reverence into modern gallery spaces.',
        'In an era dominated by instantaneous digital algorithms, the act of grinding raw mineral earth into cold-pressed oil and applying it layer-by-layer to hand-stretched linen is an act of spiritual defiance.',
        'A painting should possess physical gravity. It should change as the sun moves across your room, revealing hidden glazes at twilight that were invisible at noon.'
      ];

  const awardsList = Array.isArray(awards) ? awards : [];

  return (
    <div className="relative z-10 pt-28 sm:pt-36 pb-28 min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* ARTIST PORTRAIT PAGE BACKGROUND (Adjusted for Clear Face Focus) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-0 left-0 right-0 h-[700px] sm:h-[880px] lg:h-[980px] overflow-hidden pointer-events-none -z-10">
        <img
          src="/images/artist-kuldeep-singh.jpg"
          alt="Artist Kuldeep Singh"
          className="w-full h-full object-cover object-[center_18%] sm:object-[center_15%] opacity-35 dark:opacity-25 filter contrast-110 brightness-100"
        />
        {/* Soft luxury atmospheric vignette for text clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/40 via-[#FAF8F5]/75 to-[#FAF8F5] dark:from-stone-950/50 dark:via-stone-950/85 dark:to-stone-950" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#FAF8F5]/30 to-[#FAF8F5] dark:via-stone-950/40 dark:to-stone-950" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. HERO HEADER */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="text-center max-w-3xl mx-auto space-y-4 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/70 dark:border-stone-800 shadow-soft-lux">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-artisan-gold/10 border border-artisan-gold/30 text-xs font-bold text-artisan-charcoal dark:text-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
            <span>{artistProfile?.yearsExperience || '12+'} of Devoted Artistic Practice</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#1A1816] dark:text-white leading-[1.1]">
            {artistProfile?.bioHeadline || 'A Life Dedicated to the Alchemy of Light, Oil & Form.'}
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg leading-relaxed">
            {bioStory[0] || 'Artist Kuldeep Singh has spent over a decade perfecting the discipline of classical fine art.'}
          </p>
        </div>

        {/* Large Visual Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12">
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-stone-900">
              <img
                src="/images/artist-kuldeep-singh.jpg"
                alt={artistProfile?.name || 'Artist Kuldeep Singh'}
                className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-xs uppercase tracking-widest text-artisan-gold font-bold block">
                  Studio Focus
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl mt-1">
                  {artistProfile?.sanctuaryTitle || 'The Sanctuary in Chelsea, New York'}
                </h3>
                <p className="text-xs text-stone-300">
                  {artistProfile?.sanctuaryLocation || 'Where centuries-old techniques meet boundless contemporary scale'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-stone-200 shadow-soft-lux space-y-4">
              <h3 className="font-serif font-bold text-2xl text-stone-900">
                The Creative Philosophy
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic">
                "{artistProfile?.philosophyQuote || 'Every stroke of oil on linen is a conversation between human patience and natural light.'}"
              </p>
              {bioStory.slice(1).map((para, i) => (
                <p key={i} className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {para}
                </p>
              ))}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-artisan-charcoal text-white font-serif flex items-center justify-center font-bold">
                  KS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{artistProfile?.name || 'Artist Kuldeep Singh'}</h4>
                  <p className="text-[11px] text-stone-500">{artistProfile?.title || 'Master Painter & Atelier Founder'}</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-stone-200">
                <span className="font-serif font-bold text-3xl text-artisan-crimson">{artistProfile?.yearsExperience || '12+'}</span>
                <p className="text-xs text-stone-600 font-medium mt-1">Years Continuous Practice</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-stone-200">
                <span className="font-serif font-bold text-3xl text-artisan-gold">{artistProfile?.artworksCount || '450+'}</span>
                <p className="text-xs text-stone-600 font-medium mt-1">Original Works in Collections</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. EDITORIAL SHOWCASE (ORIGINALS, PRINTS, PROJECTS, EXHIBITIONS) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20 sm:space-y-32">
        {SHOWCASE_SECTIONS.map((sec) => (
          <div
            key={sec.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
          >
            {/* Image Column */}
            <div className={sec.reverse ? 'order-1 md:order-2' : 'order-1 md:order-1'}>
              <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-stone-200/80 group bg-stone-100">
                <img
                  src={sec.image}
                  alt={sec.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Text Column */}
            <div className={sec.reverse ? 'order-2 md:order-1' : 'order-2 md:order-2'}>
              <div className="max-w-lg space-y-4">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
                  {sec.title}
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
                  {sec.description}
                </p>
                {sec.action && sec.actionText && (
                  <div className="pt-2">
                    <button
                      onClick={() => setActivePage(sec.action as any)}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-artisan-crimson transition-colors cursor-pointer border-b border-stone-900 hover:border-artisan-crimson pb-0.5"
                    >
                      <span>{sec.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FAQS SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 text-center mb-10 sm:mb-14 tracking-tight">
          FAQs
        </h2>

        <div className="border-t border-stone-200 divide-y divide-stone-200">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-5 sm:py-6 flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-sans text-sm sm:text-base text-stone-900 font-normal group-hover:text-stone-600 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-stone-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-6 pr-6 text-stone-600 text-xs sm:text-sm leading-relaxed font-sans animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. AWARDS & INSTITUTIONAL RECOGNITION */}
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
            {awardsList.map((award, idx) => (
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
      {/* 5. MATERIALS & ATELIER CRAFT */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson">
              Material Purity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Why an Atelier Kuldeep Singh Painting Endures Centuries.
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
