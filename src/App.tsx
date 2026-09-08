import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { StorePage } from './pages/StorePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import type { Artwork, Course } from './types';
import { Sparkles } from 'lucide-react';

const AppInner: React.FC = () => {
  const getInitialPage = (): 'home' | 'about' | 'courses' | 'store' | 'course-detail' | 'admin' => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash === 'admin') return 'admin';
    if (hash === 'about') return 'about';
    if (hash === 'courses') return 'courses';
    if (hash === 'store') return 'store';
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'admin') return 'admin';
    return 'home';
  };

  const [activePage, setActivePage] = useState<'home' | 'about' | 'courses' | 'store' | 'course-detail' | 'admin'>(getInitialPage);
  const [showSplash, setShowSplash] = useState(() => getInitialPage() !== 'admin');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { courses } = useStudioData();
  const { isAdminAuthenticated, setIsAdminModalOpen } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') {
        setActivePage('admin');
        setShowSplash(false);
      } else if (['about', 'courses', 'store', 'home'].includes(hash)) {
        setActivePage(hash as any);
      } else if (!hash) {
        setActivePage('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (activePage === 'admin' && !isAdminAuthenticated) {
      setIsAdminModalOpen(true);
    }
  }, [activePage, isAdminAuthenticated, setIsAdminModalOpen]);

  // Scroll to top on page switch and sync URL hash
  const handlePageChange = (page: 'home' | 'about' | 'courses' | 'store' | 'course-detail' | 'admin') => {
    setActivePage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    handlePageChange('course-detail');
  };

  const navbarActivePage = activePage === 'course-detail' ? 'courses' : activePage === 'admin' ? 'home' : activePage;

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

      {/* Navigation Bar (Hidden when on full-screen Admin page) */}
      {activePage !== 'admin' && (
        <Navbar activePage={navbarActivePage} setActivePage={handlePageChange} />
      )}

      {/* Floating Owner Quick Bar when admin is logged in but browsing site */}
      {isAdminAuthenticated && activePage !== 'admin' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161412]/95 backdrop-blur-md text-stone-200 border border-artisan-gold/50 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-1.5 text-artisan-gold">
            <Sparkles className="w-4 h-4" />
            <span className="font-serif">Studio Owner Mode</span>
          </div>
          <span className="text-stone-700">|</span>
          <button
            onClick={() => handlePageChange('admin')}
            className="px-3 py-1 bg-artisan-gold hover:bg-amber-400 text-stone-950 font-bold rounded-full text-xs transition-colors shadow-xs"
          >
            Open Admin Panel
          </button>
        </div>
      )}

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
        {activePage === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboardPage
              onBackToSite={() => handlePageChange('home')}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#161412] text-stone-100">
              <div className="max-w-md w-full p-8 rounded-3xl bg-[#1F1C19] border border-artisan-gold/40 shadow-2xl text-center space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-artisan-gold/10 text-artisan-gold mx-auto flex items-center justify-center font-serif font-bold text-2xl border border-artisan-gold/30 shadow-lg">
                  KS
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-artisan-gold block">
                    Artist Kuldeep Singh Atelier Command
                  </span>
                  <h2 className="font-serif font-bold text-2xl text-white mt-1">
                    Studio Owner Portal
                  </h2>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    Direct access to original paintings inventory, video lecture streaming management, and live class broadcasting.
                  </p>
                </div>
                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => setIsAdminModalOpen(true)}
                    className="w-full py-3.5 bg-artisan-gold hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs shadow-xl transition-all hover:scale-[1.02]"
                  >
                    Enter Master Studio Login
                  </button>
                  <button
                    onClick={() => handlePageChange('home')}
                    className="text-xs text-stone-500 hover:text-stone-300 underline block mx-auto transition-colors"
                  >
                    Return to Public Fine Art Gallery
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer (Hidden when in Admin Dashboard) */}
      {activePage !== 'admin' && (
        <Footer setActivePage={handlePageChange} />
      )}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <AuthModal />
      <AdminLoginModal onSuccess={() => handlePageChange('admin')} />
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
