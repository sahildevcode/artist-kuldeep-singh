import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StudioDataProvider, useStudioData } from './context/StudioDataContext';
import { AudioProvider } from './context/AudioContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThreeBackground } from './components/3d/ThreeBackground';
import { PortraitsPage } from './pages/PortraitsPage';
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

const AppInner: React.FC = () => {
  const getInitialPage = (): AppNavPage => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.replace('#', '').toLowerCase();

    if (path.includes('terms') || hash === 'terms') return 'terms';
    if (path.includes('privacy') || hash === 'privacy') return 'privacy';
    if (path.includes('refund') || hash === 'refund') return 'refund';
    if (path.includes('shipping') || hash === 'shipping') return 'shipping';
    if (path.includes('contact') || hash === 'contact') return 'contact';
    if (path.includes('student-portal') || hash.includes('student-portal')) return 'student-portal';
    if (path.includes('about') || hash === 'about') return 'about';
    if (path.includes('courses') || hash === 'courses') return 'courses';
    if (path.includes('portrait') || hash.includes('portrait') || path.includes('painting') || hash.includes('painting')) return 'portraits';
    if (path.includes('artwork-detail') || hash.includes('artwork-detail') || hash.includes('artwork')) return 'artwork-detail';
    if (path.includes('store') || hash === 'store') return 'store';
    return 'home';
  };

  const [activePage, setActivePage] = useState<AppNavPage>(getInitialPage);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { courses } = useStudioData();
  const { isCheckoutModalOpen, setIsCheckoutModalOpen } = useCart();

  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.replace('#', '').toLowerCase();

      if (path.includes('terms') || hash === 'terms') {
        setActivePage('terms');
      } else if (path.includes('privacy') || hash === 'privacy') {
        setActivePage('privacy');
      } else if (path.includes('refund') || hash === 'refund') {
        setActivePage('refund');
      } else if (path.includes('shipping') || hash === 'shipping') {
        setActivePage('shipping');
      } else if (path.includes('contact') || hash === 'contact') {
        setActivePage('contact');
      } else if (path.includes('student-portal') || hash.includes('student-portal')) {
        setActivePage('student-portal');
      } else if (path.includes('about') || hash === 'about') {
        setActivePage('about');
      } else if (path.includes('courses') || hash === 'courses') {
        setActivePage('courses');
      } else if (path.includes('portrait') || hash.includes('portrait') || path.includes('painting') || hash.includes('painting')) {
        setActivePage('portraits');
      } else if (path.includes('artwork-detail') || hash.includes('artwork-detail') || hash.includes('artwork')) {
        setActivePage('artwork-detail');
      } else if (path.includes('store') || hash === 'store') {
        setActivePage('store');
      } else if (!hash || hash === 'home') {
        setActivePage('home');
      }
    };

    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  // Scroll to top on page switch and sync URL hash
  const handlePageChange = (page: AppNavPage) => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
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
      : (['home', 'about', 'courses', 'store', 'student-portal', 'portraits'].includes(activePage)
          ? (activePage as any)
          : 'home');

  return (
    <div className="relative w-full max-w-full overflow-x-hidden min-h-screen bg-[#070708] text-[#F3EFE6] transition-colors duration-300 selection:bg-[#D4AF37] selection:text-black">
      {/* Cinematic Intro Splash Animation for 'Artist Kuldeep Singh' */}
      {showSplash && <IntroSplash onFinish={() => setShowSplash(false)} />}

      {/* 3D WebGL Layer (Interactive Paintbrush & Palette in Background) */}
      <ThreeBackground />

      {/* Navigation Bar */}
      <Navbar activePage={navbarActivePage as any} setActivePage={handlePageChange as any} />

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
          {activePage === 'portraits' && (
            <PortraitsPage
              onBackToHome={() => handlePageChange('home')}
              onSelectArtwork={handleSelectArtwork}
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
          {activePage === 'store' && (
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
