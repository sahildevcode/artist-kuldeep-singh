import React, { useState } from 'react';
import { CheckCircle2, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
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
    image: '/images/buddha-tree-of-life-painting.jpg',
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
    image: '/images/abstract-spiritual-canvas-print.jpg',
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
    image: '/images/abstract-woman-leopard-eagle-painting.jpg',
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
    image: '/images/abstract-face-contemporary-painting.jpg',
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
  const { awards } = useStudioData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  const awardsList = Array.isArray(awards) ? awards : [];

  return (
    <div className="relative w-full min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO ARTIST IMAGE (Mobile Native Flow, Desktop Sticky Curtain) */}
      {/* ------------------------------------------------------------- */}
      <section className="relative md:sticky md:top-0 w-full h-[75vh] sm:h-[88vh] md:h-screen min-h-[500px] max-h-[1080px] overflow-hidden bg-[#0E0C0A] select-none z-0 transform-gpu will-change-transform">
        {/* Sharp High-Res Portrait - 100% width and height, perfectly centered on face */}
        <img
          src="/images/artist-kuldeep-singh.jpg"
          alt="Artist Kuldeep Singh"
          className="w-full h-full object-cover object-[center_55%] sm:object-[center_52%]"
        />

        {/* Subtle top & bottom atmospheric vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. OVERLAY PAGE CONTENT (0 Lag on Mobile, Silky on Desktop)    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 -mt-8 sm:-mt-14 md:-mt-20 bg-[#FDFBF7] dark:bg-[#0E0C0A] rounded-t-[2rem] sm:rounded-t-[3rem] shadow-[0_-10px_25px_rgba(0,0,0,0.15)] border-t border-stone-200/60 dark:border-stone-800/60 pb-28 pt-8 sm:pt-14 transform-gpu will-change-transform">

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
    </div>
  );
};
