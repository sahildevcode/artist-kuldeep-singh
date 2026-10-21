import React, { useRef, useEffect } from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { PRESS_LOGOS } from '../data/reviews';
import type { Artwork, Course } from '../types';
import { MagneticButton } from '../components/ui/MagneticButton';
import { useCart } from '../context/CartContext';
import { useStudioData } from '../context/StudioDataContext';
import { UpcomingCoursesSection } from '../components/home/UpcomingCoursesSection';
import { TestimonialAutoSlider } from '../components/home/TestimonialAutoSlider';

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

  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
  }, []);

  const dynamicStats = [
    { label: 'Years of Devoted Mastery', value: artistProfile.yearsExperience, subtext: 'Continuous studio practice' },
    { label: 'Original Works Collected', value: artistProfile.artworksCount, subtext: 'In 32 countries across the globe' },
    { label: 'International Exhibitions', value: artistProfile.exhibitionsCount, subtext: 'Solo & curated group showcases' },
    { label: 'Global Academy Students', value: artistProfile.studentsCount, subtext: 'Trained in oils, sketch & color theory' },
  ];

  const getAutoplayEmbedUrl = (rawUrl: string) => {
    try {
      const urlObj = new URL(rawUrl);
      if (rawUrl.includes('mediadelivery.net')) {
        urlObj.searchParams.set('autoplay', 'true');
        urlObj.searchParams.set('loop', 'true');
        urlObj.searchParams.set('muted', 'true');
        urlObj.searchParams.set('preload', 'true');
        urlObj.searchParams.set('responsive', 'true');
        return urlObj.toString();
      }
      if (rawUrl.includes('youtube') || rawUrl.includes('youtu.be')) {
        urlObj.searchParams.set('autoplay', '1');
        urlObj.searchParams.set('mute', '1');
        urlObj.searchParams.set('controls', '0');
        urlObj.searchParams.set('loop', '1');
        urlObj.searchParams.set('playsinline', '1');
        return urlObj.toString();
      }
      if (rawUrl.includes('vimeo')) {
        urlObj.searchParams.set('autoplay', '1');
        urlObj.searchParams.set('muted', '1');
        urlObj.searchParams.set('controls', '0');
        urlObj.searchParams.set('loop', '1');
        urlObj.searchParams.set('background', '1');
        return urlObj.toString();
      }
      return rawUrl;
    } catch {
      return rawUrl;
    }
  };

  return (
    <div className="relative z-10 w-full">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION - FULL-SCREEN CINEMATIC VIDEO (ART BY SEHGAL STYLE) */}
      {/* ------------------------------------------------------------- */}
      <section className="relative w-full h-[88vh] sm:h-screen min-h-[580px] max-h-[1080px] overflow-hidden bg-black select-none">
        {(() => {
          const resolveVideoUrl = () => {
            const raw = artistProfile.heroShowcaseVideoUrl || artistProfile.studioVideoUrl;
            if (!raw || raw.includes('mediadelivery.net') || raw.includes('sample/ForBiggerBlazes')) {
              return '/videos/hero-cinematic.mp4';
            }
            return raw;
          };

          const heroVideoUrl = resolveVideoUrl();
          const heroImage =
            artistProfile.heroShowcaseImage ||
            artistProfile.studioVideoPoster ||
            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop';
          const isIframe =
            heroVideoUrl.includes('youtube.com') ||
            heroVideoUrl.includes('youtu.be') ||
            heroVideoUrl.includes('vimeo.com');

          return (
            <div className="relative w-full h-full">
              {/* Background Cinematic Video Player (No Icons, Pure Muted Autoplay Loop) */}
              {isIframe ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
                  <iframe
                    src={getAutoplayEmbedUrl(heroVideoUrl)}
                    title="Artist Kuldeep Singh - Hero Video"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[114%] h-[128%] min-w-full min-h-full border-0 pointer-events-none select-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              ) : (
                <video
                  ref={heroVideoRef}
                  src={heroVideoUrl}
                  poster={heroImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              )}

              {/* Dark Cinematic Vignette & Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65 pointer-events-none" />

              {/* Centered Overlay: Artist Kuldeep Singh & Discover Button */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-8 pointer-events-none">
                {/* Stylish & Unique Typography for Artist Kuldeep Singh */}
                <h1 className="flex flex-col items-center justify-center select-none drop-shadow-2xl text-center">
                  <span className="font-serif italic font-light text-lg sm:text-2xl md:text-3xl text-stone-200/90 tracking-wider mb-1 sm:mb-2">
                    The Art of
                  </span>
                  <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal text-white uppercase tracking-[0.12em] sm:tracking-[0.16em] leading-tight bg-gradient-to-r from-white via-[#FFF5E6] to-[#EADBBE] bg-clip-text text-transparent">
                    Artist Kuldeep Singh
                  </span>
                </h1>

                {/* Discover The Artist Action Button */}
                <div className="mt-6 sm:mt-8 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 sm:px-12 py-3.5 sm:py-4 bg-black/85 hover:bg-black text-white hover:text-white border border-white/50 hover:border-white font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] transition-all duration-300 shadow-2xl backdrop-blur-sm cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <span>Discover The Artist</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* STATS COUNTER STRIP */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dynamicStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/70 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-soft-lux hover:shadow-card-lux transition-all duration-300 group hover:-translate-y-1"
            >
              <span className="font-serif font-bold text-3xl sm:text-4xl text-artisan-charcoal dark:text-stone-100 block group-hover:text-artisan-crimson transition-colors">
                {stat.value}
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-300 mt-1">
                {stat.label}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{stat.subtext}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ------------------------------------------------------------- */}
      {/* 2. SELECTED MASTERWORKS SHOWCASE */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-stone-100/50 dark:bg-stone-950/60 border-y border-stone-200/60 dark:border-stone-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-artisan-crimson block mb-2">
                Curated Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
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
                onClick={() => onSelectArtwork(art)}
                className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <button
                      onClick={() => onSelectArtwork(art)}
                      className="w-full py-2.5 bg-white/95 dark:bg-stone-800/95 backdrop-blur-md rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100 shadow-md flex items-center justify-center gap-1.5 hover:bg-white dark:hover:bg-stone-700"
                    >
                      <Eye className="w-3.5 h-3.5 text-artisan-crimson" />
                      Quick View & Wall Preview
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                    {art.medium}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-artisan-crimson transition-colors line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                      {art.dimensions} • {art.year}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-semibold">Price</span>
                      <span className="font-serif font-bold text-lg text-stone-900 dark:text-amber-300">
                        ₹{(art.price >= 10000 ? art.price : Math.round(art.price * 85)).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        addToCart({
                          id: art.id,
                          type: 'artwork',
                          title: art.title,
                          subtitle: art.subtitle,
                          price: art.price >= 10000 ? art.price : Math.round(art.price * 85),
                          image: art.image,
                          mediumOrCategory: art.medium,
                        })
                      }
                      className="px-3.5 py-2 bg-stone-900 hover:bg-artisan-crimson dark:bg-stone-100 dark:hover:bg-artisan-crimson text-white dark:text-stone-900 dark:hover:text-white rounded-xl text-xs font-bold tracking-wide transition-colors shadow-xs"
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
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Master the Craft: Online Académie
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-2 max-w-xl">
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
              onClick={() => onSelectCourse(course)}
              className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 cursor-pointer"
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
                    {course.durationMonths}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-artisan-crimson transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <span>{course.durationHours} Hours • {course.totalLessons} Lessons</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{course.level}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {course.originalPrice && (
                        <span className="text-xs text-stone-400 line-through mr-1.5">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="font-serif font-bold text-2xl text-artisan-crimson dark:text-red-400">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCourse(course);
                      }}
                      className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-900 hover:text-white dark:hover:bg-stone-100 dark:hover:text-stone-900 dark:text-stone-200 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer"
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
      {/* 3.5 UPCOMING COURSES & TESTIMONIALS SHOWCASE                  */}
      {/* ------------------------------------------------------------- */}
      <UpcomingCoursesSection />

      {/* ------------------------------------------------------------- */}
      {/* 4. 12 YEARS JOURNEY TEASER BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-[#1A1816] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-artisan-crimson/20 rounded-full blur-[80px] pointer-events-none gpu-blur-ambient" />
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
      {/* 5. AUTOMATIC CHANGING IMAGES & TESTIMONIAL SLIDESHOW          */}
      {/* ------------------------------------------------------------- */}
      <TestimonialAutoSlider
        onExploreCourses={() => setActivePage('courses')}
        onExploreStore={() => setActivePage('store')}
      />

      {/* Press Quotes Bar */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800">
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 dark:text-stone-500">
              Featured in International Art Publications & Press
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRESS_LOGOS.map((press, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-col justify-between text-center"
              >
                <h4 className="font-display font-bold text-xs tracking-widest text-stone-900 dark:text-stone-100">
                  {press.name}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 italic mt-3">
                  "{press.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
