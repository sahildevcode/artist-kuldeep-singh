import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThreeBackground } from './components/3d/ThreeBackground';
import { PaintTrailCanvas } from './components/3d/PaintTrailCanvas';
import { ClickBubbleBurst } from './components/3d/ClickBubbleBurst';
import { CustomCursor } from './components/layout/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/modals/CartDrawer';
import { AuthModal } from './components/modals/AuthModal';
import { ArtworkModal } from './components/modals/ArtworkModal';
import { CourseModal } from './components/modals/CourseModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { StorePage } from './pages/StorePage';
import type { Artwork, Course } from './types';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'courses' | 'store'>('home');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Scroll to top on page switch
  const handlePageChange = (page: 'home' | 'about' | 'courses' | 'store') => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="relative min-h-screen bg-[#FDFBF7] text-[#1A1816] selection:bg-artisan-crimson selection:text-white">
          {/* 3D WebGL Layer (Interactive Paintbrush & Palette in Background) */}
          <ThreeBackground />

          {/* Real-time Mouse Paint Droplet Trail */}
          <PaintTrailCanvas />

          {/* Click Bubble Burst Ripples */}
          <ClickBubbleBurst />

          {/* Boutique Cursor */}
          <CustomCursor />

          {/* Navigation Bar */}
          <Navbar activePage={activePage} setActivePage={handlePageChange} />

          {/* Active Page View */}
          <main className="relative z-10">
            {activePage === 'home' && (
              <HomePage
                setActivePage={handlePageChange}
                onSelectArtwork={(art) => setSelectedArtwork(art)}
                onSelectCourse={(course) => setSelectedCourse(course)}
              />
            )}
            {activePage === 'about' && (
              <AboutPage setActivePage={handlePageChange} />
            )}
            {activePage === 'courses' && (
              <CoursesPage
                onSelectCourse={(course) => setSelectedCourse(course)}
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
          <ArtworkModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
          <CourseModal
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
