import React, { useState } from 'react';
import { BookOpen, Star, Clock, Sparkles, Shield, Search, Play, Calendar, ArrowRight, Video } from 'lucide-react';
import type { Course } from '../types';
import { useStudioData } from '../context/StudioDataContext';

interface CoursesPageProps {
  onSelectCourse: (course: Course) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onSelectCourse }) => {
  const { courses } = useStudioData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Oil Painting',
    'Realistic Sketching',
    'Watercolor & Fluid',
    'Color Theory',
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative z-10 pt-28 sm:pt-36 pb-28">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO HEADER */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-artisan-crimson/10 border border-artisan-crimson/20 text-xs font-bold text-artisan-crimson">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artist Kuldeep Singh Fine Art Académie</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#1A1816] leading-[1.1]">
            Learn Classical Oil, Realistic Sketching & Watercolor Mastery.
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Direct atelier mentorship from Artist Kuldeep Singh with 12+ years of professional practice. 
            Choose your specialization below to view the complete monthly syllabus and enrollment details.
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="mt-12 p-3 sm:p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-stone-200 shadow-soft-lux flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1A1816] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search masterclasses & lessons..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-800"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. COURSES GRID */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredCourses.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-stone-200">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-stone-800">No masterclasses match your filter</h3>
            <p className="text-xs text-stone-500">Try selecting 'All' or searching for different topics.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-artisan-crimson underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Course Banner Visual */}
                <div className="relative h-64 overflow-hidden bg-stone-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-stone-800 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-artisan-gold" />
                      {course.durationMonths}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{course.rating}</span>
                        <span className="text-stone-300 font-normal">({course.studentsEnrolled} artists)</span>
                      </div>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        Mentor: Artist Kuldeep Singh
                      </p>
                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-white/95 text-stone-900 text-xs font-bold flex items-center gap-1 group-hover:bg-white shadow-md">
                      <Play className="w-3 h-3 text-artisan-crimson fill-artisan-crimson" />
                      View Full Details
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-serif font-bold text-2xl text-stone-900 group-hover:text-artisan-crimson transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
                      {course.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-artisan-gold flex-shrink-0" />
                        <span>{course.durationHours} Hours Video Curriculum</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-artisan-crimson flex-shrink-0" />
                        <span>{course.totalLessons} Step-by-Step Lessons</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="space-y-3 pt-4 border-t border-stone-100">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
                          Tuition Fee ({course.durationMonths.split(' ')[0]} {course.durationMonths.split(' ')[1]})
                        </span>
                        <div className="flex items-baseline gap-2">
                          {course.originalPrice && (
                            <span className="text-xs text-stone-400 line-through">
                              ${course.originalPrice}
                            </span>
                          )}
                          <span className="font-serif font-bold text-2xl text-artisan-crimson">
                            ${course.price}
                          </span>
                          <span className="text-xs text-stone-500 font-semibold">USD</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCourse(course);
                          }}
                          className="px-5 py-2.5 bg-[#1A1816] group-hover:bg-artisan-crimson text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <span>Full Syllabus & Enroll</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. STUDENT SUCCESS & GUARANTEE */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-soft-lux">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                30-Day Artistic Growth Guarantee
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                If your paintings and drawings do not dramatically improve under Kuldeep Singh’s guidance within 30 days, receive a 100% full refund with no questions asked.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                4K Video Masterclasses
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Full HD and 4K step-by-step master demonstrations from initial ground preparation to final signature, accessible on any device.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-stone-900">
                12 Years of Mentorship
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Connect with thousands of dedicated artists worldwide. Submit assignments for personalized critique and monthly live studio feedback sessions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
