import React, { useState } from 'react';
import { X, Play, CheckCircle2, Clock, BookOpen, Star, Sparkles, Shield, ShoppingBag } from 'lucide-react';
import type { Course } from '../../types';
import { useCart } from '../../context/CartContext';
import { MagneticButton } from '../ui/MagneticButton';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose }) => {
  const { addToCart } = useCart();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  if (!course) return null;

  const handleEnroll = () => {
    addToCart({
      id: course.id,
      type: 'course',
      title: course.title,
      subtitle: course.subtitle,
      price: course.price,
      image: course.thumbnail,
      mediumOrCategory: course.category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#FDFBF7] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-black shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video / Visual Teaser Banner */}
        <div className="relative h-64 sm:h-80 bg-stone-900 overflow-hidden flex items-center justify-center">
          {isPlayingVideo ? (
            <div className="w-full h-full relative bg-stone-950 flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full border-4 border-artisan-crimson border-t-transparent animate-spin" />
              <p className="font-serif italic text-lg">Streaming 4K Masterclass Lesson Preview...</p>
              <p className="text-xs text-stone-400">"Chapter 1: The Chemistry of Raw Earth Pigments & Solvents"</p>
              <button
                onClick={() => setIsPlayingVideo(false)}
                className="text-xs text-stone-400 underline hover:text-white"
              >
                Close Video Preview
              </button>
            </div>
          ) : (
            <>
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover opacity-65 scale-105 transition-transform duration-700 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              {/* Play Button */}
              <button
                onClick={() => setIsPlayingVideo(true)}
                className="relative z-10 w-20 h-20 rounded-full bg-white/90 hover:bg-white text-artisan-crimson flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group"
              >
                <Play className="w-8 h-8 fill-artisan-crimson ml-1 group-hover:scale-110 transition-transform" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between text-white text-xs">
                <span className="font-semibold flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-artisan-gold" />
                  {course.durationHours} Hours Total • {course.totalLessons} Master Lessons
                </span>
                <span className="bg-artisan-crimson text-white px-3 py-1 rounded-full font-bold">
                  Preview Available
                </span>
              </div>
            </>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-artisan-ochre/10 text-artisan-ochre">
                {course.category} • {course.level}
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1816] mt-2">
                {course.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 italic">
                {course.subtitle}
              </p>
            </div>

            {/* Price & Rating Box */}
            <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-right sm:min-w-[170px]">
              <div className="flex items-center justify-end gap-1 text-amber-500 text-xs font-bold mb-1">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{course.rating}</span>
                <span className="text-stone-400 font-normal">({course.studentsEnrolled} artists)</span>
              </div>
              <div className="flex items-baseline justify-end gap-2">
                {course.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ${course.originalPrice}
                  </span>
                )}
                <span className="font-serif font-bold text-2xl text-artisan-crimson">
                  ${course.price}
                </span>
              </div>
              <span className="text-[10px] text-stone-500 block">Lifetime Atelier Access</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {course.description}
          </p>

          {/* What You Will Learn */}
          <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
            <h4 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-artisan-gold" />
              What You Will Master:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.whatYouWillLearn.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Curriculum Modules */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-artisan-crimson" />
              Masterclass Curriculum ({course.modules.length} Modules)
            </h4>
            <div className="space-y-2">
              {course.modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveModuleIndex(activeModuleIndex === idx ? -1 : idx)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">{mod.title}</span>
                      <span className="text-[11px] text-stone-500">
                        {mod.lessonsCount} Lessons • {mod.duration}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-stone-400">
                      {activeModuleIndex === idx ? '−' : '+'}
                    </span>
                  </button>

                  {activeModuleIndex === idx && (
                    <div className="px-4 pb-3 pt-1 border-t border-stone-100 bg-stone-50/50 space-y-1.5">
                      {mod.topics.map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-2 text-xs text-stone-600">
                          <Play className="w-3 h-3 text-artisan-gold fill-artisan-gold" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Shield className="w-4 h-4 text-artisan-gold" />
              <span>30-Day Unconditional Artistic Mastery Guarantee</span>
            </div>
            <MagneticButton
              onClick={handleEnroll}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Enroll in Masterclass (${course.price})
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};
