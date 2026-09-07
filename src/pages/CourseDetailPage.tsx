import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Star,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  Video,
  Play,
  Lock,
  Unlock,
  ShieldCheck,
  Check,
  MessageSquare
} from 'lucide-react';
import type { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MagneticButton } from '../components/ui/MagneticButton';
import confetti from 'canvas-confetti';

interface CourseDetailPageProps {
  course: Course;
  onBack: () => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ course, onBack }) => {
  const { currentUser, setIsAuthModalOpen, unlockCourse, isCourseUnlocked } = useAuth();
  const { addOrder } = useCart();
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState<boolean>(false);
  const [isProcessingEnroll, setIsProcessingEnroll] = useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  const isUnlocked = isCourseUnlocked(course.id);

  const handleEnrollClick = () => {
    // 1. Must be logged in
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    // 2. Process demo enrollment & unlock
    setIsProcessingEnroll(true);
    setTimeout(() => {
      unlockCourse(course.id);

      // Record in customer Order History
      addOrder({
        id: 'KS-2026-' + Math.floor(10000 + Math.random() * 90000),
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [
          {
            id: course.id,
            type: 'course',
            title: course.title,
            subtitle: `${course.durationMonths} by Artist Kuldeep Singh`,
            price: course.price,
            image: course.thumbnail,
            quantity: 1,
            mediumOrCategory: course.category,
          }
        ],
        subtotal: course.price,
        discount: 0,
        shipping: 0,
        totalAmount: course.price,
        paymentMethod: 'Demo Razorpay / UPI Express',
        paymentStatus: 'Paid',
        orderStatus: 'Course Active & Unlocked',
      });

      setIsProcessingEnroll(false);
      setShowSuccessBanner(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E63946', '#D97706', '#2563EB', '#C5A059']
        });
      } catch {
        // ignore
      }
    }, 1200);
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
        {/* 1. HERO HEADER */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Hero Overview */}
          <div className="lg:col-span-8 space-y-6">
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

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1816] leading-tight">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed italic">
              "{course.subtitle}"
            </p>

            {/* Mentor & Student Rating Strip */}
            <div className="flex flex-wrap items-center gap-6 pt-2 pb-4 border-y border-stone-200/80 text-xs text-stone-600">
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
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-stone-900">{course.rating} Rating</span>
                <span className="text-stone-400">({course.studentsEnrolled} artists enrolled)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-artisan-gold" />
                <span className="font-semibold text-stone-800">{course.startDate}</span>
              </div>
            </div>

            {/* Video Teaser Player or Thumbnail Showcase */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-stone-900 border border-stone-800 group">
              {isPlayingTeaser ? (
                <div className="w-full h-full relative bg-stone-950 flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full border-4 border-artisan-crimson border-t-transparent animate-spin" />
                  <p className="font-serif italic text-lg sm:text-xl">
                    Streaming 4K Masterclass Orientation with Kuldeep Singh...
                  </p>
                  <p className="text-xs text-stone-400">
                    "Lesson 1: Pigment Chemistry, Solvent Safety & Tonal Harmony"
                  </p>
                  <button
                    onClick={() => setIsPlayingTeaser(false)}
                    className="text-xs text-stone-400 underline hover:text-white pt-2"
                  >
                    Close Video Teaser
                  </button>
                </div>
              ) : (
                <>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

                  {/* Big Play Button */}
                  <button
                    onClick={() => setIsPlayingTeaser(true)}
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-white/95 hover:bg-white text-artisan-crimson flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
                    aria-label="Play Course Teaser"
                  >
                    <Play className="w-8 h-8 fill-artisan-crimson ml-1" />
                  </button>

                  <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-white text-xs">
                    <span className="font-medium bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-artisan-gold" />
                      4K Studio Demonstration Preview
                    </span>
                    <span className="bg-artisan-crimson text-white px-3 py-1.5 rounded-full font-bold">
                      {course.durationHours} Total Hours
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Course Narrative Description */}
            <div className="space-y-4 pt-4">
              <h3 className="font-serif font-bold text-2xl text-stone-900">
                About This Masterclass
              </h3>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
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
                {course.whatYouWillLearn.map((item, idx) => (
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
                          mod.lectures.map((lec) => (
                            <div key={lec.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/80 text-xs">
                              <div className="flex items-center gap-2 text-stone-800 font-medium">
                                <Play className="w-3.5 h-3.5 text-artisan-gold fill-artisan-gold flex-shrink-0" />
                                <span>{lec.title}</span>
                              </div>
                              <span className="text-[11px] text-stone-500 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                                {lec.duration}
                              </span>
                            </div>
                          ))
                        ) : (
                          mod.topics.map((topic, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700">
                              <Play className="w-3.5 h-3.5 text-artisan-gold fill-artisan-gold flex-shrink-0" />
                              <span>{topic}</span>
                            </div>
                          ))
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
                {course.materialsNeeded.map((mat, idx) => (
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
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: ENROLLMENT & PRICE ACTION CARD */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
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
                        ${course.originalPrice}
                      </span>
                    )}
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-artisan-crimson">
                      ${course.price}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">USD</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    One-time payment • Lifetime access to future revisions
                  </p>
                </div>
              )}

              {/* Success Notification if just enrolled */}
              {showSuccessBanner && (
                <div className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Success! Masterclass unlocked in your account.</span>
                </div>
              )}

              {/* Action Button: Enroll or Access */}
              <div>
                {isUnlocked ? (
                  <MagneticButton
                    onClick={() => setIsPlayingTeaser(true)}
                    variant="primary"
                    className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play className="w-4 h-4" />
                    <span>Access Classroom & Lectures</span>
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    onClick={handleEnrollClick}
                    disabled={isProcessingEnroll}
                    variant="primary"
                    className="w-full py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
                  >
                    {isProcessingEnroll ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Enrollment Demo...</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-artisan-gold" />
                        <span>Enroll in Masterclass (${course.price})</span>
                      </>
                    )}
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

            {/* Direct Mentor Q&A Card */}
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
    </div>
  );
};
