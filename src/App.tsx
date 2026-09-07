import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
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
import { COURSES } from './data/courses';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { StorePage } from './pages/StorePage';
import type { Artwork, Course } from './types';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activePage, setActivePage] = useState<'home' | 'about' | 'courses' | 'store' | 'course-detail'>('home');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Scroll to top on page switch
  const handlePageChange = (page: 'home' | 'about' | 'courses' | 'store' | 'course-detail') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    handlePageChange('course-detail');
  };

  const navbarActivePage = activePage === 'course-detail' ? 'courses' : activePage;

  return (
    <AuthProvider>
      <CartProvider>
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
                course={selectedCourse}
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
          <OrderHistoryModal
            onNavigateToCourse={(courseId) => {
              const found = COURSES.find((c) => c.id === courseId);
              if (found) handleSelectCourse(found);
            }}
          />
          <ArtworkModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
