import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Video,
  Play,
  CheckCircle2,
  Clock,
  Award,
  ExternalLink,
  Download,
  Upload,
  MessageSquare,
  User,
  X,
  FileText,
  Volume2,
  Tv,
  Lock,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useAuth } from '../context/AuthContext';
import type { CourseLecture, EnrolledStudent } from '../types';
import confetti from 'canvas-confetti';

interface StudentPortalPageProps {
  setActivePage: (page: 'home' | 'about' | 'courses' | 'store' | 'course-detail' | 'student-portal') => void;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({ setActivePage }) => {
  const { courses, liveStatus, students, addStudent } = useStudioData();
  const { currentUser, login, isCourseUnlocked, unlockCourse } = useAuth();

  // Selected Enrolled Course (default to first course)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'course-oil-mastery');
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Enrollment Verification
  const isEnrolled = useMemo(() => {
    if (!activeCourse) return false;
    if (isCourseUnlocked(activeCourse.id)) return true;
    if (currentUser?.email === 'student@kuldeepsingh.art' && activeCourse.id === 'course-oil-mastery') return true;
    if (currentUser?.email === 'aarav.sharma@gmail.com') return true;
    if (currentUser?.email) {
      return students.some(
        (s) => s.courseId === activeCourse.id && s.email.toLowerCase() === currentUser.email.toLowerCase()
      );
    }
    return false;
  }, [activeCourse, currentUser, students, isCourseUnlocked]);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollName, setEnrollName] = useState(currentUser?.name || '');
  const [enrollEmail, setEnrollEmail] = useState(currentUser?.email || '');

  const handleDemoEnroll = (customEmail?: string, customName?: string) => {
    if (!activeCourse) return;
    const targetEmail = customEmail?.trim() || currentUser?.email || 'demo.student@kuldeepsingh.art';
    const targetName = customName?.trim() || currentUser?.name || 'Enrolled Scholar';

    if (!currentUser) {
      login(targetEmail, targetName, 'student');
    }
    unlockCourse(activeCourse.id);
    const newEnrolledStudent: EnrolledStudent = {
      id: 'stu-' + Date.now(),
      name: targetName,
      email: targetEmail,
      courseId: activeCourse.id,
      courseTitle: activeCourse.title,
      batchSchedule: activeCourse.schedule || 'Weekend Intensive Batch',
      enrolledDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      feesPaid: activeCourse.price,
      paymentStatus: 'Paid',
      progressPercent: 0
    };
    addStudent(newEnrolledStudent);
    setIsEnrollModalOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Active Lecture Streaming Modal
  const [streamingLecture, setStreamingLecture] = useState<CourseLecture | null>(null);

  // Completed Lectures Tracker
  const [completedLectureIds, setCompletedLectureIds] = useState<string[]>([
    'lec-1-1',
    'lec-1-2',
    'lec-1-3'
  ]);

  // Certificate Modal State
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Artwork Submission for Master Critique
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [submissionMedium, setSubmissionMedium] = useState('Oil on Canvas');
  const [submissionNote, setSubmissionNote] = useState('');
  const [submittedWork, setSubmittedWork] = useState<{
    title: string;
    medium: string;
    note: string;
    date: string;
    critiqueStatus: string;
  } | null>({
    title: 'Study of Rembrandt Light & Shadow (Chiaroscuro)',
    medium: 'Raw Umber & Lead White on Belgian Linen',
    note: 'Struggling with softening the transition along the lower cheekbone glaze.',
    date: '10 Sep, 2026',
    critiqueStatus: 'Reviewed by Kuldeep Singh'
  });
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Student Profile Data
  const studentName = currentUser?.name || 'Leo Montoya';
  const studentEmail = currentUser?.email || 'student@kuldeepsingh.art';
  const studentAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';

  const toggleLectureCompleted = (lecId: string) => {
    if (completedLectureIds.includes(lecId)) {
      setCompletedLectureIds((prev) => prev.filter((id) => id !== lecId));
    } else {
      setCompletedLectureIds((prev) => [...prev, lecId]);
    }
  };

  const handleOpenCertificate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsCertificateOpen(true);
  };

  const handleArtworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionTitle.trim()) return;
    setSubmittedWork({
      title: submissionTitle,
      medium: submissionMedium,
      note: submissionNote,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      critiqueStatus: 'Queued for Master Review'
    });
    setSubmissionSuccess(true);
    setSubmissionTitle('');
    setSubmissionNote('');
    setTimeout(() => setSubmissionSuccess(false), 4500);
  };

  // Google Meet link for live studio
  const isClassLive = Boolean(liveStatus?.isLive || activeCourse?.liveClassStatus === 'live');
  const liveMeetUrl = (liveStatus?.isLive ? liveStatus.liveStreamUrl : '') || activeCourse?.liveClassUrl || 'https://meet.google.com/ks-studio-atelier';

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* 1. PORTAL HERO & STUDENT PROFILE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1816] via-[#2A2420] to-[#12100E] text-stone-100 p-6 sm:p-10 border border-stone-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-artisan-crimson/15 to-artisan-ochre/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <img
                src={studentAvatar}
                alt={studentName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-artisan-gold shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[#1A1816] rounded-full" title="Active Student" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-full bg-artisan-gold/20 text-artisan-gold border border-artisan-gold/30">
                  Masterclass Student (LMS Portal)
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  ID: #STU-KS-2026-94
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {studentName}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                {studentEmail} • Continuous Fine Art Mentorship & Diploma
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                login('student@kuldeepsingh.art', 'Leo Montoya', 'student');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-artisan-gold" /> Demo Student: Leo
            </button>
            <button
              onClick={() => {
                login('aarav.sharma@gmail.com', 'Aarav Sharma', 'student');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" /> Demo Student: Aarav
            </button>
            <button
              onClick={handleOpenCertificate}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-artisan-gold to-amber-600 text-black hover:brightness-110 shadow-lg transition-all flex items-center gap-1.5 font-bold"
            >
              <Award className="w-4 h-4 text-stone-950" /> View Diploma Certificate
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 font-medium block">Enrolled Masterclasses</span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5 block">{courses.length}</span>
            <span className="text-[10px] text-emerald-400">All Modules Unlocked</span>
          </div>
          <div className="bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 font-medium block">Diploma Progress</span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-artisan-gold mt-0.5 block">68%</span>
            <span className="text-[10px] text-stone-400">14 of 24 Lectures Completed</span>
          </div>
          <div className="bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 font-medium block">Studio Demo Hours</span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5 block">42.5 hrs</span>
            <span className="text-[10px] text-artisan-ochre">4K High-Bitrate Masterclasses</span>
          </div>
          <div className="bg-stone-900/60 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 font-medium block">Atelier Attendance</span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-emerald-400 mt-0.5 block">98%</span>
            <span className="text-[10px] text-stone-400">Weekend Live Batch Regular</span>
          </div>
        </div>
      </div>

      {/* 2. LIVE STUDIO BROADCAST CALLOUT */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${
        isClassLive
          ? 'bg-red-950/20 border-red-500/40 ring-4 ring-red-500/10'
          : 'bg-stone-900 text-stone-100 border-stone-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl shrink-0 ${
              isClassLive
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-artisan-gold/10 text-artisan-gold'
            }`}>
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isClassLive ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                }`} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-artisan-gold">
                  {isClassLive ? '🔴 LIVE ON AIR NOW' : 'Next Scheduled Live Studio Session'}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                {isClassLive
                  ? 'Live Atelier: Master Alla Prima Portraiture Demonstration'
                  : 'Weekly Live Masterclass • Saturday & Sunday 6:00 PM IST'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
                Join Artist Kuldeep Singh live from the Chelsea Sanctuary studio. Bring your palette, brushes, and work-in-progress for live review.
              </p>
            </div>
          </div>

          <a
            href={liveMeetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-6 py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-xl flex items-center gap-2 shrink-0 transition-transform active:scale-95 ${
              isClassLive
                ? 'bg-red-600 hover:bg-red-700 text-white animate-bounce'
                : 'bg-artisan-crimson hover:bg-red-700 text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Join Live Google Meet Room</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3. ENROLLED COURSES TABS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                My Enrolled Masterclasses
              </h3>
              <button
                onClick={() => setActivePage('courses')}
                className="text-xs font-semibold text-artisan-crimson hover:underline"
              >
                Browse All Masterclasses &rarr;
              </button>
            </div>
            <p className="text-xs sm:text-sm text-stone-600">
              Select a diploma curriculum to continue your video lectures and exercise modules.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCourseId === course.id
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{course.title.length > 28 ? course.title.slice(0, 28) + '...' : course.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE COURSE DETAIL & LECTURE LIST */}
        {activeCourse && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Modules & Lectures */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] uppercase font-bold text-artisan-crimson tracking-wider">
                        {activeCourse.category} • {activeCourse.durationMonths}
                      </span>
                      {isEnrolled ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Enrolled & Unlocked</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Locked • Not Enrolled</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                      {activeCourse.title}
                    </h3>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-stone-800">Batch Schedule</span>
                      <p className="text-xs text-stone-500">{activeCourse.schedule}</p>
                    </div>
                    {!isEnrolled && (
                      <button
                        onClick={() => setIsEnrollModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-artisan-crimson to-artisan-ochre text-white text-xs font-bold shadow-md hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Enroll to Unlock (${activeCourse.price})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
                    <span>Curriculum Completion</span>
                    <span className="text-artisan-crimson">68% Finished</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-artisan-ochre to-artisan-crimson rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              {/* MODULES ACCORDION */}
              <div className="space-y-4">
                {activeCourse.modules.map((mod, modIdx) => (
                  <div key={mod.id || modIdx} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 font-serif font-bold flex items-center justify-center text-sm">
                          {modIdx + 1}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                            {mod.title}
                          </h4>
                          <span className="text-xs text-stone-500 font-medium">
                            {mod.duration || '4 Weeks'} • {(mod.lectures || []).length || mod.topics.length} Masterclass Demonstrations
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LECTURES LIST */}
                    <div className="space-y-2.5 pt-2">
                      {mod.lectures && mod.lectures.length > 0 ? (
                        mod.lectures.map((lec, lecIdx) => {
                          const isDone = completedLectureIds.includes(lec.id);
                          return (
                            <div
                              key={lec.id || lecIdx}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border transition-all gap-3 ${
                                isDone
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : 'bg-stone-50/80 border-stone-200 hover:border-artisan-gold/60'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => toggleLectureCompleted(lec.id)}
                                  className={`mt-0.5 p-1 rounded-lg transition-colors ${
                                    isDone ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'
                                  }`}
                                  title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <div>
                                  <h5 className="text-xs sm:text-sm font-semibold text-stone-900">
                                    {lec.title}
                                  </h5>
                                  <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {lec.duration || '45 Mins'}
                                    </span>
                                    <span className="flex items-center gap-1 text-artisan-crimson">
                                      <Volume2 className="w-3 h-3" /> HD Master Audio
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                {isEnrolled ? (
                                  <button
                                    onClick={() => setStreamingLecture(lec)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1A1816] text-white hover:bg-black transition-transform active:scale-95 shadow-sm flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-white" />
                                    <span>Watch Video</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setIsEnrollModalOpen(true)}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-800 hover:bg-amber-500 hover:text-white border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Locked (Enroll)</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        mod.topics.map((topic, tIdx) => {
                          const fakeId = `lec-${mod.id}-${tIdx}`;
                          const isDone = completedLectureIds.includes(fakeId);
                          return (
                            <div
                              key={fakeId}
                              className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200"
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleLectureCompleted(fakeId)}
                                  className={isDone ? 'text-emerald-600' : 'text-stone-400'}
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <span className="text-xs sm:text-sm font-semibold text-stone-800">
                                  {topic}
                                </span>
                              </div>
                              {isEnrolled ? (
                                <button
                                  onClick={() =>
                                    setStreamingLecture({
                                      id: fakeId,
                                      title: topic,
                                      duration: '50 Mins',
                                      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                                      summary: `Comprehensive masterclass demonstration covering ${topic} by Artist Kuldeep Singh.`
                                    })
                                  }
                                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 text-white flex items-center gap-1 cursor-pointer"
                                >
                                  <Play className="w-3 h-3 fill-white" /> Watch
                                </button>
                              ) : (
                                <button
                                  onClick={() => setIsEnrollModalOpen(true)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 cursor-pointer"
                                >
                                  <Lock className="w-3 h-3" /> Locked
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Master Critique Submission & Resources */}
            <div className="space-y-6">
              {/* MASTER CRITIQUE DESK */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <div className="w-8 h-8 rounded-xl bg-artisan-crimson/10 text-artisan-crimson flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">
                      Master Critique Desk
                    </h4>
                    <span className="text-[11px] text-stone-500">
                      Direct Review by Artist Kuldeep Singh
                    </span>
                  </div>
                </div>

                <form onSubmit={handleArtworkSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                      Painting / Sketch Title
                    </label>
                    <input
                      type="text"
                      value={submissionTitle}
                      onChange={(e) => setSubmissionTitle(e.target.value)}
                      placeholder="e.g. Master Study of Light on Linen"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-artisan-crimson bg-stone-50/60"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                      Medium Used
                    </label>
                    <select
                      value={submissionMedium}
                      onChange={(e) => setSubmissionMedium(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-artisan-crimson bg-stone-50/60"
                    >
                      <option value="Oil on Canvas">Oil on Canvas</option>
                      <option value="Charcoal on Cotton Rag">Charcoal on Cotton Rag</option>
                      <option value="Watercolor & Ink">Watercolor & Ink</option>
                      <option value="Acrylic & Mixed Media">Acrylic & Mixed Media</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                      Questions for Kuldeep Singh
                    </label>
                    <textarea
                      rows={3}
                      value={submissionNote}
                      onChange={(e) => setSubmissionNote(e.target.value)}
                      placeholder="What area did you struggle with? (Glazes, values, edges...)"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-artisan-crimson bg-stone-50/60"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-artisan-crimson hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Submit Work for Weekly Critique</span>
                  </button>

                  {submissionSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Artwork successfully submitted! Master Kuldeep Singh will review it this weekend.</span>
                    </div>
                  )}
                </form>

                {/* PAST CRITIQUE */}
                {submittedWork && (
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                      Recent Submission & Mentor Feedback
                    </span>
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-serif font-bold text-xs text-stone-900">
                          {submittedWork.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {submittedWork.critiqueStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 italic">
                        "{submittedWork.note}"
                      </p>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-[11px] text-stone-800 space-y-1">
                        <span className="font-bold text-artisan-crimson block">
                          Feedback from Kuldeep Singh:
                        </span>
                        <p>
                          "Excellent tonal values on the brow. For your next glaze layer, thin your raw umber with 10% more linseed oil to preserve the luminosity of the ground underneath. Keep it up!"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STUDY MATERIALS & ARCHIVAL GUIDES */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-artisan-gold" />
                  <span>Curriculum Downloads & Handouts</span>
                </h4>
                <div className="space-y-2">
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Downloading "Kuldeep Singh - Classical Color Temperature & Glaze Recipe Guide (PDF)"');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors"
                  >
                    <span>Classical Glaze Recipe Guide (PDF)</span>
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                  </a>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Downloading "Sight-Size Anatomical Proportions Template (PDF)"');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors"
                  >
                    <span>Sight-Size Proportions Template</span>
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                  </a>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Downloading "Archival Varnish Chemistry & Drying Times (PDF)"');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors"
                  >
                    <span>Archival Varnish Chemistry</span>
                    <Download className="w-3.5 h-3.5 text-stone-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. VIDEO LECTURE STREAMING MODAL */}
      {streamingLecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-[#1A1816] text-stone-100 rounded-3xl border border-artisan-gold/40 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-artisan-gold/10 text-artisan-gold flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-artisan-gold tracking-widest block">
                    Kuldeep Singh Fine Art Académie • HD 4K Stream
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white">
                    {streamingLecture.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setStreamingLecture(null)}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner flex items-center justify-center">
              {streamingLecture.videoUrl?.includes('youtube') || streamingLecture.videoUrl?.includes('youtu.be') ? (
                <iframe
                  src={
                    streamingLecture.videoUrl.includes('watch?v=')
                      ? streamingLecture.videoUrl.replace('watch?v=', 'embed/')
                      : streamingLecture.videoUrl.includes('youtu.be/')
                      ? streamingLecture.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                      : streamingLecture.videoUrl
                  }
                  title={streamingLecture.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : streamingLecture.videoUrl?.match(/\.(mp4|webm|ogg)($|\?)/i) ||
                streamingLecture.videoUrl?.includes('r2.dev') ||
                streamingLecture.videoUrl?.includes('cloudflare') ||
                streamingLecture.videoUrl?.includes('s3') ? (
                <video
                  src={streamingLecture.videoUrl}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain bg-black"
                  autoPlay
                >
                  Your browser does not support HTML5 video streaming.
                </video>
              ) : streamingLecture.videoUrl?.startsWith('http') ? (
                <iframe
                  src={streamingLecture.videoUrl}
                  title={streamingLecture.title}
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
                    Streaming Master Demonstration: {streamingLecture.title}
                  </p>
                  <p className="text-xs text-stone-400 font-mono">
                    Stream URL: {streamingLecture.videoUrl || 'No URL specified'}
                  </p>
                  <p className="text-[11px] text-stone-500 max-w-md">
                    * Ultra-secure player. Screen recording, unauthorized sharing, and video downloads are strictly disabled.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300 pt-2 border-t border-stone-800">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Runtime: {streamingLecture.duration || '45 Mins'}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    toggleLectureCompleted(streamingLecture.id);
                    setStreamingLecture(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DIPLOMA CERTIFICATE MODAL */}
      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#FDFBF7] text-[#1A1816] rounded-3xl border-4 border-artisan-gold/80 shadow-2xl p-8 sm:p-12 space-y-6 text-center">
            <button
              onClick={() => setIsCertificateOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-artisan-gold/15 text-artisan-gold flex items-center justify-center mx-auto border-2 border-artisan-gold">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-artisan-crimson block mb-1">
                Atelier of Fine Art Mastery
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Certificate of Academic Excellence
              </h3>
              <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">
                This is proudly conferred upon
              </p>
            </div>

            <div className="py-2 border-y-2 border-artisan-gold/40 max-w-md mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-artisan-crimson italic">
                {studentName}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
              Having demonstrated discipline, rigorous sight-size anatomical draftsmanship, and mastery of classical oil glazing and chemical medium rules under the direct mentorship of Artist Kuldeep Singh.
            </p>

            <div className="flex justify-between items-end pt-6 border-t border-stone-300 max-w-md mx-auto text-left">
              <div>
                <span className="text-[10px] text-stone-500 block uppercase">Date Issued</span>
                <span className="text-xs font-semibold text-stone-800">12 Sep, 2026</span>
              </div>
              <div className="text-right">
                <div className="font-serif italic text-base font-bold text-stone-900 border-b border-stone-800 pb-1">
                  Kuldeep Singh
                </div>
                <span className="text-[10px] text-stone-500 uppercase block mt-0.5">Master Painter & Atelier Founder</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-[#1A1816] text-white hover:bg-black font-semibold text-xs transition-transform active:scale-95 shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Print / Save Diploma PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DEMO ENROLLMENT & ACCESS MODAL */}
      {isEnrollModalOpen && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-stone-900 text-stone-100 rounded-3xl border border-artisan-gold/40 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setIsEnrollModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Course Access Control
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  Unlock Full Masterclass
                </h3>
              </div>
            </div>

            {/* Course Summary Card */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Selected Curriculum</span>
                <span className="px-2.5 py-0.5 rounded-full bg-artisan-crimson/20 text-artisan-crimson text-xs font-bold">
                  ₹{activeCourse.price.toLocaleString()} / ${(activeCourse.price / 83).toFixed(0)}
                </span>
              </div>
              <h4 className="font-serif font-bold text-stone-100 text-base">
                {activeCourse.title}
              </h4>
              <p className="text-xs text-stone-400">
                Includes all video lectures, downloadable guides, live Q&A rooms, and Master Diploma.
              </p>
            </div>

            {/* Test Simulation Notice */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Simulated / Test Gateway Active</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                Testing ke liye real Razorpay bank account ki zaroorat nahi hai. Neeche diye button par click karke aap instantly course unlock aur video playback test kar sakte hain.
              </p>
            </div>

            {/* Form & Actions */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={enrollName}
                    onChange={(e) => setEnrollName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    value={enrollEmail}
                    onChange={(e) => setEnrollEmail(e.target.value)}
                    placeholder="e.g. student@kuldeepsingh.art"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => handleDemoEnroll(enrollEmail, enrollName)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Simulate Instant Payment & Unlock (₹0 Test)</span>
                </button>
                <button
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="w-full py-2.5 rounded-xl text-stone-400 hover:text-white text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
