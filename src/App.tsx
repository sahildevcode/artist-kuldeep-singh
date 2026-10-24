import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StudioDataProvider, useStudioData } from './context/StudioDataContext';
import { AudioProvider } from './context/AudioContext';
import { ThemeProvider } from './context/ThemeContext';
import { IntroSplash } from './components/layout/IntroSplash';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/modals/CartDrawer';
import { AuthModal } from './components/modals/AuthModal';
import { AtelierAudioPlayer } from './components/layout/AtelierAudioPlayer';
import { ContactWidget } from './components/layout/ContactWidget';
import { OrderHistoryModal } from './components/modals/OrderHistoryModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { StorePage } from './pages/StorePage';
import { ArtworkDetailPage } from './pages/ArtworkDetailPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { LegalPage, type LegalTab } from './pages/LegalPage';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import type { Artwork, Course } from './types';

export type AppNavPage = 
  | 'home' 
  | 'portraits'
  | 'about' 
  | 'courses' 
  | 'store' 
  | 'course-detail' 
  | 'artwork-detail'
  | 'student-portal' 
  | 'terms' 
  | 'privacy' 
  | 'refund' 
  | 'shipping' 
  | 'contact';

export const pageToPath = (page: AppNavPage): string => {
  if (page === 'home') return '/';
  return `/${page}`;
};

export const pathToPage = (pathname: string, hash: string): AppNavPage => {
  const cleanPath = pathname.replace(/^\/+/, '').split('/')[0]?.toLowerCase() || '';
  const cleanHash = hash.replace(/^#+/, '').trim().toLowerCase();

  const target = cleanPath || cleanHash;

  if (target === 'portraits' || target.includes('portrait')) return 'portraits';
  if (target === 'about') return 'about';
  if (target === 'courses') return 'courses';
  if (target === 'course-detail') return 'course-detail';
  if (target === 'store') return 'store';
  if (target === 'artwork-detail' || target.includes('artwork')) return 'artwork-detail';
  if (target === 'student-portal') return 'student-portal';
  if (target === 'terms') return 'terms';
  if (target === 'privacy') return 'privacy';
  if (target === 'refund') return 'refund';
  if (target === 'shipping') return 'shipping';
  if (target === 'contact') return 'contact';

  return 'home';
};

const AppInner: React.FC = () => {
  const getInitialPage = (): AppNavPage => {
    if (typeof window !== 'undefined') {
      try {
        const redirectPath = sessionStorage.getItem('spa_redirect');
        if (redirectPath) {
          sessionStorage.removeItem('spa_redirect');
          window.history.replaceState(null, '', redirectPath);
          return pathToPage(redirectPath, '');
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return pathToPage(window.location.pathname, window.location.hash);
  };

  const [activePage, setActivePage] = useState<AppNavPage>(getInitialPage);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { courses } = useStudioData();
  const { isCheckoutModalOpen, setIsCheckoutModalOpen } = useCart();

  useEffect(() => {
    // If user arrived via an old hash link (e.g. /#about), cleanly migrate them to /about without hash
    if (window.location.hash) {
      const cleanPath = pageToPath(activePage);
      window.history.replaceState({ page: activePage }, '', cleanPath);
    }

    const handleNavigation = () => {
      const page = pathToPage(window.location.pathname, window.location.hash);
      setActivePage(page);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
    };
  }, [activePage]);

  // Scroll to top on page switch and sync clean URL path
  const handlePageChange = (page: AppNavPage) => {
    setActivePage(page);
    const targetPath = pageToPath(page);
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({ page }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    handlePageChange('course-detail');
  };

  const handleSelectArtwork = (art: Artwork) => {
    setSelectedArtwork(art);
    handlePageChange('artwork-detail');
  };

  const navbarActivePage: 'home' | 'about' | 'courses' | 'store' | 'student-portal' | 'portraits' = 
    activePage === 'course-detail'
      ? 'courses'
      : activePage === 'artwork-detail'
      ? 'store'
      : (['home', 'about', 'courses', 'store', 'student-portal'].includes(activePage)
          ? (activePage as 'home' | 'about' | 'courses' | 'store' | 'student-portal')
          : 'home');

  return (
    <div className="relative w-full max-w-full overflow-x-hidden min-h-screen bg-[#FDFBF7] dark:bg-[#0E0C0A] text-[#1A1816] dark:text-[#F5F2EB] transition-colors duration-300 selection:bg-artisan-crimson selection:text-white">
      {/* Cinematic Intro Splash Animation for 'Artist Kuldeep Singh' */}
      {showSplash && <IntroSplash onFinish={() => setShowSplash(false)} />}

      {/* 3D WebGL Layer (Interactive Paintbrush & Palette in Background) */}

      {/* Dynamic Calligraphy Handwriting Signature Background with Luminous Halo */}

      {/* Navigation Bar */}
      <Navbar activePage={navbarActivePage} setActivePage={handlePageChange as any} />

      {/* Active Page View wrapped in ErrorBoundary */}
      <ErrorBoundary>
        <main className="relative">
          {activePage === 'home' && (
            <HomePage
              setActivePage={handlePageChange}
              onSelectArtwork={handleSelectArtwork}
              onSelectCourse={handleSelectCourse}
            />
          )}
          {activePage === 'about' && (
            <AboutPage setActivePage={handlePageChange} />
          )}
          {activePage === 'courses' && (
            <CoursesPage
              onSelectCourse={handleSelectCourse}
              onGoToPortal={(courseId) => {
                try {
                  localStorage.setItem('ks_student_selected_course', courseId);
                } catch (e) {
                  console.warn(e);
                }
                handlePageChange('student-portal');
              }}
            />
          )}
          {activePage === 'course-detail' && (
            <CourseDetailPage
              course={courses.find((c) => selectedCourse && c.id === selectedCourse.id) || selectedCourse || courses[0]}
              onBack={() => handlePageChange('courses')}
              onGoToPortal={(courseId) => {
                try {
                  localStorage.setItem('ks_student_selected_course', courseId);
                } catch (e) {
                  console.warn(e);
                }
                handlePageChange('student-portal');
              }}
            />
          )}
          {activePage === 'artwork-detail' && (
            <ArtworkDetailPage
              artwork={selectedArtwork}
              onBack={() => handlePageChange('store')}
              onSelectArtwork={handleSelectArtwork}
            />
          )}
          {(activePage === 'store' || activePage === 'portraits') && (
            <StorePage
              onSelectArtwork={handleSelectArtwork}
            />
          )}
          {activePage === 'student-portal' && (
            <StudentPortalPage setActivePage={handlePageChange} />
          )}
          {['terms', 'privacy', 'refund', 'shipping', 'contact'].includes(activePage) && (
            <LegalPage
              initialTab={activePage as LegalTab}
              setActivePage={handlePageChange}
            />
          )}
        </main>
      </ErrorBoundary>

      {/* Footer */}
      <Footer setActivePage={handlePageChange} />

      {/* Global Modals & Drawers */}
      <AtelierAudioPlayer />
      <CartDrawer />
      <AuthModal />
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSuccessCourseEnroll={(courseId) => {
          try {
            localStorage.setItem('ks_student_selected_course', courseId);
          } catch (e) {
            console.warn(e);
          }
          handlePageChange('student-portal');
        }}
      />
      <OrderHistoryModal
        onNavigateToCourse={(courseId) => {
          try {
            localStorage.setItem('ks_student_selected_course', courseId);
          } catch (e) {
            console.warn(e);
          }
          handlePageChange('student-portal');
        }}
      />
      {/* Floating Multi-Channel Contact Atelier Widget (WhatsApp, Call, Insta, YouTube, Twitter) */}
      <ContactWidget />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <StudioDataProvider>
        <AuthProvider>
          <CartProvider>
            <AudioProvider>
              <AppInner />
            </AudioProvider>
          </CartProvider>
        </AuthProvider>
      </StudioDataProvider>
    </ThemeProvider>
  );
};

export default App;
