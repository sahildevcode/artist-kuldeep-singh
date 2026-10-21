import React, { useState } from 'react';
import { CheckCircle2, Sparkles, MapPin, ArrowRight, ChevronDown, Palette } from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';
import { useStudioData } from '../context/StudioDataContext';

interface AboutPageProps {
  setActivePage: (page: 'home' | 'about' | 'courses' | 'store') => void;
}

const SHOWCASE_SECTIONS = [
  {
    id: 'originals',
    title: 'Originals',
    badge: 'Masterwork Canvases',
    description:
      'One-of-one artworks created by Artist Kuldeep Singh. Each original painting is a unique expression of story, culture, and craftsmanship created entirely by hand on hand-stretched linen, available to collectors seeking a singular piece of art.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Artist Kuldeep Singh creating an original painting in studio',
    reverse: false,
    action: 'store',
    actionText: 'Explore Originals in Store',
  },
  {
    id: 'prints',
    title: 'Limited Edition Prints',
    badge: 'Archival Giclée',
    description:
      "These museum-grade, limited-edition prints make Artist Kuldeep Singh's work accessible while preserving the richness, deep tonal range, and raw emotion of the original piece. Individually signed and numbered.",
    image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Limited edition archival art print framed in architectural space',
    reverse: true,
    action: 'store',
    actionText: 'Browse Fine Art Prints',
  },
  {
    id: 'projects',
    title: 'Architectural & Custom Projects',
    badge: 'Bespoke Scale',
    description:
      'From luxury brand collaborations and immersive spatial installations to monumental private commissions, discover how art transforms architectural environments and cultural dialogues.',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'Curated artistic projects and architectural installations',
    reverse: false,
    action: null,
    actionText: null,
  },
  {
    id: 'exhibitions',
    title: 'Museum Exhibitions & Retrospectives',
    badge: 'Worldwide Shows',
    description:
      "A showcase of international exhibitions, gallery presentations, and curated experiences across London, Paris, New York, and Delhi that bring Artist Kuldeep Singh's artistic vision to life.",
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
    <div className="relative w-full bg-[#0A0908] text-stone-100 overflow-x-hidden">
      {/* ============================================================= */}
      {/* LAYER 0: FULL-WIDTH & FULL-HEIGHT STICKY HERO BACKGROUND      */}
      {/* (Portrait of Artist Kuldeep Singh stays fixed behind scroll)  */}
      {/* ============================================================= */}
      <section className="sticky top-0 w-full h-screen min-h-[640px] max-h-[1080px] z-0 flex flex-col justify-between overflow-hidden select-none">
        {/* Dual-Layer Cinematic Portrait Background */}
        <div className="absolute inset-0">
          {/* Layer A: Ambient Color Glow */}
          <img
            src="/images/artist-kuldeep-singh.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-35 scale-110 pointer-events-none"
          />
          {/* Layer B: Crisp Full-Height Portrait (Positioned for perfect head/hair framing) */}
          <img
            src="/images/artist-kuldeep-singh.jpg"
            alt={artistProfile?.name || 'Artist Kuldeep Singh'}
            className="absolute inset-0 w-full h-full object-cover object-[center_22%] sm:object-[center_26%] filter contrast-[1.03]"
          />
          {/* Layer C: Cinematic Vignettes & Dramatic Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/75 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/70 pointer-events-none" />
        </div>

        {/* Top Spacer to account for fixed navbar */}
        <div className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-semibold text-artisan-gold tracking-wider uppercase shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
            <span>{artistProfile?.yearsExperience || '12+'} of Devoted Fine Art Practice</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-stone-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Official Atelier Profile</span>
          </div>
        </div>

        {/* Bottom Hero Typography & Scroll Callout */}
        <div className="relative z-10 pb-16 sm:pb-24 px-4 sm:px-8 max-w-5xl mx-auto w-full text-center space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <span className="font-serif italic font-light text-base sm:text-xl md:text-2xl text-stone-300 tracking-wider block">
              The Portrait & Legacy of
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white uppercase drop-shadow-2xl">
              KULDEEP <span className="text-artisan-gold font-light">SINGH</span>
            </h1>
          </div>

          <p className="font-serif italic text-base sm:text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            "{artistProfile?.bioHeadline || 'A Life Dedicated to the Alchemy of Light, Oil & Form.'}"
          </p>

          <p className="text-xs sm:text-sm text-stone-400 font-sans tracking-widest uppercase max-w-xl mx-auto">
            Master Oil Painter • Atelier Académie Founder • Exhibited Internationally
          </p>

          {/* Gentle Animated Scroll Indicator */}
          <div className="pt-4 flex flex-col items-center justify-center gap-2 animate-bounce cursor-default">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-artisan-gold font-bold bg-black/70 px-4 py-1 rounded-full border border-artisan-gold/30 backdrop-blur-md shadow-lg">
              Scroll to Explore Chapters ↓
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* LAYER 1 (PAGE 01): THE CREATIVE PHILOSOPHY & CLASSICAL FORM   */}
      {/* (Slides UP directly over the background photo)                */}
      {/* ============================================================= */}
      <section className="relative z-10 -mt-10 sm:-mt-16 rounded-t-[36px] sm:rounded-t-[52px] bg-[#FAF8F5] dark:bg-[#121110] text-[#1A1816] dark:text-[#FDFBF7] shadow-[0_-25px_60px_rgba(0,0,0,0.6)] border-t border-white/60 dark:border-stone-800 transition-all duration-300">
        {/* Page Tab Header */}
        <div className="pt-5 pb-4 px-6 sm:px-10 flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-artisan-crimson animate-pulse" />
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-stone-600 dark:text-stone-400 font-bold">
              Page 01 of 05 • The Philosophy & Origins
            </span>
          </div>
          <div className="w-16 h-1 rounded-full bg-stone-300 dark:bg-stone-700 hidden sm:block" />
          <span className="text-[11px] sm:text-xs font-serif italic text-stone-500">
            Atelier Discipline
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson block">
              Chapter I • Creative Roots
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.15]">
              {artistProfile?.bioHeadline || 'A Life Dedicated to the Alchemy of Light, Oil & Form.'}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              {bioStory[0] || 'Artist Kuldeep Singh has spent over a decade perfecting the discipline of classical fine art.'}
            </p>
          </div>

          {/* Visual Grid & Philosophy */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Visual Feature */}
            <div className="lg:col-span-7 relative group">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
                <img
                  src={artistProfile?.studioImage || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop'}
                  alt={artistProfile?.name || 'Artist Kuldeep Singh Atelier'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-artisan-gold font-bold block">
                    Studio Focus & Sanctuary
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl mt-1">
                    {artistProfile?.sanctuaryTitle || 'The Sanctuary in Chelsea, New York'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1">
                    {artistProfile?.sanctuaryLocation || 'Where centuries-old techniques meet boundless contemporary scale'}
                  </p>
                </div>
              </div>
            </div>

            {/* Philosophy Text & Metrics */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-7 sm:p-8 rounded-3xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-soft-lux space-y-4">
                <div className="flex items-center gap-2 text-artisan-crimson">
                  <Palette className="w-4 h-4" />
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                    The Creative Philosophy
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic border-l-2 border-artisan-gold pl-3">
                  "{artistProfile?.philosophyQuote || 'Every stroke of oil on linen is a conversation between human patience and natural light.'}"
                </p>
                {bioStory.slice(1).map((para, i) => (
                  <p key={i} className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {para}
                  </p>
                ))}
                <div className="pt-2 flex items-center gap-3 border-t border-stone-100 dark:border-stone-800">
                  <div className="w-10 h-10 rounded-full bg-stone-900 text-artisan-gold font-serif flex items-center justify-center font-bold border border-artisan-gold/40">
                    KS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">{artistProfile?.name || 'Artist Kuldeep Singh'}</h4>
                    <p className="text-[11px] text-stone-500">{artistProfile?.title || 'Master Painter & Atelier Founder'}</p>
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <span className="font-serif font-bold text-3xl text-artisan-crimson">{artistProfile?.yearsExperience || '12+'}</span>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-1">Years Continuous Practice</p>
                </div>
                <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <span className="font-serif font-bold text-3xl text-artisan-gold">{artistProfile?.artworksCount || '450+'}</span>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mt-1">Original Works in Collections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* LAYER 2 (PAGE 02): CURATED PORTFOLIOS & EDITORIAL SHOWCASE    */}
      {/* (Slides UP directly over Page 01)                             */}
      {/* ============================================================= */}
      <section className="relative z-20 -mt-10 sm:-mt-16 rounded-t-[36px] sm:rounded-t-[52px] bg-[#0E0D0C] text-white shadow-[0_-25px_60px_rgba(0,0,0,0.7)] border-t border-artisan-gold/30 transition-all duration-300">
        {/* Page Tab Header */}
        <div className="pt-5 pb-4 px-6 sm:px-10 flex items-center justify-between border-b border-white/10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-artisan-gold" />
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-artisan-gold font-bold">
              Page 02 of 05 • Curated Portfolios
            </span>
          </div>
          <div className="w-16 h-1 rounded-full bg-stone-700 hidden sm:block" />
          <span className="text-[11px] sm:text-xs font-serif italic text-stone-400">
            Originals & Projects
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 sm:space-y-32">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-gold block">
              Chapter II • The Body of Work
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Canvases, Prints & Monumental Spaces
            </h2>
            <p className="text-stone-400 text-sm sm:text-base">
              A curated catalog spanning private collector canvases, archival signed prints, and architectural commissions.
            </p>
          </div>

          {SHOWCASE_SECTIONS.map((sec) => (
            <div
              key={sec.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              {/* Image Column */}
              <div className={sec.reverse ? 'order-1 md:order-2' : 'order-1 md:order-1'}>
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/15 group bg-stone-900">
                  <img
                    src={sec.image}
                    alt={sec.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-artisan-gold uppercase tracking-wider border border-white/10">
                    {sec.badge}
                  </div>
                </div>
              </div>

              {/* Text Column */}
              <div className={sec.reverse ? 'order-2 md:order-1' : 'order-2 md:order-2'}>
                <div className="max-w-lg space-y-5">
                  <span className="text-xs uppercase tracking-widest text-artisan-gold font-bold block">
                    {sec.badge}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
                    {sec.title}
                  </h3>
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
                    {sec.description}
                  </p>
                  {sec.action && sec.actionText && (
                    <div className="pt-2">
                      <button
                        onClick={() => setActivePage(sec.action as any)}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-artisan-gold transition-colors cursor-pointer border-b border-artisan-gold/60 hover:border-artisan-gold pb-1"
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
        </div>
      </section>

      {/* ============================================================= */}
      {/* LAYER 3 (PAGE 03): RENAISSANCE MATERIAL INTEGRITY & ALCHEMY    */}
      {/* (Slides UP directly over Page 02)                             */}
      {/* ============================================================= */}
      <section className="relative z-30 -mt-10 sm:-mt-16 rounded-t-[36px] sm:rounded-t-[52px] bg-[#F7F4EE] dark:bg-[#161412] text-[#1A1816] dark:text-[#FDFBF7] shadow-[0_-25px_60px_rgba(0,0,0,0.6)] border-t border-white/70 dark:border-stone-800 transition-all duration-300">
        {/* Page Tab Header */}
        <div className="pt-5 pb-4 px-6 sm:px-10 flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-stone-600 dark:text-stone-400 font-bold">
              Page 03 of 05 • Material Purity & Craft
            </span>
          </div>
          <div className="w-16 h-1 rounded-full bg-stone-300 dark:bg-stone-700 hidden sm:block" />
          <span className="text-[11px] sm:text-xs font-serif italic text-stone-500">
            Archival Longevity
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson">
                Chapter III • Material Alchemy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
                Why an Atelier Kuldeep Singh Painting Endures Centuries.
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                Every canvas created in the studio follows archival conservation protocols pioneered by Renaissance masters, ensuring structural integrity and luminous permanence.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">100% Belgian Claessens Linen</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Woven from pure flax, double-sized with rabbit skin glue and lead-oil ground.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">Hand-Ground Mineral Pigments</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Real Lapis Lazuli, French Ochres, and Cadmium mixed with cold-pressed walnut oil.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">Natural Dammar Resin & Beeswax Varnish</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Breathable protective film shielding against UV degradation and environmental dust.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <MagneticButton
                  onClick={() => setActivePage('store')}
                  variant="primary"
                  size="md"
                >
                  <span>Acquire an Original Artwork</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </MagneticButton>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop"
                  alt="Pigment mixing in atelier"
                  className="rounded-3xl aspect-[4/5] object-cover shadow-xl border border-stone-200 dark:border-stone-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop"
                  alt="Classical drawing in progress"
                  className="rounded-3xl aspect-[4/5] object-cover shadow-xl border border-stone-200 dark:border-stone-800 mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* LAYER 4 (PAGE 04): HONORS, ACCOLADES & EXHIBITION TIMELINE    */}
      {/* (Slides UP directly over Page 03)                             */}
      {/* ============================================================= */}
      <section className="relative z-40 -mt-10 sm:-mt-16 rounded-t-[36px] sm:rounded-t-[52px] bg-[#141210] text-white shadow-[0_-25px_60px_rgba(0,0,0,0.7)] border-t border-artisan-gold/25 transition-all duration-300">
        {/* Page Tab Header */}
        <div className="pt-5 pb-4 px-6 sm:px-10 flex items-center justify-between border-b border-white/10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-amber-300 font-bold">
              Page 04 of 05 • Accolades & Honors
            </span>
          </div>
          <div className="w-16 h-1 rounded-full bg-stone-700 hidden sm:block" />
          <span className="text-[11px] sm:text-xs font-serif italic text-stone-400">
            Global Recognition
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-gold">
              Chapter IV • International Accolades
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Gold Medals & Juried Honors
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm">
              Recognized by prestigious European and Indian art institutions across twelve continuous years of practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awardsList.map((award, idx) => (
              <div
                key={idx}
                className="p-6 bg-stone-900/90 rounded-3xl border border-white/15 shadow-xl flex flex-col justify-between space-y-4 hover:-translate-y-1.5 transition-all duration-300 group hover:border-artisan-gold/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-artisan-gold">{award.year}</span>
                  <span className="text-[10px] font-bold uppercase bg-stone-800 text-stone-300 px-2.5 py-0.5 rounded-full border border-white/10">
                    {award.badgeText}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-lg text-white group-hover:text-artisan-gold transition-colors">
                    {award.award}
                  </h4>
                  <p className="text-xs text-stone-400">{award.institution}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-artisan-gold" />
                  <span>{award.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* LAYER 5 (PAGE 05): COLLECTOR GUIDE, FAQS & PRIVATE VIEWINGS   */}
      {/* (Slides UP directly over Page 04 - Grand Finale)              */}
      {/* ============================================================= */}
      <section className="relative z-50 -mt-10 sm:-mt-16 rounded-t-[36px] sm:rounded-t-[52px] bg-white dark:bg-[#0B0A09] text-[#1A1816] dark:text-[#FDFBF7] shadow-[0_-30px_70px_rgba(0,0,0,0.8)] border-t border-stone-200 dark:border-stone-800 pb-36 transition-all duration-300">
        {/* Page Tab Header */}
        <div className="pt-5 pb-4 px-6 sm:px-10 flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-artisan-crimson" />
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-stone-600 dark:text-stone-400 font-bold">
              Page 05 of 05 • Collector Guide & FAQs
            </span>
          </div>
          <div className="w-16 h-1 rounded-full bg-stone-300 dark:bg-stone-700 hidden sm:block" />
          <span className="text-[11px] sm:text-xs font-serif italic text-stone-500">
            Collector Advisory
          </span>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
          <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson">
              Chapter V • Collector Inquiries
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Clear guidance on packaging, framing, provenance certificates, and global insured shipping.
            </p>
          </div>

          <div className="border-t border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
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
                    <span className="font-sans text-sm sm:text-base text-stone-900 dark:text-stone-100 font-semibold group-hover:text-artisan-crimson transition-colors pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-500 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-artisan-crimson' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-6 pr-6 text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed font-sans animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Final Call to Action Box */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-stone-900 text-white border border-artisan-gold/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-artisan-gold/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-artisan-gold block">
                Bespoke Acquisition & Private Viewing
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold">
                Experience Original Canvases in Person
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Connect directly with the atelier for private viewings, institutional loans, or to explore currently available oil paintings and masterclasses.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <MagneticButton
                  onClick={() => setActivePage('store')}
                  variant="gold"
                  size="md"
                >
                  <span>Explore Artworks Store</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </MagneticButton>
                <MagneticButton
                  onClick={() => setActivePage('courses')}
                  variant="outline"
                  size="md"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  <span>Explore Académie</span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
