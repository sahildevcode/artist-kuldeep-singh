import React, { useState, useEffect, useMemo } from 'react';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useStudioData } from '../../context/StudioDataContext';
import type { CollectorReview } from '../../types';

interface TestimonialAutoSliderProps {
  onExploreCourses?: () => void;
  onExploreStore?: () => void;
}

export const TestimonialAutoSlider: React.FC<TestimonialAutoSliderProps> = ({
  onExploreCourses,
  onExploreStore,
}) => {
  const { reviews, artistProfile } = useStudioData();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'upcoming' | 'student' | 'collector'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Active reviews list
  const activeReviews = useMemo(() => {
    return (reviews || []).filter((r) => r.isActive !== false);
  }, [reviews]);

  // Filtered reviews by category
  const filteredReviews = useMemo(() => {
    return activeReviews.filter((r) => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'upcoming') return r.category === 'upcoming';
      if (selectedCategory === 'student') return r.category === 'student' || (!r.category && r.courseTaken);
      if (selectedCategory === 'collector') return r.category === 'collector' || (!r.category && r.artworkAcquired);
      return true;
    });
  }, [activeReviews, selectedCategory]);

  // Reset index if filtered list changes or out of bounds
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, filteredReviews.length]);

  // Automatic slide interval (4.5 seconds)
  useEffect(() => {
    if (isPaused || filteredReviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, filteredReviews.length, currentIndex]);

  const handleNext = () => {
    if (filteredReviews.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % filteredReviews.length);
  };

  const handlePrev = () => {
    if (filteredReviews.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Safe current review
  const currentReview: CollectorReview | undefined = filteredReviews[currentIndex];

  const sectionTitle = artistProfile.testimonialSectionTitle || 'Upcoming Courses';
  const sectionSubtitle = artistProfile.testimonialSectionSubtitle || 'Student Reviews & Atelier Experiences';

  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-amber-200/25 rounded-full blur-[80px] pointer-events-none -z-10 gpu-blur-ambient" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-artisan-crimson/15 rounded-full blur-[90px] pointer-events-none -z-10 gpu-blur-ambient" />

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-artisan-gold/15 border border-artisan-gold/30 text-[11px] font-bold text-[#64440c] uppercase tracking-widest shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
          <span>{sectionSubtitle}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          {sectionTitle}
        </h2>

        <p className="text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto leading-relaxed">
          Authentic reflections from fine art collectors, emerging painters, and scholars enrolled in our classical atelier batches and upcoming diplomas.
        </p>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Reviews', icon: Layers },
          { id: 'upcoming', label: '🎓 Upcoming Courses Batches', icon: Calendar },
          { id: 'student', label: '🖌️ Academy Scholars', icon: GraduationCap },
          { id: 'collector', label: '🏛️ Art Collectors', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs active:scale-95 ${
                isSelected
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md'
                  : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 border border-stone-200/90 dark:border-stone-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-artisan-gold' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-sm max-w-lg mx-auto">
          <Quote className="w-10 h-10 mx-auto mb-3 text-stone-300 dark:text-stone-600" />
          <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200">No Reviews Found</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            There are currently no reviews in this category. You can add new reviews directly from the Admin Panel.
          </p>
        </div>
      ) : (
        /* The Auto-Changing Image & Review Showcase Card */
        <div
          className="relative bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-3xl sm:rounded-[2.5rem] border border-stone-200/90 dark:border-stone-800 shadow-soft-lux overflow-hidden transition-all duration-300"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Story-Style Animated Progress Timer Bar */}
          <div className="w-full bg-stone-100 h-1.5 relative overflow-hidden">
            <div
              key={`${currentIndex}-${isPaused}`}
              className={`h-full bg-gradient-to-r from-artisan-gold via-amber-500 to-artisan-crimson ${
                isPaused ? 'w-full opacity-60' : 'animate-progress-fill'
              }`}
              style={{
                animationDuration: '4500ms',
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards'
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 items-center">
            {/* Left Column: AUTO-CHANGING SHOWCASE IMAGE (Large framed visual) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] sm:aspect-[4/4.8] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border-2 border-stone-200/80 shadow-2xl group">
                {/* Main Changing Artwork / Course Image */}
                <img
                  key={currentReview?.artworkImage || currentReview?.id}
                  src={
                    currentReview?.artworkImage ||
                    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=900&auto=format&fit=crop'
                  }
                  alt={currentReview?.name}
                  className="w-full h-full object-cover animate-fade-in transition-all duration-700 group-hover:scale-105"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Top Badge: Category indicator */}
                <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
                  <span className="bg-stone-950/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20 shadow-md flex items-center gap-1.5">
                    {currentReview?.category === 'upcoming' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Upcoming Batch Scholar</span>
                      </>
                    ) : currentReview?.category === 'student' || currentReview?.courseTaken ? (
                      <>
                        <GraduationCap className="w-3.5 h-3.5 text-artisan-gold" />
                        <span>Masterclass Alumnus</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-3.5 h-3.5 text-artisan-gold" />
                        <span>Fine Art Collector</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Autoplay Active Indicator Pill */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-black/60 backdrop-blur-md text-stone-200 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                    <span>{isPaused ? 'Paused on Hover' : 'Auto-Changing'}</span>
                  </span>
                </div>
              </div>

              {/* Decorative Corner Shadow/Glow */}
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-artisan-gold/20 rounded-full blur-2xl -z-10 pointer-events-none" />
            </div>

            {/* Right Column: AUTO-CHANGING TESTIMONIAL CONTENT & QUOTE */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              {/* Header Strip with Verified Badge & Slide Counter */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-artisan-gold/10 border border-artisan-gold/25 text-[11px] font-bold text-[#64440c] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
                    <span>Verified Atelier Story</span>
                  </div>

                  {/* Slide Counter */}
                  <div className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                    <span className="text-stone-900 dark:text-stone-100">
                      {String(currentIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="mx-1">/</span>
                    <span>{String(filteredReviews.length).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Big Elegant Quotation */}
                <div className="relative pt-2">
                  <Quote className="w-12 h-12 text-artisan-gold/30 -mb-4 -ml-1 select-none pointer-events-none" />
                  <p
                    key={`comment-${currentReview?.id}`}
                    className="font-serif italic text-lg sm:text-2xl text-stone-900 dark:text-stone-100 leading-relaxed animate-fade-in"
                  >
                    "{currentReview?.comment}"
                  </p>
                </div>
              </div>

              {/* Tag / Badge: Associated Course or Artwork Acquired */}
              <div className="pt-2">
                {currentReview?.courseTaken && (
                  <button
                    type="button"
                    onClick={() => onExploreCourses?.()}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-artisan-crimson/10 hover:bg-artisan-crimson/20 border border-artisan-crimson/20 text-xs font-bold text-artisan-crimson cursor-pointer transition-all active:scale-95"
                  >
                    <GraduationCap className="w-4 h-4 text-artisan-crimson" />
                    <span>Enrolled / Upcoming Batch: {currentReview.courseTaken}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                )}
                {currentReview?.artworkAcquired && (
                  <button
                    type="button"
                    onClick={() => onExploreStore?.()}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-artisan-gold/15 hover:bg-artisan-gold/25 border border-artisan-gold/30 text-xs font-bold text-[#64440c] dark:text-amber-300 cursor-pointer transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-artisan-gold" />
                    <span>Acquired Original Masterpiece: {currentReview.artworkAcquired}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                )}
              </div>

              {/* Reviewer Details & Location */}
              <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-stone-900 dark:bg-stone-800 border-2 border-artisan-gold/60 flex items-center justify-center text-artisan-gold font-serif font-bold text-sm shadow-sm shrink-0">
                    {currentReview?.name ? currentReview.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : '★'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                        {currentReview?.name}
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {currentReview?.role} • <span className="text-stone-700 dark:text-stone-300 font-medium">{currentReview?.location}</span>
                    </p>
                  </div>
                </div>

                {/* Interactive Controls (Arrows) */}
                <div className="flex items-center gap-2">

                  <button
                    onClick={handlePrev}
                    className="p-2.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-900 hover:text-white dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition cursor-pointer active:scale-95 border border-stone-200/80 dark:border-stone-700"
                    title="Previous Testimonial"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-2.5 rounded-full bg-stone-900 dark:bg-stone-100 hover:bg-artisan-crimson dark:hover:bg-artisan-crimson text-white dark:text-stone-900 dark:hover:text-white transition cursor-pointer active:scale-95 shadow-sm"
                    title="Next Testimonial"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
