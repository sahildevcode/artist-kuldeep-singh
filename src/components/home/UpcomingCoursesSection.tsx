import React, { useState } from 'react';
import { Calendar, Clock, Star, Sparkles, MessageSquare, Flame, Bell, Quote } from 'lucide-react';
import { useStudioData } from '../../context/StudioDataContext';
import { InquiryModal } from '../modals/InquiryModal';
import type { UpcomingCourse } from '../../types';

export const UpcomingCoursesSection: React.FC = () => {
  const { upcomingCourses } = useStudioData();
  const [selectedCourseForInquiry, setSelectedCourseForInquiry] = useState<UpcomingCourse | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  // Filter only active upcoming courses
  const activeUpcoming = (upcomingCourses || []).filter((c) => c.isActive !== false);

  const handleOpenInquiry = (course: UpcomingCourse) => {
    setSelectedCourseForInquiry(course);
    setIsInquiryModalOpen(true);
  };

  return (
    <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative cv-auto">
      {/* Background ambient gold/rose glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-amber-100/40 via-artisan-gold/10 to-rose-100/30 blur-2xl pointer-events-none -z-10 rounded-full gpu-blur-ambient" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
        <div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-artisan-gold/20 via-amber-100 to-rose-100/40 border border-artisan-gold/30 px-3.5 py-1 rounded-full text-[11px] font-bold text-[#5C4010] uppercase tracking-widest mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-artisan-gold" />
            <span>Next-Generation Atelier Batches & Testimonials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Upcoming Courses
          </h2>
          <p className="text-sm text-stone-600 mt-2.5 max-w-2xl leading-relaxed">
            Reserve early-bird seats before public admissions open. Discover what our master painters and alumni say about forthcoming atelier diplomas.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCourseForInquiry(null);
            setIsInquiryModalOpen(true);
          }}
          className="mt-5 md:mt-0 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-artisan-crimson text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-2 self-start md:self-auto cursor-pointer active:scale-95 shrink-0"
        >
          <Bell className="w-3.5 h-3.5 text-artisan-gold" />
          <span>Notify Me for Future Batches</span>
        </button>
      </div>

      {/* Cards Grid */}
      {activeUpcoming.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/80 border border-stone-200/80 shadow-sm max-w-xl mx-auto">
          <Sparkles className="w-8 h-8 text-artisan-gold mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-stone-900">New Batches Being Scheduled</h3>
          <p className="text-xs text-stone-500 mt-1 mb-5">
            Artist Kuldeep Singh is currently curating the next seasonal masterclasses. Send us an inquiry to request custom batch topics or private atelier training.
          </p>
          <button
            onClick={() => setIsInquiryModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-artisan-gold text-white font-bold text-xs shadow-md hover:bg-amber-600 transition-colors cursor-pointer"
          >
            Enquire for Custom Batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {activeUpcoming.map((course) => (
            <div
              key={course.id}
              className="group bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden border border-stone-200/90 shadow-soft-lux hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 relative"
            >
              {/* Top Image & Badges */}
              <div className="relative h-56 overflow-hidden bg-stone-900">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Status / Announcement Badge */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                  <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-[10px] sm:text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 border border-white/20">
                    <Flame className="w-3 h-3 animate-pulse" />
                    <span>{course.badge || 'Launching Soon'}</span>
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>

                {/* Seats indicator badge */}
                {course.seatsLeft !== undefined && (
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-stone-900 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Only {course.seatsLeft} Seats Remaining</span>
                  </div>
                )}

                {/* Level Tag */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white">
                  {course.level}
                </div>
              </div>

              {/* Main Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-artisan-crimson transition-colors leading-snug">
                    {course.title}
                  </h3>

                  {/* Schedule Strip */}
                  <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-artisan-gold shrink-0" />
                      <span>{course.startDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{course.duration}</span>
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-3 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Testimonial / Scholar Anticipation Block (Specifically highlighting user requirement) */}
                {course.studentTestimonial && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 shadow-xs relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(course.studentTestimonial.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-artisan-gold flex items-center gap-1">
                        <Quote className="w-2.5 h-2.5" />
                        Scholar Review
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-700 italic leading-relaxed">
                      "{course.studentTestimonial.quote}"
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-stone-200/50">
                      <img
                        src={course.studentTestimonial.avatar}
                        alt={course.studentTestimonial.name}
                        className="w-5 h-5 rounded-full object-cover border border-white shadow-xs"
                      />
                      <span className="text-[10px] font-bold text-stone-900">
                        {course.studentTestimonial.name}
                      </span>
                      <span className="text-[9px] text-stone-400 truncate max-w-[140px]">
                        • {course.studentTestimonial.role}
                      </span>
                    </div>
                  </div>
                )}

                {/* Instructor Note */}
                {course.instructorQuote && !course.studentTestimonial && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/50 text-[11px] text-stone-700 italic">
                    <span className="font-bold text-[#5C4010] not-italic block mb-0.5">🎨 Atelier Master Note:</span>
                    "{course.instructorQuote}"
                  </div>
                )}

                {/* Pricing & Pre-Register CTA Button */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold uppercase tracking-wider">
                      Pre-Booking Fee
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      {course.originalPrice && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="font-serif font-bold text-2xl text-stone-900">
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenInquiry(course)}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#1A1816] to-stone-800 hover:from-artisan-crimson hover:to-rose-700 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 group/btn shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-artisan-gold group-hover/btn:text-white transition-colors" />
                    <span>Pre-Book / Enquire</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inquiry Modal with pre-selected Course Subject */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => {
          setIsInquiryModalOpen(false);
          setSelectedCourseForInquiry(null);
        }}
        defaultSubject={
          selectedCourseForInquiry
            ? `Pre-Booking Inquiry: ${selectedCourseForInquiry.title} (${selectedCourseForInquiry.startDate})`
            : 'Upcoming Masterclasses & Atelier Batches'
        }
      />
    </section>
  );
};
