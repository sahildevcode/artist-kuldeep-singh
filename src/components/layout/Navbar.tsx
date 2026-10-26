import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Sparkles, LogOut, BookOpen, Image as ImageIcon, Award, Compass, ShieldCheck, MessageSquare, Sun, Moon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useStudioData } from '../../context/StudioDataContext';
import { useTheme } from '../../context/ThemeContext';
import { InquiryModal } from '../modals/InquiryModal';

interface NavbarProps {
  activePage: 'home' | 'about' | 'courses' | 'store' | 'student-portal';
  setActivePage: (page: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage }) => {
  const { totalItems, setIsCartOpen, orders, setIsOrderHistoryOpen } = useCart();
  const { currentUser, setIsAuthModalOpen, logout, setIsProfileModalOpen } = useAuth();
  const { liveStatus } = useStudioData();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
            ? 'bg-[#0E0C0A]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-md shadow-black/40'
            : 'bg-[#0E0C0A]/90 backdrop-blur-md border-b border-white/[0.06]'
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
                className="text-left group flex items-center gap-2.5 sm:gap-3.5 focus:outline-none cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F0EFEA] border border-stone-200/80 flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden shrink-0">
                  <img
                    src="/images/brand-logo.png"
                    alt="Artist Kuldeep Singh Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white block leading-none">
                    KULDEEP <span className="font-light text-artisan-gold">SINGH</span>
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links (Compact, Single-Line, Elegant) */}
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-white/95 backdrop-blur-md p-1 rounded-full border border-stone-200/80 shadow-md">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActivePage(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`group relative px-2.5 py-1.5 lg:px-3.5 lg:py-1.5 rounded-full text-[11px] lg:text-xs font-semibold tracking-normal transition-all duration-300 flex items-center gap-1.5 select-none whitespace-nowrap shrink-0 cursor-pointer overflow-hidden ${
                      isActive
                        ? 'text-white bg-[#1A1816] shadow-md shadow-black/20 ring-1 ring-white/10'
                        : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100 hover:shadow-[0_4px_16px_rgba(212,175,55,0.25)] hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                  >
                    {/* Golden Ambient Glow & Shimmer on Hover */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-amber-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    )}

                    <span className="relative z-10 shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:text-artisan-gold">
                      {link.icon}
                    </span>
                    <span className="relative z-10 whitespace-nowrap transition-colors duration-200">
                      {link.label}
                    </span>
                    {link.id === 'student-portal' && isUserEnrolledInLiveCourse && (
                      <span className="relative z-10 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-sm whitespace-nowrap shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        LIVE
                      </span>
                    )}
                    {isActive && (
                      <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-artisan-crimson animate-pulse shrink-0 shadow-[0_0_8px_#E63946]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Clean Desktop Actions & Mobile Menu Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Desktop Only: Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="hidden md:flex relative p-2 sm:p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-amber-400 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer shrink-0 border border-stone-200/60 dark:border-stone-700"
                aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                title={theme === 'dark' ? 'Light Theme ☀️ (दिन का मोड)' : 'Dark Theme 🌙 (रात का मोड)'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-700" />
                )}
              </button>

              {/* Cart Button: Visible on both Desktop and Mobile */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#1A1816] dark:text-[#FDFBF7] transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer shrink-0 border border-stone-200/60 dark:border-stone-700"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-800 dark:text-stone-200" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-artisan-crimson text-white text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Desktop Only: User Account / Login Button */}
              {currentUser ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    title="Account Details (Name and Email)"
                    className="flex items-center justify-center px-4 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 hover:border-artisan-gold/60 transition-all border border-stone-200 dark:border-stone-700 cursor-pointer whitespace-nowrap group shadow-sm"
                  >
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 max-w-[120px] truncate group-hover:text-artisan-gold transition-colors">
                      {currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-[#1A1715]/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200/80 dark:border-stone-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="p-2 border-b border-stone-100 dark:border-stone-800">
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{currentUser.name}</p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 capitalize flex items-center gap-1 mt-0.5">
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
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-artisan-crimson hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center justify-between cursor-pointer"
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
                          className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center justify-between cursor-pointer"
                        >
                          Enrolled Courses
                          <span className="text-[10px] bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded-full">
                            {currentUser.enrolledCoursesCount || 0}
                          </span>
                        </button>
                      </div>
                      <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg flex items-center gap-2 cursor-pointer"
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
                  className="hidden md:flex px-3.5 py-2 text-xs font-semibold tracking-wide text-stone-900 bg-white hover:bg-stone-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md items-center gap-1.5 active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Sign In</span>
                </button>
              )}

              {/* Desktop Only: Studio Inquiry Button */}
              <button
                onClick={() => setIsInquiryOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-artisan-gold/20 hover:bg-artisan-gold text-[#EADBBE] hover:text-stone-950 border border-artisan-gold/50 text-[11px] sm:text-xs font-bold transition-all shadow-xs cursor-pointer group shrink-0 active:scale-95 whitespace-nowrap"
                title="Send Studio Inquiry / पूछताछ करें"
              >
                <MessageSquare className="w-3.5 h-3.5 text-artisan-gold group-hover:text-stone-950 transition-colors shrink-0" />
                <span className="whitespace-nowrap">Inquiry</span>
              </button>

              {/* Mobile Menu Toggle Button: Sleek Luxury Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 flex items-center justify-center"
                aria-label="Open side navigation menu"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* LUXURY MOBILE SIDE NAVBAR (SLIDE-IN DRAWER WITH SMOOTH ANIMATION) */}
      {/* ============================================================== */}
      {/* 1. Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Slide-in Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 w-[84%] max-w-[340px] bg-[#0E0C0A] text-white border-l border-white/15 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile Navigation Drawer"
      >
        {/* Top Header of Drawer: Monogram + Title + Close Button */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0EFEA] border border-stone-200/80 flex items-center justify-center p-1 shadow-md overflow-hidden shrink-0">
              <img
                src="/images/brand-logo.png"
                alt="Artist Kuldeep Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-tight text-white leading-tight">
                KULDEEP <span className="text-artisan-gold font-light">SINGH</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-medium">
                Atelier & Academy
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all active:scale-90 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          {/* User Profile Card (if logged in) or Sign In Button */}
          {currentUser ? (
            <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 space-y-3">
              <div 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white group-hover:text-artisan-gold transition-colors truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-artisan-gold capitalize flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    {currentUser.role} Account • Edit Details
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsOrderHistoryOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>📦 Orders ({orders.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-stone-800 to-stone-900 border border-white/15 hover:border-artisan-gold/50 text-white text-xs font-bold flex items-center justify-between shadow-md cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-artisan-gold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Student / Collector Sign In</span>
              </div>
              <span className="text-[11px] text-artisan-gold font-semibold">Login →</span>
            </button>
          )}

          {/* Primary Navigation Links */}
          <div className="space-y-1">
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
              Navigation
            </div>
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActivePage(link.id);
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-stone-950 font-bold shadow-md'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-artisan-crimson' : 'text-stone-400'}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </div>
                  {link.id === 'student-portal' && isUserEnrolledInLiveCourse && (
                    <span className="flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      LIVE
                    </span>
                  )}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-artisan-crimson shadow-[0_0_8px_#E63946]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Studio Inquiry Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsInquiryOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-artisan-gold/25 via-artisan-gold/20 to-artisan-ochre/25 hover:from-artisan-gold/35 hover:to-artisan-ochre/35 border border-artisan-gold/50 text-[#F5E6CC] text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-artisan-gold shrink-0" />
              <span>Studio Inquiry / पूछताछ करें</span>
            </button>
          </div>

          {/* Day / Night Theme Toggle */}
          <button
            type="button"
            onClick={() => toggleTheme()}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/10 text-stone-300 border border-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-300" />
              )}
              <span>{theme === 'dark' ? 'Light Theme (दिन का मोड)' : 'Dark Theme (रात का मोड)'}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-200">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </span>
          </button>
        </div>

        {/* Footer of Drawer */}
        <div className="p-4 border-t border-white/10 bg-black/30 space-y-2">
          <button
            type="button"
            onClick={() => {
              setActivePage('terms');
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full flex items-center gap-2 text-[11px] text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-artisan-gold" />
            <span>Terms, Privacy & Razorpay Verified</span>
          </button>
          <div className="text-[10px] text-stone-500 tracking-wider">
            © Artist Kuldeep Singh Atelier • All Rights Reserved
          </div>
        </div>
      </aside>

      {/* Direct Studio Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </>
  );
};
