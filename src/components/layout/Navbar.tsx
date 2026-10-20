import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Sparkles, LogOut, BookOpen, Image as ImageIcon, Award, Compass, ShieldCheck, MessageSquare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useStudioData } from '../../context/StudioDataContext';
import { InquiryModal } from '../modals/InquiryModal';

interface NavbarProps {
  activePage: 'home' | 'about' | 'courses' | 'store' | 'student-portal';
  setActivePage: (page: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { totalItems, setIsCartOpen, orders, setIsOrderHistoryOpen } = useCart();
  const { currentUser, setIsAuthModalOpen, logout } = useAuth();
  const { liveStatus } = useStudioData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = typeof window !== 'undefined' ? window.scrollY > 20 : false;
    setIsScrolled(lastScrolled);

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const current = window.scrollY > 20;
          if (current !== lastScrolled) {
            lastScrolled = current;
            setIsScrolled(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: 'home' | 'about' | 'courses' | 'store' | 'student-portal'; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'About & Legacy', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'courses', label: 'Masterclasses', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'store', label: 'Gallery Store', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'student-portal', label: 'Student Portal', icon: <Sparkles className="w-3.5 h-3.5 text-artisan-gold" /> }
  ];

  const isUserEnrolledInLiveCourse = Boolean(
    liveStatus?.isLive &&
    (currentUser?.role === 'admin' || (
      liveStatus.courseId &&
      currentUser?.enrolledCourseIds &&
      currentUser.enrolledCourseIds.includes(liveStatus.courseId)
    ))
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-black/[0.06] shadow-sm'
            : 'bg-white/60 backdrop-blur-md border-b border-black/[0.03]'
        }`}
      >
        {/* Real-Time Global Broadcast Alert Banner (ONLY for Enrolled Students of this course) */}
        {isUserEnrolledInLiveCourse && (
          <div className="bg-gradient-to-r from-red-600 via-rose-700 to-amber-600 text-white px-3 sm:px-6 py-2 shadow-lg border-b border-red-400/40 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-2.5 truncate">
              <span className="flex h-3 w-3 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <div className="truncate flex items-center gap-1.5">
                <span className="bg-white/20 text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/30 shrink-0">
                  🔴 ON AIR
                </span>
                <span className="font-semibold text-white truncate text-[11px] sm:text-xs">
                  <span>Live Atelier Session Active: {liveStatus?.courseTitle || 'Your Enrolled Course'}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (liveStatus?.courseId) {
                    try {
                      localStorage.setItem('ks_student_selected_course', liveStatus.courseId);
                    } catch (e) {
                      console.warn(e);
                    }
                  }
                  setActivePage('student-portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white text-red-700 hover:bg-amber-50 font-bold px-3 py-1 rounded-full text-[11px] sm:text-xs transition-transform shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Enter Live Classroom</span>
                <span className="text-[10px]">→</span>
              </button>
            </div>
          </div>
        )}

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-3.5 sm:py-4'}`}>
          <div className="flex items-center justify-between gap-2">
            {/* Top Left: Logo */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => {
                  setActivePage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left group flex items-center gap-2 sm:gap-3 focus:outline-none cursor-pointer"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1A1816] text-white flex items-center justify-center font-serif text-lg sm:text-xl font-bold shadow-md group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  <span className="relative z-10">K</span>
                  <span className="absolute inset-0 bg-gradient-to-tr from-artisan-crimson/50 to-artisan-ochre/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[#1A1816] block leading-none">
                    KULDEEP <span className="font-light text-artisan-gold">SINGH</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-stone-500 font-medium block mt-1">
                    Artist • 12Y Fine Art Atelier
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links (Compact, Single-Line, Elegant) */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-stone-100/80 backdrop-blur-md p-1 rounded-full border border-stone-200/60 shadow-inner">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActivePage(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative px-2.5 py-1.5 lg:px-3.5 lg:py-1.5 rounded-full text-[11px] lg:text-xs font-semibold tracking-normal transition-all duration-300 flex items-center gap-1.5 select-none whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'text-white bg-[#1A1816] shadow-md shadow-black/10'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                    }`}
                  >
                    <span className="shrink-0">{link.icon}</span>
                    <span className="whitespace-nowrap">{link.label}</span>
                    {link.id === 'student-portal' && isUserEnrolledInLiveCourse && (
                      <span className="flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-sm whitespace-nowrap shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        LIVE
                      </span>
                    )}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-artisan-crimson animate-pulse shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Cart, User/Auth & Studio Inquiry */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1A1816] transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer shrink-0"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-stone-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-artisan-crimson text-white text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User Account / Login Button */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 pr-2.5 sm:pr-3 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors border border-stone-200 cursor-pointer whitespace-nowrap"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-white shrink-0"
                    />
                    <span className="text-[11px] sm:text-xs font-semibold text-stone-800 max-w-[80px] sm:max-w-[90px] truncate hidden sm:inline">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="p-2 border-b border-stone-100">
                        <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                        <p className="text-[11px] text-stone-500 capitalize flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-3 h-3 text-artisan-gold" />
                          {currentUser.role} Account
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsOrderHistoryOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-artisan-crimson hover:bg-stone-100 rounded-lg flex items-center justify-between cursor-pointer"
                        >
                          <span>📦 My Order History</span>
                          <span className="text-[10px] bg-artisan-crimson/10 text-artisan-crimson font-bold px-2 py-0.5 rounded-full">
                            {orders.length}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            if (currentUser.enrolledCourseIds && currentUser.enrolledCourseIds.length > 0) {
                              try {
                                localStorage.setItem('ks_student_selected_course', currentUser.enrolledCourseIds[0]);
                              } catch (e) {
                                console.warn(e);
                              }
                            }
                            setActivePage('student-portal');
                            setIsUserMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg flex items-center justify-between cursor-pointer"
                        >
                          Enrolled Courses
                          <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded-full">
                            {currentUser.enrolledCoursesCount || 0}
                          </span>
                        </button>
                      </div>
                      <div className="pt-1 border-t border-stone-100">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold tracking-wide text-white bg-[#1A1816] hover:bg-black rounded-full transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5 active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Sign In</span>
                </button>
              )}

              {/* Studio Inquiry Button (Right side, AFTER Sign In - Sab Se Last) */}
              <button
                onClick={() => setIsInquiryOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-artisan-gold/15 hover:bg-artisan-gold text-[#5C4010] hover:text-white border border-artisan-gold/40 text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer group shrink-0 active:scale-95 whitespace-nowrap"
                title="Send Studio Inquiry / पूछताछ करें"
              >
                <MessageSquare className="w-3.5 h-3.5 text-artisan-gold group-hover:text-white transition-colors shrink-0" />
                <span className="whitespace-nowrap">Inquiry</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 text-stone-700 hover:text-black focus:outline-none cursor-pointer shrink-0"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 px-4 pb-4 pt-2 glass-dropdown border-b border-stone-200/80">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActivePage(link.id);
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activePage === link.id
                      ? 'bg-[#1A1816] text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.id === 'student-portal' && isUserEnrolledInLiveCourse && (
                    <span className="ml-auto flex items-center gap-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      LIVE NOW
                    </span>
                  )}
                </button>
              ))}

              {/* Inquiry Button in Mobile Dropdown */}
              <button
                onClick={() => {
                  setIsInquiryOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#5C4010] bg-artisan-gold/15 hover:bg-artisan-gold/25 border border-artisan-gold/30 transition-all text-left cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-artisan-gold shrink-0" />
                <span>Enquire / पूछताछ (Direct Inquiry)</span>
              </button>

              <div className="pt-2 mt-1 border-t border-stone-200/60">
                <button
                  onClick={() => {
                    setActivePage('terms');
                    setIsMobileMenuOpen(false);
                    window.location.hash = 'terms';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-artisan-gold" />
                  <span>Terms & Legal Compliance (Razorpay)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Direct Studio Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </>
  );
};
