import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Video,
  Play,
  CheckCircle2,
  Clock,
  ExternalLink,
  User,
  X,
  Volume2,
  Tv,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Radio,
  Calendar
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
  const { currentUser, login, logout, isCourseUnlocked, unlockCourse } = useAuth();

  // Selected Course (persists on reload)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ks_student_selected_course');
      if (saved) return saved;
    } catch (e) {
      console.warn(e);
    }
    return courses[0]?.id || 'course-oil-mastery';
  });

  useEffect(() => {
    if (selectedCourseId) {
      try {
        localStorage.setItem('ks_student_selected_course', selectedCourseId);
      } catch (e) {
        console.warn(e);
      }
    }
  }, [selectedCourseId]);

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Enrollment Verification
  const isEnrolled = useMemo(() => {
    if (!activeCourse) return false;
    if (currentUser?.email) {
      const inDatabase = students.some(
        (s) => s.courseId === activeCourse.id && s.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (inDatabase) return true;
    }
    if (isCourseUnlocked(activeCourse.id)) return true;
    return false;
  }, [activeCourse, currentUser, students, isCourseUnlocked]);

  // Auto-reconcile student enrollment with backend database
  useEffect(() => {
    if (!activeCourse || !currentUser?.email) return;
    const isUnlocked = isCourseUnlocked(activeCourse.id);
    const alreadyRegistered = students.some(
      (s) => s.courseId === activeCourse.id && s.email.toLowerCase() === currentUser.email.toLowerCase()
    );

    if (isUnlocked && !alreadyRegistered) {
      addStudent({
        id: 'stu-' + Date.now(),
        name: currentUser.name || 'Scholar Student',
        email: currentUser.email.toLowerCase(),
        courseId: activeCourse.id,
        courseTitle: activeCourse.title,
        batchSchedule: activeCourse.schedule || 'Live Atelier Batch',
        enrolledDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        feesPaid: activeCourse.price,
        paymentStatus: 'Paid',
        progressPercent: 0,
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
      });
    }
  }, [activeCourse, currentUser, students, isCourseUnlocked, addStudent]);

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

  // Unique Device & Tab Session Identifier
  const [deviceId] = useState<string>(() => {
    try {
      let id = sessionStorage.getItem('ks_student_device_id');
      if (!id) {
        id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
        sessionStorage.setItem('ks_student_device_id', id);
      }
      return id;
    } catch {
      return 'dev_' + Date.now();
    }
  });

  // Concurrent Session / Single-Device Enforcement State
  const [isDeviceBlocked, setIsDeviceBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState<string>('');
  const [isTransferringSession, setIsTransferringSession] = useState(false);

  // Send Heartbeat every 3.5 seconds when an enrolled student is in portal / watching live
  useEffect(() => {
    if (!currentUser?.email || !isEnrolled) {
      setIsDeviceBlocked(false);
      return;
    }

    let isMounted = true;

    const checkHeartbeat = async () => {
      try {
        const res = await fetch('https://kuldeep-singh-backend.onrender.com/api/session/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            deviceId: deviceId,
            courseId: activeCourse?.id
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.allowed === false) {
              setIsDeviceBlocked(true);
              setBlockMessage(data.message || 'Another device or tab is already watching with your account.');
              setStreamingLecture(null); // Terminate active video playback immediately
            } else {
              setIsDeviceBlocked(false);
            }
          }
        }
      } catch (err) {
        // Backend temporarily unavailable, don't interrupt student
      }
    };

    checkHeartbeat();
    const interval = setInterval(checkHeartbeat, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser?.email, isEnrolled, deviceId, activeCourse?.id]);

  const handleTakeoverSession = async () => {
    if (!currentUser?.email) return;
    setIsTransferringSession(true);
    try {
      const res = await fetch('https://kuldeep-singh-backend.onrender.com/api/session/takeover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          deviceId: deviceId,
          courseId: activeCourse?.id
        })
      });
      if (res.ok) {
        setIsDeviceBlocked(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTransferringSession(false);
    }
  };

  // Active Lecture Streaming Modal
  const [streamingLecture, setStreamingLecture] = useState<CourseLecture | null>(null);

  // Completed Lectures Tracker
  const [completedLectureIds, setCompletedLectureIds] = useState<string[]>([
    'lec-1-1',
    'lec-1-2'
  ]);

  const toggleLectureCompleted = (lecId: string) => {
    if (completedLectureIds.includes(lecId)) {
      setCompletedLectureIds((prev) => prev.filter((id) => id !== lecId));
    } else {
      setCompletedLectureIds((prev) => [...prev, lecId]);
    }
  };

  // Student Profile Data
  const studentName = currentUser?.name || 'Aarav Sharma';
  const studentEmail = currentUser?.email || 'aarav.sharma@gmail.com';
  const studentAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop';

  // Google Meet link for live studio
  const isClassLive = Boolean(liveStatus?.isLive || activeCourse?.liveClassStatus === 'live');
  const liveMeetUrl = (liveStatus?.isLive ? liveStatus.liveStreamUrl : '') || activeCourse?.liveClassUrl || 'https://meet.google.com/ks-studio-atelier';

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 font-sans">
      {/* ⚠️ SINGLE-DEVICE CONCURRENT STREAMING LOCKDOWN BANNER */}
      {isDeviceBlocked && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 border-2 border-red-500/80 p-6 sm:p-8 shadow-2xl text-white space-y-4 ring-8 ring-red-500/10 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0 text-red-400">
                <ShieldAlert className="w-7 h-7 animate-pulse text-red-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-wider">
                    Anti-Piracy & Multi-Device Protection
                  </span>
                  <span className="text-xs text-red-300 font-mono">1 Device Limit Active</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Active Session Detected on Another Device / Tab
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  {blockMessage || (
                    <>Aapka account (<span className="text-amber-300 font-mono font-semibold">{currentUser?.email}</span>) kisi doosre device (phone/laptop) ya doosre browser tab par live masterclass dekh raha hai. Kuldeep Singh Atelier ki security policy ke mutabik ek email se ek samay par sirf <strong>1 device</strong> par hi live streaming allowed hai.</>
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleTakeoverSession}
                disabled={isTransferringSession}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Tv className="w-4 h-4" />
                <span>{isTransferringSession ? 'Transferring...' : 'Stream on THIS Device (End Other)'}</span>
              </button>
              <button
                onClick={() => logout()}
                className="px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-semibold text-xs border border-stone-700 transition-colors cursor-pointer text-center"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. STUDENT PROFILE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1816] via-[#241F1C] to-[#12100E] text-stone-100 p-6 sm:p-8 border border-stone-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-artisan-crimson/15 to-artisan-ochre/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <img
                src={studentAvatar}
                alt={studentName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-artisan-gold shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#1A1816] rounded-full" title="Active Student" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-full bg-artisan-gold/20 text-artisan-gold border border-artisan-gold/30">
                  Student Portal
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {studentEmail}
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome, {studentName}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                Access your enrolled live masterclasses, join live sessions, and watch video lectures.
              </p>
            </div>
          </div>

          {/* Quick Demo Switchers for testing */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => login('aarav.sharma@gmail.com', 'Aarav Sharma', 'student')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                currentUser?.email === 'aarav.sharma@gmail.com'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student: Aarav (Enrolled)</span>
            </button>
            <button
              onClick={() => login('guest@test.com', 'Guest User', 'student')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                currentUser?.email === 'guest@test.com'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Guest (New User)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. COURSE / LIVE BATCH SELECTOR TABS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Your Masterclasses & Live Batches
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Select any class below to view its live meeting link and recorded lecture demonstrations.
            </p>
          </div>

          <button
            onClick={() => setActivePage('courses')}
            className="text-xs font-bold text-artisan-crimson hover:underline self-start sm:self-auto"
          >
            Browse All Masterclasses &rarr;
          </button>
        </div>

        {/* Course Pills or Clean Empty State */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-stone-300 space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">No Active Masterclasses or Batches</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Aapne admin panel se saare batches delete kar diye hain. Jaise hi aap Admin panel se naya batch schedule karenge, wo turant yahan live update ho jayega!
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {courses.map((course) => {
              const courseUnlocked =
                isCourseUnlocked(course.id) ||
                students.some(
                  (s) => s.courseId === course.id && s.email.toLowerCase() === currentUser?.email?.toLowerCase()
                );
              const isSelected = selectedCourseId === course.id;

              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`px-4 py-3 rounded-2xl text-left transition-all border shrink-0 cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-lg ring-2 ring-stone-900/20'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/10 text-artisan-gold' : 'bg-stone-100 text-stone-700'}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-serif line-clamp-1">
                      {course.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {courseUnlocked ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Enrolled
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500" /> Not Enrolled
                        </span>
                      )}
                      <span className="text-[10px] opacity-60">• {course.schedule ? course.schedule.split('•')[0] : 'Live'}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. ACTIVE COURSE: LIVE CLASS & VIDEO LECTURES (CLEAN FULL-WIDTH) */}
      {activeCourse && (
        <div className="space-y-6">
          {/* A. BATCH DETAILS & LIVE BROADCAST CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[11px] uppercase font-bold text-artisan-crimson tracking-wider bg-artisan-crimson/10 px-2.5 py-0.5 rounded-full">
                    {activeCourse.category}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    Duration: {activeCourse.durationMonths}
                  </span>
                  {isEnrolled ? (
                    <span className="px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Enrolled & Active</span>
                    </span>
                  ) : (
                    <span className="px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Not Enrolled</span>
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  {activeCourse.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                  {activeCourse.subtitle || 'Comprehensive classical mentorship under Artist Kuldeep Singh.'}
                </p>
              </div>

              {/* Batch Timing / Enroll Button */}
              <div className="flex flex-col sm:items-end justify-center gap-2 shrink-0">
                <div className="text-left sm:text-right bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-stone-800">
                    <Calendar className="w-3.5 h-3.5 text-artisan-crimson" />
                    <span>Batch Schedule</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">{activeCourse.schedule}</p>
                </div>

                {!isEnrolled && (
                  <button
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-artisan-crimson to-artisan-ochre text-white text-xs font-bold shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Enroll to Unlock (${activeCourse.price})</span>
                  </button>
                )}
              </div>
            </div>

            {/* LIVE CLASS STATUS & GOOGLE MEET ACCESS */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-all ${
              isClassLive
                ? 'bg-red-950/20 border-red-500/50 ring-4 ring-red-500/10'
                : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    isClassLive
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {isClassLive ? <Radio className="w-6 h-6 animate-pulse" /> : <Tv className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isClassLive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
                      }`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        isClassLive ? 'text-red-600 font-extrabold' : 'text-stone-700'
                      }`}>
                        {isClassLive ? '🔴 LIVE CLASS IN PROGRESS' : 'Live Classroom Details'}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 mt-0.5">
                      {isClassLive
                        ? 'Master Kuldeep Singh is currently live!'
                        : `Weekly Live Session • ${activeCourse.schedule}`}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {isClassLive
                        ? 'Click the button on the right to join the live studio meeting with your mentor.'
                        : 'Join using the Google Meet link below at your scheduled class time.'}
                    </p>
                  </div>
                </div>

                {/* Live Meet Action */}
                <div>
                  {isDeviceBlocked ? (
                    <button
                      onClick={handleTakeoverSession}
                      className="px-5 py-3 rounded-xl font-bold text-xs bg-red-950/80 border border-red-500 text-red-200 flex items-center gap-2 cursor-pointer hover:bg-red-900 transition-colors shadow-md"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                      <span>Live Stream Locked (Click to Takeover)</span>
                    </button>
                  ) : isEnrolled ? (
                    <a
                      href={liveMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                        isClassLive
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-bounce'
                          : 'bg-stone-900 hover:bg-black text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>{isClassLive ? 'Join Live Google Meet' : 'Open Google Meet Room'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => setIsEnrollModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Enroll to Get Meet Link</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* B. VIDEO LECTURES LMS (FULL WIDTH, CLEAN & ORGANIZED) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  Recorded Video Lectures & Demos
                </h3>
                <p className="text-xs sm:text-sm text-stone-600">
                  Watch step-by-step master demonstrations uploaded for this course.
                </p>
              </div>
              <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
                {activeCourse.modules.reduce((acc, m) => acc + (m.lectures?.length || m.topics.length), 0)} Total Lessons
              </span>
            </div>

            {/* Modules List */}
            <div className="space-y-4">
              {activeCourse.modules.map((mod, modIdx) => (
                <div key={mod.id || modIdx} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 font-serif font-bold flex items-center justify-center text-sm">
                      {modIdx + 1}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                        {mod.title}
                      </h4>
                      <span className="text-xs text-stone-500 font-medium">
                        {mod.duration || '4 Weeks'} • {(mod.lectures || []).length || mod.topics.length} Lectures
                      </span>
                    </div>
                  </div>

                  {/* Lectures inside this module */}
                  <div className="space-y-2.5">
                    {mod.lectures && mod.lectures.length > 0 ? (
                      mod.lectures.map((lec, lecIdx) => {
                        const isDone = completedLectureIds.includes(lec.id);
                        const isFree = lec.accessType === 'free' || lec.isFreePreview;
                        const canWatch = isEnrolled || isFree;

                        return (
                          <div
                            key={lec.id || lecIdx}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-3 ${
                              isDone
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : 'bg-stone-50/90 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleLectureCompleted(lec.id)}
                                className={`mt-0.5 p-1 rounded-lg transition-colors cursor-pointer ${
                                  isDone ? 'text-emerald-600' : 'text-stone-400 hover:text-stone-600'
                                }`}
                                title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5 className="text-sm font-semibold text-stone-900">
                                    {lec.title}
                                  </h5>
                                  {isFree && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      🎬 Free Preview / Trailer
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {lec.duration || '45 Mins'}
                                  </span>
                                  <span className="flex items-center gap-1 text-artisan-crimson">
                                    <Volume2 className="w-3 h-3" /> HD Master Audio
                                  </span>
                                  {lec.summary && (
                                    <span className="hidden md:inline text-stone-400">• {lec.summary}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              {canWatch ? (
                                <button
                                  onClick={() => setStreamingLecture(lec)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 ${
                                    isFree && !isEnrolled
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      : 'bg-[#1A1816] hover:bg-black text-white'
                                  }`}
                                >
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                  <span>{isFree && !isEnrolled ? 'Watch Free Trailer' : 'Watch Lecture'}</span>
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
                      <div className="py-6 text-center text-xs text-stone-500 bg-stone-50/60 rounded-2xl border border-dashed border-stone-200">
                        Class video recordings and demonstrations will appear here once published by Artist Kuldeep Singh.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                    Kuldeep Singh Fine Art Académie
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white">
                    {streamingLecture.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setStreamingLecture(null)}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner flex items-center justify-center">
              {streamingLecture.videoUrl && (streamingLecture.videoUrl.includes('youtube') || streamingLecture.videoUrl.includes('youtu.be')) ? (
                <iframe
                  src={
                    streamingLecture.videoUrl.includes('watch?v=')
                      ? streamingLecture.videoUrl.replace('watch?v=', 'embed/')
                      : streamingLecture.videoUrl.includes('youtu.be/')
                      ? streamingLecture.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/')
                      : streamingLecture.videoUrl.includes('shorts/')
                      ? streamingLecture.videoUrl.replace('shorts/', 'embed/')
                      : streamingLecture.videoUrl
                  }
                  title={streamingLecture.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : streamingLecture.videoUrl && streamingLecture.videoUrl.includes('vimeo.com') ? (
                <iframe
                  src={
                    streamingLecture.videoUrl.includes('player.vimeo.com')
                      ? streamingLecture.videoUrl
                      : streamingLecture.videoUrl.replace(/vimeo\.com\/(\d+)/, 'player.vimeo.com/video/$1')
                  }
                  title={streamingLecture.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : streamingLecture.videoUrl && streamingLecture.videoUrl.includes('drive.google.com') ? (
                <iframe
                  src={
                    streamingLecture.videoUrl.includes('/preview')
                      ? streamingLecture.videoUrl
                      : streamingLecture.videoUrl.replace(/\/view(\?.*)?$/, '/preview')
                  }
                  title={streamingLecture.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : streamingLecture.videoUrl && (
                streamingLecture.videoUrl.startsWith('data:video') ||
                streamingLecture.videoUrl.startsWith('blob:') ||
                streamingLecture.videoUrl.match(/\.(mp4|webm|ogg|m4v)($|\?)/i) ||
                streamingLecture.videoUrl.includes('r2.dev') ||
                streamingLecture.videoUrl.includes('cloudflare') ||
                streamingLecture.videoUrl.includes('s3') ||
                streamingLecture.videoUrl.includes('googleapis.com')
              ) ? (
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. DEMO ENROLLMENT & ACCESS MODAL */}
      {isEnrollModalOpen && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-stone-900 text-stone-100 rounded-3xl border border-artisan-gold/40 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setIsEnrollModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
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
                Includes all live studio classes, recorded video lectures, and direct Q&A room access.
              </p>
            </div>

            {/* Test Simulation Notice */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Simulated / Test Gateway Active</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                Testing ke liye real payment gateway ki zaroorat nahi hai. Neeche diye button par click karke aap instantly is course ko unlock aur video playback test kar sakte hain.
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
                    placeholder="e.g. aarav.sharma@gmail.com"
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
                  className="w-full py-2.5 rounded-xl text-stone-400 hover:text-white text-xs transition-colors cursor-pointer"
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
