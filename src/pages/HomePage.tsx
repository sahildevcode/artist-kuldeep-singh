import React from 'react';
import { ArrowRight, Sparkles, Star, ShieldCheck, ArrowUpRight, Palette, Eye } from 'lucide-react';
import { PRESS_LOGOS, REVIEWS } from '../data/reviews';
import type { Artwork, Course } from '../types';
import { MagneticButton } from '../components/ui/MagneticButton';
import { useCart } from '../context/CartContext';
import { useStudioData } from '../context/StudioDataContext';

interface HomePageProps {
  setActivePage: (page: 'home' | 'about' | 'courses' | 'store') => void;
  onSelectArtwork: (artwork: Artwork) => void;
  onSelectCourse: (course: Course) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActivePage,
  onSelectArtwork,
  onSelectCourse,
}) => {
  const { addToCart } = useCart();
  const { artworks, courses, artistProfile } = useStudioData();
  const featuredArtworks = artworks.filter((a) => a.featured).slice(0, 4);
  const featuredCourses = courses.slice(0, 3);

  const dynamicStats = [
    { label: 'Years of Devoted Mastery', value: artistProfile.yearsExperience, subtext: 'Continuous studio practice' },
    { label: 'Original Works Collected', value: artistProfile.artworksCount, subtext: 'In 32 countries across the globe' },
    { label: 'International Exhibitions', value: artistProfile.exhibitionsCount, subtext: 'Solo & curated group showcases' },
    { label: 'Global Academy Students', value: artistProfile.studentsCount, subtext: 'Trained in oils, sketch & color theory' },
  ];

  return (
    <div className="relative z-10 pt-28 sm:pt-36">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION WITH 3D BRUSH SPOTLIGHT */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100/90 border border-stone-200/80 backdrop-blur-md text-xs font-semibold text-stone-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-artisan-crimson animate-pulse" />
              <span>12+ Years of Studio Mastery • New York & Florence</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1A1816] leading-[1.08]">
              Transforming Raw{' '}
              <span className="text-gradient-pigment italic font-normal">
                Pigment & Soul
              </span>{' '}
              Into Timeless Art.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-stone-600 max-w-2xl font-normal leading-relaxed">
              Welcome to the atelier of Artist Kuldeep Singh. Explore museum-grade original oil paintings, 
              rare anatomical charcoal studies, and intensive masterclasses designed for artists pursuing true craftsmanship.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton
                onClick={() => setActivePage('store')}
                variant="primary"
                size="lg"
                className="shadow-xl"
              >
                <span>Acquire Original Works</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </MagneticButton>

              <MagneticButton
                onClick={() => setActivePage('courses')}
                variant="glass"
                size="lg"
              >
                <span>Explore Masterclasses</span>
                <Sparkles className="w-4 h-4 ml-2 text-artisan-gold" />
              </MagneticButton>
            </div>

            {/* Interactive hint badge */}
            <div className="pt-4 flex items-center gap-3 text-xs text-stone-500">
              <div className="p-2 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center">
                <Palette className="w-4 h-4 text-artisan-crimson animate-spin-slow" />
              </div>
              <p>
                <b>Interactive 3D Canvas:</b> Move your cursor to release pigment streaks • Scroll to rotate the 3D brush • Click anywhere to burst watercolor bubbles.
              </p>
            </div>
          </div>

          {/* Right Floating Quick Card (Hero visual anchor) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative max-w-sm w-full">
              {/* Decorative behind glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-artisan-crimson via-artisan-ochre to-artisan-ultramarine rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 animate-pulse-glow" />

              <div className="relative glass-panel rounded-3xl p-5 border border-white shadow-2xl space-y-4">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-inner group">
                  <img
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop"
                    alt="Hero Artwork"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                    Featured Canvas
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-serif font-bold text-artisan-crimson shadow-md">
                    $4,850 USD
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Symphony of the Solitary Tide
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Original Oil on Belgian Linen (40 x 54 in)
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-stone-600">
                    <ShieldCheck className="w-4 h-4 text-artisan-gold" />
                    <span>Archival Certificate</span>
                  </div>
                  <button
                    onClick={() => {
                      if (artworks[0]) onSelectArtwork(artworks[0]);
                    }}
                    className="text-xs font-bold text-artisan-crimson hover:underline flex items-center gap-1"
                  >
                    Quick View <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STATS COUNTER STRIP */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {dynamicStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-stone-200/80 shadow-soft-lux hover:shadow-card-lux transition-all duration-300 group hover:-translate-y-1"
            >
              <span className="font-serif font-bold text-3xl sm:text-4xl text-artisan-charcoal block group-hover:text-artisan-crimson transition-colors">
                {stat.value}
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mt-1">
                {stat.label}
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">{stat.subtext}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. SELECTED MASTERWORKS SHOWCASE */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-stone-100/50 border-y border-stone-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson block mb-2">
                Curated Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
                Original Canvases & Drawings
              </h2>
            </div>
            <MagneticButton
              onClick={() => setActivePage('store')}
              variant="outline"
              size="md"
              className="mt-4 md:mt-0"
            >
              <span>View All 8 Artworks in Store</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </MagneticButton>
          </div>

          {/* Artworks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((art) => (
              <div
                key={art.id}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-2"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button
                      onClick={() => onSelectArtwork(art)}
                      className="w-full py-2.5 bg-white/95 backdrop-blur-md rounded-xl text-xs font-bold text-stone-900 shadow-md flex items-center justify-center gap-1.5 hover:bg-white"
                    >
                      <Eye className="w-3.5 h-3.5 text-artisan-crimson" />
                      Quick View & Wall Preview
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-stone-800 uppercase tracking-wider">
                    {art.medium}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-artisan-crimson transition-colors line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                      {art.dimensions} • {art.year}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-semibold">Price</span>
                      <span className="font-serif font-bold text-lg text-stone-900">
                        ${art.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: art.id,
                          type: 'artwork',
                          title: art.title,
                          subtitle: art.subtitle,
                          price: art.price,
                          image: art.image,
                          mediumOrCategory: art.medium,
                        })
                      }
                      className="px-3.5 py-2 bg-stone-900 hover:bg-artisan-crimson text-white rounded-xl text-xs font-bold tracking-wide transition-colors shadow-xs"
                    >
                      Acquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEATURED MASTERCLASSES */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-gold block mb-2">
              The Digital Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
              Master the Craft: Online Académie
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              12 years of specialized knowledge distilled into crystal-clear video masterclasses covering Oil Painting, Realistic Sketching, and Color Theory.
            </p>
          </div>
          <MagneticButton
            onClick={() => setActivePage('courses')}
            variant="primary"
            size="md"
            className="mt-4 md:mt-0"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </MagneticButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div className="relative h-52 overflow-hidden bg-stone-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                    {course.category}
                  </span>
                  <span className="bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-stone-900">
                    {course.durationMonths.split(' ')[0]} {course.durationMonths.split(' ')[1]}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-stone-900 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-artisan-crimson transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                    {course.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>{course.durationHours} Hours • {course.totalLessons} Lessons</span>
                    <span className="font-bold text-stone-800">{course.level}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {course.originalPrice && (
                        <span className="text-xs text-stone-400 line-through mr-1.5">
                          ${course.originalPrice}
                        </span>
                      )}
                      <span className="font-serif font-bold text-2xl text-artisan-crimson">
                        ${course.price}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectCourse(course)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-900 hover:text-white rounded-xl text-xs font-bold tracking-wide transition-all"
                    >
                      Syllabus & Enroll
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. 12 YEARS JOURNEY TEASER BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-[#1A1816] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-artisan-crimson/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-gold block">
                The 12-Year Retrospective
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                "Art is Not Merely What You See, But What You Compel Others to Feel."
              </h2>
              <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                From classical training under Florentine master painters in 2014 to winning international fine art gold medals and exhibiting across London, Paris, and New York. Discover the 12-year odyssey behind the brush.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <MagneticButton
                onClick={() => setActivePage('about')}
                variant="gold"
                size="lg"
              >
                <span>Explore Full 12Y Legacy</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. PRESS & COLLECTOR REVIEWS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson">
            Acclaimed by Patrons
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Collector & Student Testimonials
          </h2>
        </div>

        {/* Press Quotes Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {PRESS_LOGOS.map((press, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between text-center"
            >
              <h4 className="font-display font-bold text-xs tracking-widest text-stone-900">
                {press.name}
              </h4>
              <p className="text-[11px] text-stone-500 italic mt-3">
                "{press.quote}"
              </p>
            </div>
          ))}
        </div>

        {/* Individual Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{rev.name}</h4>
                  <p className="text-[11px] text-stone-500">
                    {rev.role} • {rev.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
