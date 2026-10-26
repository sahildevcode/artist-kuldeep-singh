import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
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
      'Kuldeep Singh (b. 1998) is an Indian contemporary visual artist whose work explores the profound relationship between spirituality, human consciousness, and cultural heritage. Rooted in the philosophical traditions of India, his artistic practice moves beyond the visible, transforming painting into a contemplative exploration of existence, identity, and inner awareness.',
      "He holds a Bachelor of Fine Arts (B.F.A.) from Bundelkhand University and a Master of Fine Arts (M.F.A.) in Painting from Raja Mansingh Tomar Music & Arts University, Gwalior. Drawing upon his academic training and India's rich artistic traditions, Singh has developed a distinctive visual language that brings traditional symbolism into dialogue with contemporary artistic expression."
    ],
    image: '/images/buddha-tree-of-life-painting.jpg',
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
      'For Singh, art is a journey inward—a meeting point between the material world and the unseen dimensions of human consciousness. Inspired by Indian philosophy, spiritual narratives, and ancient symbolism, his work reflects on the nature of the self, the dissolution of ego, and the search for a deeper understanding of existence.',
      'His signature series, Rahyasya and Beyond the Horizon, explore the tension between worldly attachments and spiritual aspirations. Through evocative imagery and contemplative compositions, these works invite viewers to look beyond appearances and engage with questions of identity, transformation, and inner awakening.',
      'Working across oil and acrylic painting, charcoal, pen art, watercolour, and traditional Indian rangoli, Singh explores diverse ways of translating philosophical ideas and cultural memories into visual form. His practice brings together expressive mark-making, intricate detail, fluidity, and symbolism in an evolving dialogue between heritage and contemporary art.'
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
      "Singh's artistic journey has connected his practice with art venues and cultural platforms in India and internationally. His exhibition and artistic engagements include AIFACS Art Gallery, New Delhi; State Gallery of Arts, Hyderabad; Kannauj Museum, Uttar Pradesh; Lighthouse Gallery, Puerto Rico; and Tons of Rock, Norway.",
      'Through these engagements, Singh seeks to contribute to cross-cultural dialogue, bringing perspectives shaped by Indian philosophy and artistic heritage into conversation with diverse audiences.'
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
      "Singh's artistic achievements include The Kala Gaurav Award and The Raja Ravi Verma Award, along with recognition from the Rajya Lalit Kala Academy.",
      'His artistic journey continues through creative exploration, exhibitions, live art demonstrations, and collaborative initiatives. Guided by an enduring interest in spirituality, consciousness, and cultural expression, he seeks to create works that encourage reflection beyond the surface of the image.',
      'For Kuldeep Singh, art is not merely an act of seeing; it is an invitation to feel, question, and discover what lies within.'
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
  const { awards } = useStudioData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const heroImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (heroImgRef.current && heroImgRef.current.complete) {
      setIsHeroLoaded(true);
    }
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  const awardsList = Array.isArray(awards) ? awards : [];

  return (
    <div className="relative w-full min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO ARTIST BANNER (Full 100% Width & Height Screen Cover)   */}
      {/* ------------------------------------------------------------- */}
      <section className="relative w-full h-screen min-h-screen overflow-hidden bg-[#0E0C0A] select-none z-0">
        <img
          ref={heroImgRef}
          src="/images/artist-hero-banner.png"
          alt="Artist Kuldeep Singh — Official Atelier Banner"
          onLoad={() => setIsHeroLoaded(true)}
          className={`w-full h-full object-cover object-center animate-hero-fade transition-opacity duration-1000 ease-out ${
            isHeroLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Subtle cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. OVERLAY PAGE CONTENT (Slides UP OVER Image on Mobile & Desktop) */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 bg-[#FDFBF7] dark:bg-[#0E0C0A] border-t border-stone-200/60 dark:border-stone-800/60 pb-28 pt-12 sm:pt-20">

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
              <div className="max-w-xl space-y-5">
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-artisan-gold tracking-wider">
                    {sec.number}
                  </span>
                  <div className="h-6 w-[1.5px] bg-artisan-gold/40" />
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-3xl font-semibold tracking-wider uppercase text-stone-900 dark:text-stone-100">
                    {sec.title}
                  </h2>
                </div>

                <div className="space-y-4 text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed font-sans font-light">
                  {sec.paragraphs.map((p, pIdx) => (
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
                src="/images/krishna-god-traditional-painting.jpg"
                alt="Pigment mixing"
                className="rounded-3xl aspect-[4/5] object-cover shadow-lg border border-stone-200"
              />
              <img
                src="/images/abstract-woman-leopard-eagle-painting.jpg"
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
