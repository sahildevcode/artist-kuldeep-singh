import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, ArrowRight, ChevronDown, Award as AwardIcon, Trophy, Medal, Star } from 'lucide-react';
import { MagneticButton } from '../components/ui/MagneticButton';
import { useStudioData } from '../context/StudioDataContext';

interface AboutPageProps {
  setActivePage: (page: 'home' | 'about' | 'courses' | 'store') => void;
}

interface AboutSectionItem {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  reverse: boolean;
  action?: 'store' | null;
  actionText?: string | null;
}

const SHOWCASE_SECTIONS: AboutSectionItem[] = [
  {
    id: 'about-the-artist',
    number: '01',
    title: 'ABOUT THE ARTIST',
    paragraphs: [
      'I am Kuldeep Singh (b. 1998), an Indian contemporary visual artist. My work explores the profound relationship between spirituality, human consciousness, and cultural heritage. Rooted in the philosophical traditions of India, my practice moves beyond the visible, transforming painting into a contemplative exploration of existence, identity, and inner awareness.',
      "I hold a Bachelor of Fine Arts (B.F.A.) from Bundelkhand University and a Master of Fine Arts (M.F.A.) in Painting from Raja Mansingh Tomar Music & Arts University, Gwalior. Drawing upon my academic training and India's rich artistic traditions, I have developed a distinctive visual language that brings traditional symbolism into dialogue with contemporary expression."
    ],
    image: '/images/about-section-01-custom.jpg',
    imageAlt: 'Artist Kuldeep Singh creating artwork in studio',
    reverse: false,
    action: 'store',
    actionText: 'Explore Collection',
  },
  {
    id: 'artistic-vision',
    number: '02',
    title: 'ARTISTIC VISION & PHILOSOPHY',
    paragraphs: [
      'For me, art is a journey inward — a meeting point between the material world and the unseen dimensions of human consciousness. Inspired by Indian philosophy, spiritual narratives, and ancient symbolism, my work reflects on the nature of the self, the dissolution of ego, and the search for a deeper understanding of existence.',
      'My signature series, Rahyasya and Beyond the Horizon, explore the tension between worldly attachments and spiritual aspirations. Through evocative imagery and contemplative compositions, these works invite viewers to look beyond appearances and engage with questions of identity, transformation, and inner awakening.',
      'Working across oil , acrylic, charcoal, pen art, watercolour, and traditional Indian rangoli, I explore diverse ways of translating philosophical ideas and cultural memories into visual form. My practice brings together expressive mark-making, intricate detail, fluidity, and symbolism in an evolving dialogue between heritage and contemporary art.'
    ],
    image: '/images/abstract-spiritual-canvas-print.jpg',
    imageAlt: 'Artistic Vision and Spiritual Philosophy Art by Kuldeep Singh',
    reverse: true,
    action: null,
    actionText: null,
  },
  {
    id: 'exhibitions-presence',
    number: '03',
    title: 'EXHIBITIONS & INTERNATIONAL PRESENCE',
    paragraphs: [
      "My artistic journey has connected my practice with art venues and cultural platforms in India and internationally. My exhibitions and artistic engagements include AIFACS Art Gallery, New Delhi; State Gallery of Arts, Hyderabad; Kannauj Museum, Uttar Pradesh; Lighthouse Gallery, Puerto Rico; and Tons of Rock, Norway.",
      'Through these engagements, I seek to contribute to cross-cultural dialogue, bringing perspectives shaped by Indian philosophy and artistic heritage into conversation with diverse audiences.'
    ],
    image: '/images/abstract-woman-leopard-eagle-painting.jpg',
    imageAlt: 'Exhibitions and International Presence',
    reverse: false,
    action: null,
    actionText: null,
  },
  {
    id: 'awards-recognition',
    number: '04',
    title: 'AWARDS, RECOGNITION & CONTINUING JOURNEY',
    paragraphs: [
      'My artistic achievements include The Kala Gaurav Award and The Raja Ravi Verma Award, along with recognition from the Rajya Lalit Kala Academy.',
      'My journey continues through creative exploration, exhibitions, live art demonstrations, and collaborative initiatives. Guided by an enduring interest in spirituality, consciousness, and cultural expression, I seek to create works that encourage reflection beyond the surface of the image.',
      'For me, art is not merely an act of seeing; it is an invitation to feel, question, and discover what lies within.'
    ],
    image: '/images/abstract-face-contemporary-painting.jpg',
    imageAlt: 'Awards, Recognition & Continuing Journey of Kuldeep Singh',
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
  const { awards, artistProfile } = useStudioData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [flippedCardIdx, setFlippedCardIdx] = useState<number | null>(null);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroImgRef.current && heroImgRef.current.complete) {
      setIsHeroLoaded(true);
    }
  }, []);

  // IntersectionObserver for 60FPS scroll-triggered animations
  useEffect(() => {
    const rootEl = containerRef.current;
    if (!rootEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = rootEl.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  const awardsList = Array.isArray(awards) ? awards : [];

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO ARTIST BANNER (Full 100% Width, Responsive Portrait for Mobile & Landscape for Desktop) */}
      {/* ------------------------------------------------------------- */}
      <section className="relative w-full bg-[#0E0C0A] select-none z-0 pt-16 sm:pt-20 overflow-hidden">
        <div className="w-full relative overflow-hidden bg-[#0E0C0A]">
          <picture className="w-full block">
            <source media="(max-width: 639px)" srcSet="/images/artist-hero-banner-mobile.png" />
            <img
              ref={heroImgRef}
              src={artistProfile?.aboutHeroBanner || "/images/artist-hero-banner.png"}
              alt="Artist Kuldeep Singh — Official Atelier Banner"
              onLoad={() => setIsHeroLoaded(true)}
              className={`w-full h-auto block select-none animate-hero-fade animate-hero-zoom transition-all duration-1000 ease-out ${
                isHeroLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ imageRendering: 'auto' }}
            />
          </picture>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. OVERLAY PAGE CONTENT (Slides UP OVER Image on Mobile & Desktop) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 bg-[#FDFBF7] dark:bg-[#0E0C0A] border-t border-stone-200/60 dark:border-stone-800/60 pb-28 pt-12 sm:pt-20">

      {/* ------------------------------------------------------------- */}
      {/* 2. EDITORIAL SHOWCASE (ORIGINALS, PRINTS, PROJECTS, EXHIBITIONS) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20 sm:space-y-32">
        {SHOWCASE_SECTIONS.map((sec, idx) => {
          const dynamicImage =
            idx === 0
              ? (artistProfile?.aboutSection01Image || sec.image)
              : idx === 1
              ? (artistProfile?.aboutSection02Image || sec.image)
              : idx === 2
              ? (artistProfile?.aboutSection03Image || sec.image)
              : (artistProfile?.aboutSection04Image || sec.image);

          const dynamicTitle =
            idx === 0
              ? (artistProfile?.aboutSection01Title || sec.title)
              : idx === 1
              ? (artistProfile?.aboutSection02Title || sec.title)
              : idx === 2
              ? (artistProfile?.aboutSection03Title || sec.title)
              : (artistProfile?.aboutSection04Title || sec.title);

          const customRawText =
            idx === 0
              ? artistProfile?.aboutSection01Text
              : idx === 1
              ? artistProfile?.aboutSection02Text
              : idx === 2
              ? artistProfile?.aboutSection03Text
              : artistProfile?.aboutSection04Text;

          const dynamicParagraphs = customRawText && customRawText.trim()
            ? customRawText.split('\n').map(p => p.trim()).filter(Boolean)
            : sec.paragraphs;

          return (
            <div
              key={sec.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              {/* Image Column */}
              <div className={`${sec.reverse ? 'order-1 md:order-2' : 'order-1 md:order-1'} scroll-reveal`}>
                <div className="relative aspect-[3/4] sm:aspect-[4/5] max-h-[580px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-stone-200/80 group bg-stone-100 flex items-center justify-center gallery-card-hover">
                  <img
                    src={dynamicImage}
                    alt={sec.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className={`${sec.reverse ? 'order-2 md:order-1' : 'order-2 md:order-2'} scroll-reveal scroll-reveal-delay-1`}>
                <div className="max-w-xl space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-artisan-gold tracking-wider">
                      {sec.number}
                    </span>
                    <div className="h-6 w-[1.5px] bg-artisan-gold/40" />
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-semibold tracking-wider uppercase text-stone-900 dark:text-stone-100">
                      {dynamicTitle}
                    </h2>
                  </div>

                  <div className="space-y-4 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans font-light">
                    {dynamicParagraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {sec.action && sec.actionText && (
                    <div className="pt-2">
                      <button
                        onClick={() => setActivePage(sec.action as any)}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 hover:text-artisan-crimson transition-colors cursor-pointer border-b border-stone-900 dark:border-stone-100 hover:border-artisan-crimson pb-0.5"
                      >
                        <span>{sec.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FAQS SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-reveal">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 dark:text-stone-100 text-center mb-10 sm:mb-14 tracking-tight">
          FAQs
        </h2>

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
                  <span className="font-sans text-sm sm:text-base text-stone-900 dark:text-stone-100 font-normal group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 dark:text-stone-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-stone-900 dark:text-stone-100' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pb-6 pr-6 text-stone-600 dark:text-stone-300 text-xs sm:text-sm leading-relaxed font-sans animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. AWARDS & INSTITUTIONAL RECOGNITION (LUXURY ACHIEVEMENTS)   */}
      {/* ------------------------------------------------------------- */}
      <section className="py-24 sm:py-32 bg-[#FAF9F7] dark:bg-[#08090D] border-y border-stone-200/80 dark:border-stone-800/80 transition-colors duration-500 relative overflow-hidden scroll-reveal">
        {/* Subtle Ambient Background Gradients for Depth */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-artisan-gold/10 border border-artisan-gold/30 text-xs font-bold uppercase tracking-[0.22em] text-artisan-gold">
              <Trophy className="w-3.5 h-3.5 text-artisan-gold" />
              <span>Honors & Accolades</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              International Awards & Medals
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
              Global juried distinctions celebrating classical mastery, figurative innovation, and fine art excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
            {awardsList.map((award, idx) => {
              // Categorize awards for personalized chromatic aura
              const isGoldMajor = award.badgeText?.toLowerCase().includes('highest') || idx === 0;
              const isBlueFirst = award.badgeText?.toLowerCase().includes('1st') || idx === 1;
              const isPurpleMention = award.badgeText?.toLowerCase().includes('mention') || idx === 2;

              // Glowing Badge Icon Selection
              const AwardBadgeIcon = isGoldMajor ? Trophy : isBlueFirst ? Medal : isPurpleMention ? AwardIcon : Star;

              // Palette styles per card category
              const auraStyles = isGoldMajor
                ? {
                    border: 'border-amber-400/30 dark:border-amber-400/40 hover:border-amber-400 hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.22)]',
                    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-400/30',
                    iconBg: 'bg-amber-400/15 text-amber-600 dark:text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.35)]',
                    glowGradient: 'from-amber-400/10 via-transparent to-transparent',
                  }
                : isBlueFirst
                ? {
                    border: 'border-blue-400/30 dark:border-blue-400/40 hover:border-blue-400 hover:shadow-[0_20px_45px_-12px_rgba(59,130,246,0.22)]',
                    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-400/30',
                    iconBg: 'bg-blue-400/15 text-blue-600 dark:text-blue-400 shadow-[0_0_24px_rgba(59,130,246,0.35)]',
                    glowGradient: 'from-blue-400/10 via-transparent to-transparent',
                  }
                : isPurpleMention
                ? {
                    border: 'border-purple-400/30 dark:border-purple-400/40 hover:border-purple-400 hover:shadow-[0_20px_45px_-12px_rgba(168,85,247,0.22)]',
                    badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-400/30',
                    iconBg: 'bg-purple-400/15 text-purple-600 dark:text-purple-400 shadow-[0_0_24px_rgba(168,85,247,0.35)]',
                    glowGradient: 'from-purple-400/10 via-transparent to-transparent',
                  }
                : {
                    border: 'border-amber-500/30 dark:border-amber-500/40 hover:border-amber-500 hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.22)]',
                    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
                    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.35)]',
                    glowGradient: 'from-amber-500/10 via-transparent to-transparent',
                  };

              // Associated Painting Image Fallback mapping
              const paintingImage = award.image || (
                idx === 0 ? '/images/buddha-tree-of-life-painting.jpg' :
                idx === 1 ? '/images/surreal-conceptual-painting-floating-man-artw-art-1792911666894.jpg' :
                idx === 2 ? '/images/abstract-spiritual-canvas-print.jpg' :
                '/images/abstract-woman-leopard-eagle-painting.jpg'
              );

              const isCardFlipped = flippedCardIdx === idx;

              return (
                <div
                  key={idx}
                  className="perspective-1000 min-h-[380px] sm:min-h-[400px] w-full"
                  onMouseEnter={() => setFlippedCardIdx(idx)}
                  onMouseLeave={() => setFlippedCardIdx(null)}
                  onClick={() => setFlippedCardIdx(prev => (prev === idx ? null : idx))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFlippedCardIdx(prev => (prev === idx ? null : idx));
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${award.award} - Click or hover to reveal masterwork`}
                >
                  {/* 3D Flip Container */}
                  <div
                    className={`relative w-full h-full duration-700 ease-out transform-style-preserve-3d transition-transform cursor-pointer select-none ${
                      isCardFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* ========================================================= */}
                    {/* FRONT SIDE: Existing Achievement Cards (100% Unchanged)   */}
                    {/* ========================================================= */}
                    <div
                      className={`absolute inset-0 backface-hidden flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111318] border transition-all duration-500 shadow-sm dark:shadow-2xl overflow-hidden ${auraStyles.border}`}
                    >
                      {/* Subtle Radial Glow in Top Corner */}
                      <div className={`absolute -top-16 -right-16 w-36 h-36 bg-gradient-radial ${auraStyles.glowGradient} rounded-full blur-2xl opacity-60 pointer-events-none`} />

                      {/* Top Bar: Glowing Badge Icon, Year & Category Pill */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-500 ${auraStyles.iconBg}`}>
                              <AwardBadgeIcon className="w-5 h-5" />
                            </div>
                            <span className="font-serif font-black text-sm tracking-widest text-[#E63946] dark:text-[#FF4D5A]">
                              {award.year}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border shadow-2xs whitespace-nowrap ${auraStyles.badge}`}>
                            {award.badgeText}
                          </span>
                        </div>

                        {/* Award Title & Institution */}
                        <div className="space-y-2 pt-2">
                          <h4 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-50 leading-snug">
                            {award.award}
                          </h4>
                          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                            {award.institution}
                          </p>

                          {/* Curatorial One-Line Citation / Juried Highlight */}
                          <div className="pt-2">
                            <p className="text-[11px] leading-relaxed italic text-stone-600 dark:text-stone-300 pl-3 border-l-2 border-artisan-gold/70 dark:border-artisan-gold">
                              {idx === 0 && "Honored for pioneering classical glazing depth and monumental spiritual composition."}
                              {idx === 1 && "Recognized for emotive contemporary realism and figurative anatomical mastery."}
                              {idx === 2 && "Curatorial citation for fluid natural pigments and deep meditative storytelling."}
                              {idx === 3 && "Celebrated for exquisite Renaissance draftsmanship on raw archival rag."}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Strip: Reveal Art CTA Button */}
                      <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-center">
                        <span className="w-full py-2 px-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-[11px] font-bold tracking-wider uppercase text-artisan-gold dark:text-amber-300 flex items-center justify-center gap-1.5 shadow-2xs group-hover:bg-artisan-gold/10 transition-colors">
                          <span>Hover to Reveal Art</span>
                          <span className="text-xs">↻</span>
                        </span>
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* BACK SIDE: Artwork Reveal (High-Res Painting with Caption) */}
                    {/* ========================================================= */}
                    <div
                      className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#111318] border shadow-2xl overflow-hidden ${auraStyles.border}`}
                    >
                      {/* Masterwork Canvas Display */}
                      <div className="relative w-full flex-1 rounded-2xl overflow-hidden bg-stone-950 border border-stone-200/60 dark:border-white/10 flex items-center justify-center">
                        <img
                          src={paintingImage}
                          alt={award.artworkTitle || award.award}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/abstract-spiritual-canvas-print.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Overlay Badge on Back */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                            Juried Masterwork
                          </span>
                          <span className="text-[10px] font-mono text-stone-300 bg-black/40 px-2 py-0.5 rounded-md">
                            {award.year}
                          </span>
                        </div>

                        {/* Bottom Overlay Title */}
                        <div className="absolute bottom-3 left-3 right-3 text-left">
                          <p className="text-xs sm:text-sm font-serif font-bold text-white drop-shadow-md line-clamp-1">
                            {award.artworkTitle || award.award}
                          </p>
                          <p className="text-[10px] text-stone-300 drop-shadow-sm mt-0.5 line-clamp-1">
                            {award.institution}
                          </p>
                        </div>
                      </div>

                      {/* Back Bottom Helper Bar */}
                      <div className="pt-3 px-1 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="font-semibold text-artisan-crimson dark:text-artisan-gold">
                          Original Atelier Canvas
                        </span>
                        <span className="text-[10px] text-stone-400">
                          Juried Award
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. MATERIALS & ATELIER CRAFT */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-reveal">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson">
              Material Purity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
              Why an Atelier Kuldeep Singh Painting Endures Centuries.
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Every canvas created in the studio follows archival conservation protocols pioneered by Renaissance masters, ensuring structural integrity and luminous permanence.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">100% Belgian Claessens Linen</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Woven from pure flax, double-sized with rabbit skin glue and lead-oil ground.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Hand-Ground Mineral Pigments</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Real Lapis Lazuli, French Ochres, and Cadmium mixed with cold-pressed walnut oil.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Natural Dammar Resin & Beeswax Varnish</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Breathable protective film shielding against UV degradation and environmental dust.</p>
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
                src="/images/krishna-god-traditional-painting.jpg"
                alt="Pigment mixing"
                className="rounded-3xl aspect-[4/5] object-cover shadow-lg border border-stone-200 transition-transform duration-700 hover:scale-105"
              />
              <img
                src="/images/abstract-woman-leopard-eagle-painting.jpg"
                alt="Studio drawing"
                className="rounded-3xl aspect-[4/5] object-cover shadow-lg border border-stone-200 mt-8 transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};
