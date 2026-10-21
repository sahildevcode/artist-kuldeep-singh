import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  Video,
  Play,
  Lock,
  Unlock,
  ShieldCheck,
  MessageSquare,
  Radio,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Images,
  X
} from 'lucide-react';
import type { Course, CourseLecture } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStudioData } from '../context/StudioDataContext';
import { MagneticButton } from '../components/ui/MagneticButton';

interface CourseDetailPageProps {
  course: Course;
  onBack: () => void;
  onGoToPortal?: (courseId: string) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course, onBack, onGoToPortal }) => {
  const { currentUser, setIsAuthModalOpen, isCourseUnlocked } = useAuth();
  const { addToCart, setIsCheckoutModalOpen } = useCart();
  const { liveStatus } = useStudioData();

  const isEnrolled = isCourseUnlocked(course.id) || currentUser?.role === 'admin';
  const isThisCourseLive = Boolean(
    liveStatus
      ? (liveStatus.isLive && (liveStatus.courseId ? liveStatus.courseId === course.id : course.liveClassStatus === 'live'))
      : course.liveClassStatus === 'live'
  );
  const liveMeetUrl = (isThisCourseLive && liveStatus?.liveStreamUrl) || course.liveClassUrl || 'https://meet.google.com';

  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [selectedLectureForStream, setSelectedLectureForStream] = useState<CourseLecture | null>(null);

  const galleryImages = useMemo(() => {
    if (Array.isArray(course.images) && course.images.length > 0) {
      return course.images;
    }
    return course.thumbnail ? [course.thumbnail] : [];
  }, [course]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const isUnlocked = isCourseUnlocked(course.id);

  const handleEnrollClick = () => {
    // 1. Must be logged in
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    // 2. Add course to Cart and trigger real Razorpay Checkout
    addToCart({
      id: course.id,
      type: 'course',
      title: course.title,
      price: course.price,
      image: course.thumbnail,
      mediumOrCategory: course.category,
      subtitle: `${course.durationMonths} by Artist Kuldeep Singh`
    }, 1);

    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="relative z-10 pt-28 sm:pt-36 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Bar */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-stone-200 text-xs font-bold text-stone-700 hover:text-black hover:bg-white shadow-xs transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Masterclasses</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. HERO SHOWCASE: PORTRAIT PAINTING STAGE & ENROLLMENT        */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
          
          {/* SIDE 1: Portrait Painting Stage & Gallery Carousel (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-3 order-1 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-h-[640px] bg-stone-950 border border-stone-800 group">
              <img
                src={galleryImages[activeImageIndex] || course.thumbnail}
                alt={`${course.title} - Preview ${activeImageIndex + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/10 pointer-events-none" />

              {/* Left / Right Carousel Controls */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                    }}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 shadow-lg cursor-pointer z-10"
                    title="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 shadow-lg cursor-pointer z-10"
                    title="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Top Overlay Badge for Multi-Image Counter */}
              {galleryImages.length > 1 && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Images className="w-3.5 h-3.5 text-artisan-gold" />
                    <span>Photo {activeImageIndex + 1} of {galleryImages.length}</span>
                  </span>
                </div>
              )}

              {/* Bottom Info Badge */}
              <div className="absolute bottom-4 right-4 text-white text-[11px] sm:text-xs z-10">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full font-bold border border-white/10 shadow-md">
                  {course.durationHours || 36} Total Hours
                </span>
              </div>
            </div>

            {/* Thumbnails Strip for Multiple Images (Portrait Thumbnails) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-thin">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer shadow-sm ${
                      idx === activeImageIndex
                        ? 'border-artisan-crimson ring-2 ring-artisan-crimson/40 scale-105'
                        : 'border-stone-200 opacity-60 hover:opacity-100 hover:border-stone-400'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SIDE 2: Course Information & Tuition Action Card (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-artisan-crimson/10 border border-artisan-crimson/20 text-artisan-crimson text-xs font-bold uppercase tracking-wider">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold">
                {course.level}
              </span>
              <span className="px-3 py-1 rounded-full bg-artisan-gold/10 border border-artisan-gold/30 text-stone-900 text-xs font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-artisan-gold" />
                {course.durationMonths}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1816] leading-tight">
              {course.title}
            </h1>

            {course.subtitle && (
              <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed italic">
                "{course.subtitle}"
              </p>
            )}

            {/* Mentor Strip (Clean, without dummy rating) */}
            <div className="flex flex-wrap items-center gap-6 py-3 border-y border-stone-200/80 text-xs text-stone-600">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1A1816] text-white flex items-center justify-center font-serif font-bold text-sm">
                  KS
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Lead Mentor</span>
                  <span className="font-bold text-stone-900">Artist Kuldeep Singh (12+ Years)</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-artisan-gold" />
                <span className="font-semibold text-stone-800">Batch Starts: {course.startDate}</span>
              </div>
            </div>

            {/* Live Studio Broadcaster Alert Banner (if active) */}
            {isThisCourseLive && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-red-400/40 animate-in fade-in">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                    <Radio className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-black/40 px-2.5 py-0.5 rounded-full">
                        Live Studio Class Broadcast Active Now
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-white mt-1">
                      Artist Kuldeep Singh is LIVE!
                    </h4>
                    <p className="text-xs text-rose-100">
                      Live interactive atelier demonstration & real-time critique session is underway.
                    </p>
                  </div>
                </div>

                {isEnrolled ? (
                  <a
                    href={liveMeetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-red-700 hover:bg-stone-100 font-bold text-xs rounded-xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 flex-shrink-0 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-red-600" />
                    <span>Join Google Meet Broadcast</span>
                  </a>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 flex-shrink-0">
                    <span className="text-[11px] text-rose-200 italic">Enrolled Scholars Only</span>
                    <button
                      onClick={() => {
                        addToCart({
                          id: course.id,
                          type: 'course',
                          title: course.title,
                          price: course.price,
                          image: course.thumbnail || (course.images && course.images[0]) || '',
                          mediumOrCategory: course.category,
                          subtitle: `${course.durationMonths || 'Masterclass'} by Artist Kuldeep Singh`
                        }, 1);
                        setIsCheckoutModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-white text-red-700 hover:bg-stone-100 font-bold text-xs rounded-xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Enroll to Join Live Class</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tuition Fee & Enrollment Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xl space-y-6">
              {/* Unlocked State Banner */}
              {isUnlocked ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Unlock className="w-4 h-4 text-emerald-600" />
                    <span>Course Unlocked & Enrolled</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    You have lifetime atelier access to all video lessons, live weekend classes, and direct feedback from Kuldeep Singh.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block">
                    Full Tuition Fee
                  </span>
                  <div className="flex items-baseline gap-3">
                    {course.originalPrice && (
                      <span className="text-sm text-stone-400 line-through">
                        ₹{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-artisan-crimson">
                      ₹{course.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    One-time payment • Lifetime access to future revisions
                  </p>
                </div>
              )}

              {/* Action Button: Enroll or Access */}
              <div>
                {isUnlocked ? (
                  <MagneticButton
                    onClick={() => {
                      try {
                        localStorage.setItem('ks_student_selected_course', course.id);
                      } catch (e) {
                        console.warn(e);
                      }
                      if (onGoToPortal) {
                        onGoToPortal(course.id);
                      } else {
                        window.location.hash = 'student-portal';
                      }
                    }}
                    variant="primary"
                    className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    <span>Access Classroom & Lectures (Student Portal)</span>
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    onClick={handleEnrollClick}
                    variant="primary"
                    className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
                  >
                    <Lock className="w-4 h-4 text-artisan-gold" />
                    <span>Enroll in Masterclass (₹{course.price.toLocaleString()})</span>
                  </MagneticButton>
                )}
              </div>

              {!currentUser && !isUnlocked && (
                <p className="text-center text-[11px] text-stone-500">
                  * You will be prompted to sign in or register before enrolling.
                </p>
              )}

              {/* Key Features Breakdown */}
              <div className="pt-4 border-t border-stone-100 space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-artisan-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Class Schedule:</span>
                    <span>{course.schedule}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Video className="w-4 h-4 text-artisan-crimson flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Study Mode:</span>
                    <span>{course.mode}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-artisan-ochre flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">Certification:</span>
                    <span>{course.certification}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">30-Day Guarantee:</span>
                    <span>100% unconditional artistic growth satisfaction refund</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. LOWER CONTENT: ABOUT, WHAT YOU MASTER, SYLLABUS, MATERIALS, GALLERY */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Course Narrative Description */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-2xl text-stone-900">
                About This Masterclass
              </h3>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>

            {/* What You Will Master */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-soft-lux space-y-4">
              <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-artisan-gold" />
                What You Will Master in These {course.durationMonths}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? course.whatYouWillLearn : [
                  'Live Real-Time Easel Demonstrations',
                  'Direct 1-on-1 Critique & Q&A Rooms',
                  'Permanent Access to HD Class Recordings & Archives'
                ]).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Month-by-Month Detailed Curriculum */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-2xl text-stone-900 flex items-center gap-2.5">
                  <BookOpen className="w-6 h-6 text-artisan-crimson" />
                  Detailed Curriculum Syllabus
                </h3>
                <span className="text-xs font-semibold text-stone-500">
                  {course.modules.length} Modules • {course.totalLessons} Lessons
                </span>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod, idx) => (
                  <div
                    key={mod.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => setActiveModuleIndex(activeModuleIndex === idx ? -1 : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
                    >
                      <div>
                        <span className="text-sm font-bold text-stone-900 block">{mod.title}</span>
                        <span className="text-xs text-stone-500 mt-0.5 block">
                          {mod.duration} • {mod.lessonsCount} Guided Lessons
                        </span>
                      </div>
                      <span className="text-base font-bold text-stone-400">
                        {activeModuleIndex === idx ? '−' : '+'}
                      </span>
                    </button>

                    {activeModuleIndex === idx && (
                      <div className="px-5 pb-5 pt-2 border-t border-stone-100 bg-stone-50/50 space-y-2.5">
                        {mod.lectures && mod.lectures.length > 0 ? (
                          mod.lectures.map((lec) => {
                            const isFree = lec.accessType === 'free' || lec.isFreePreview;
                            const canStream = isUnlocked || isFree;
                            return (
                              <div
                                key={lec.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200/80 text-xs hover:border-artisan-gold transition-colors gap-2"
                              >
                                <div className="flex items-center gap-2.5 text-stone-800 font-medium truncate flex-1 min-w-0 pr-2">
                                  <Play className="w-3.5 h-3.5 text-artisan-gold fill-artisan-gold flex-shrink-0" />
                                  <span className="truncate font-medium">{lec.title}</span>
                                  {isFree && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                                      Free Preview
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[11px] text-stone-500 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                                    {lec.duration}
                                  </span>
                                  {canStream && (
                                    <button
                                      onClick={() => setSelectedLectureForStream(lec)}
                                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                                        isFree && !isUnlocked
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                                          : 'bg-artisan-gold/15 hover:bg-artisan-gold text-stone-900 border-artisan-gold/30'
                                      }`}
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>{isFree && !isUnlocked ? 'Watch Free Trailer' : 'Stream'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="py-4 text-center text-xs text-stone-500 bg-stone-100/50 rounded-xl">
                            Lectures and video demonstrations will be published here for this module.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Materials & Tools Provided / Needed */}
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-100/70 border border-stone-200 space-y-3">
              <h4 className="font-display font-bold text-sm text-stone-900 uppercase tracking-wider">
                Materials & Equipment Needed
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                {(course.materialsNeeded && course.materialsNeeded.length > 0 ? course.materialsNeeded : [
                  'Linseed Oil & Turpentine',
                  'Raw Pigments & Oil Paints',
                  'Belgian Stretched Linen'
                ]).map((mat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-artisan-crimson" />
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-stone-500 pt-2 italic">
                * Full video streaming access in 4K quality is enabled on your account immediately upon enrollment.
              </p>
            </div>

            {/* Masterclass Artwork Gallery & Reference Photos (Portrait cards aspect-[4/5]) */}
            {galleryImages.length > 1 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-soft-lux space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
                    <Images className="w-5 h-5 text-artisan-crimson" />
                    <span>Masterclass Artwork Gallery & Reference Photos ({galleryImages.length})</span>
                  </h4>
                  <span className="text-xs text-stone-500">Click photo to view in main banner</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`relative rounded-2xl overflow-hidden aspect-[4/5] border-2 group cursor-pointer transition-all ${
                        idx === activeImageIndex
                          ? 'border-artisan-crimson ring-2 ring-artisan-crimson/30 shadow-md'
                          : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        View in Banner
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Direct Mentor Q&A Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <MessageSquare className="w-4 h-4 text-artisan-crimson" />
                <span>Need Personalized Guidance?</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Have questions regarding your current skill level or materials before joining? Contact Kuldeep Singh's studio directly at{' '}
                <a href="mailto:atelier@kuldeepsingh.art" className="font-bold text-artisan-crimson underline">
                  atelier@kuldeepsingh.art
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Video Lecture Streaming Player Modal */}
      {selectedLectureForStream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#1A1816] text-stone-100 rounded-3xl border border-artisan-gold/40 shadow-2xl flex flex-col max-h-[92vh] my-auto overflow-hidden">
            {/* Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between border-b border-stone-800 p-4 sm:p-6 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-artisan-gold/10 text-artisan-gold flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-artisan-gold tracking-widest block">
                    Kuldeep Singh Fine Art Académie • HD Stream
                  </span>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                    {selectedLectureForStream.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedLectureForStream(null)}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                title="Close Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content (Video Player) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain space-y-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner flex items-center justify-center">
                {selectedLectureForStream.videoUrl && (selectedLectureForStream.videoUrl.includes('youtube') || selectedLectureForStream.videoUrl.includes('youtu.be')) ? (
                  <iframe
                    src={
                      selectedLectureForStream.videoUrl.includes('watch?v=')
                        ? selectedLectureForStream.videoUrl.replace('watch?v=', 'embed/')
                        : selectedLectureForStream.videoUrl.includes('youtu.be/')
                        ? selectedLectureForStream.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                        : selectedLectureForStream.videoUrl.includes('shorts/')
                        ? selectedLectureForStream.videoUrl.replace('shorts/', 'embed/')
                        : selectedLectureForStream.videoUrl
                    }
                    title={selectedLectureForStream.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedLectureForStream.videoUrl && selectedLectureForStream.videoUrl.includes('vimeo.com') ? (
                  <iframe
                    src={
                      selectedLectureForStream.videoUrl.includes('player.vimeo.com')
                        ? selectedLectureForStream.videoUrl
                        : selectedLectureForStream.videoUrl.replace(/vimeo\.com\/(\d+)/, 'player.vimeo.com/video/$1')
                    }
                    title={selectedLectureForStream.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedLectureForStream.videoUrl && selectedLectureForStream.videoUrl.includes('drive.google.com') ? (
                  <iframe
                    src={
                      selectedLectureForStream.videoUrl.includes('/preview')
                        ? selectedLectureForStream.videoUrl
                        : selectedLectureForStream.videoUrl.replace(/\/view(\?.*)?$/, '/preview')
                    }
                    title={selectedLectureForStream.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : selectedLectureForStream.videoUrl && (
                  selectedLectureForStream.videoUrl.startsWith('data:video') ||
                  selectedLectureForStream.videoUrl.startsWith('blob:') ||
                  selectedLectureForStream.videoUrl.match(/\.(mp4|webm|ogg|m4v)($|\?)/i) ||
                  selectedLectureForStream.videoUrl.includes('r2.dev') ||
                  selectedLectureForStream.videoUrl.includes('cloudflare') ||
                  selectedLectureForStream.videoUrl.includes('s3') ||
                  selectedLectureForStream.videoUrl.includes('googleapis.com')
                ) ? (
                  <video
                    src={selectedLectureForStream.videoUrl}
                    controls
                    controlsList="nodownload"
                    className="w-full h-full object-contain bg-black"
                    autoPlay
                  >
                    Your browser does not support HTML5 video streaming.
                  </video>
                ) : selectedLectureForStream.videoUrl?.startsWith('http') ? (
                  <iframe
                    src={selectedLectureForStream.videoUrl}
                    title={selectedLectureForStream.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-artisan-gold/10 border border-artisan-gold/30 flex items-center justify-center">
                      <Play className="w-8 h-8 text-artisan-gold fill-artisan-gold ml-1" />
                    </div>
                    <p className="font-serif text-white text-lg">
                      Streaming Secure Video: {selectedLectureForStream.title}
                    </p>
                    <p className="text-xs text-stone-400 font-mono">
                      Stream URL: {selectedLectureForStream.videoUrl}
                    </p>
                    <p className="text-[11px] text-stone-500 max-w-md">
                      * Ultra-secure player. Screen recording, unauthorized sharing, and video downloads are strictly disabled.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer (Fixed at bottom) */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300 p-4 sm:p-6 pt-3 border-t border-stone-800 bg-[#1A1816] shrink-0">
              <span className="text-stone-400">
                Duration: <strong className="text-white">{selectedLectureForStream.duration}</strong>
              </span>
              <p className="text-xs text-stone-400 flex-1 min-w-0 px-2 truncate">
                {selectedLectureForStream.summary || 'Step-by-step master demonstration by Artist Kuldeep Singh.'}
              </p>
              <button
                onClick={() => setSelectedLectureForStream(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
