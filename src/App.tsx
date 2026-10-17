import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StudioDataProvider, useStudioData } from './context/StudioDataContext';
import { AudioProvider } from './context/AudioContext';
import { ThreeBackground } from './components/3d/ThreeBackground';
import { ScrollSignatureBackground } from './components/3d/ScrollSignatureBackground';
import { PaintTrailCanvas } from './components/3d/PaintTrailCanvas';
import { ClickBubbleBurst } from './components/3d/ClickBubbleBurst';
import { CustomCursor } from './components/layout/CustomCursor';
import { IntroSplash } from './components/layout/IntroSplash';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/modals/CartDrawer';
import { AuthModal } from './components/modals/AuthModal';
import { AtelierAudioPlayer } from './components/layout/AtelierAudioPlayer';
import { ArtworkModal } from './components/modals/ArtworkModal';
import { OrderHistoryModal } from './components/modals/OrderHistoryModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { StorePage } from './pages/StorePage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { LegalPage, type LegalTab } from './pages/LegalPage';
import type { Artwork, Course } from './types';

export type AppNavPage = 
  | 'home' 
  | 'about' 
  | 'courses' 
  | 'store' 
  | 'course-detail' 
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

  const navbarActivePage: 'home' | 'about' | 'courses' | 'store' | 'student-portal' = 
    activePage === 'course-detail'
      ? 'courses'
      : (['home', 'about', 'courses', 'store', 'student-portal'].includes(activePage)
          ? (activePage as 'home' | 'about' | 'courses' | 'store' | 'student-portal')
          : 'home');

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-[#1A1816] selection:bg-artisan-crimson selection:text-white">
      {/* Cinematic Intro Splash Animation for 'Artist Kuldeep Singh' */}
      {showSplash && <IntroSplash onFinish={() => setShowSplash(false)} />}

      {/* 3D WebGL Layer (Interactive Paintbrush & Palette in Background) */}
      <ThreeBackground />

      {/* Dynamic Calligraphy Handwriting Signature Background with Luminous Halo */}
      <ScrollSignatureBackground />

      {/* Real-time Mouse Paint Droplet Trail */}
      <PaintTrailCanvas />

      {/* Click Bubble Burst Ripples */}
      <ClickBubbleBurst />

      {/* Boutique Cursor */}
      <CustomCursor />

      {/* Navigation Bar */}
      <Navbar activePage={navbarActivePage} setActivePage={handlePageChange as any} />

      {/* Active Page View */}
      <main className="relative z-10">
        {activePage === 'home' && (
          <HomePage
            setActivePage={handlePageChange}
            onSelectArtwork={(art) => setSelectedArtwork(art)}
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
        {activePage === 'course-detail' && selectedCourse && (
          <CourseDetailPage
            course={courses.find((c) => c.id === selectedCourse.id) || selectedCourse}
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
        {activePage === 'store' && (
          <StorePage
            onSelectArtwork={(art) => setSelectedArtwork(art)}
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
      {/* Artwork Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StudioDataProvider>
      <AuthProvider>
        <CartProvider>
          <AudioProvider>
            <AppInner />
          </AudioProvider>
        </CartProvider>
      </AuthProvider>
    </StudioDataProvider>
  );
};

export default App;
