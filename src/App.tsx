import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { StudioDataProvider, useStudioData } from './context/StudioDataContext';
import { ThreeBackground } from './components/3d/ThreeBackground';
import { PaintTrailCanvas } from './components/3d/PaintTrailCanvas';
import { ClickBubbleBurst } from './components/3d/ClickBubbleBurst';
import { CustomCursor } from './components/layout/CustomCursor';
import { IntroSplash } from './components/layout/IntroSplash';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/modals/CartDrawer';
import { AuthModal } from './components/modals/AuthModal';
import { ArtworkModal } from './components/modals/ArtworkModal';
import { OrderHistoryModal } from './components/modals/OrderHistoryModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { StorePage } from './pages/StorePage';
import type { Artwork, Course } from './types';

const AppInner: React.FC = () => {
  const getInitialPage = (): 'home' | 'about' | 'courses' | 'store' | 'course-detail' => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'about') return 'about';
    if (hash === 'courses') return 'courses';
    if (hash === 'store') return 'store';
    return 'home';
  };

  const [activePage, setActivePage] = useState<'home' | 'about' | 'courses' | 'store' | 'course-detail'>(getInitialPage);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { courses } = useStudioData();
  const { isCheckoutModalOpen, setIsCheckoutModalOpen } = useCart();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['about', 'courses', 'store', 'home'].includes(hash)) {
        setActivePage(hash as any);
      } else if (!hash) {
        setActivePage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll to top on page switch and sync URL hash
  const handlePageChange = (page: 'home' | 'about' | 'courses' | 'store' | 'course-detail') => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    handlePageChange('course-detail');
  };

  const navbarActivePage = activePage === 'course-detail' ? 'courses' : activePage;

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-[#1A1816] selection:bg-artisan-crimson selection:text-white">
      {/* Cinematic Intro Splash Animation for 'Artist Kuldeep Singh' */}
      {showSplash && <IntroSplash onFinish={() => setShowSplash(false)} />}

      {/* 3D WebGL Layer (Interactive Paintbrush & Palette in Background) */}
      <ThreeBackground />

      {/* Real-time Mouse Paint Droplet Trail */}
      <PaintTrailCanvas />

      {/* Click Bubble Burst Ripples */}
      <ClickBubbleBurst />

      {/* Boutique Cursor */}
      <CustomCursor />

      {/* Navigation Bar */}
      <Navbar activePage={navbarActivePage} setActivePage={handlePageChange} />

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
          <CoursesPage onSelectCourse={handleSelectCourse} />
        )}
        {activePage === 'course-detail' && selectedCourse && (
          <CourseDetailPage
            course={courses.find((c) => c.id === selectedCourse.id) || selectedCourse}
            onBack={() => handlePageChange('courses')}
          />
        )}
        {activePage === 'store' && (
          <StorePage
            onSelectArtwork={(art) => setSelectedArtwork(art)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={handlePageChange} />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <AuthModal />
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
      <OrderHistoryModal
        onNavigateToCourse={(courseId) => {
          const found = courses.find((c) => c.id === courseId);
          if (found) handleSelectCourse(found);
        }}
      />
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
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </StudioDataProvider>
  );
};

export default App;
