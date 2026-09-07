import React, { useState } from 'react';
import {
  Palette,
  GraduationCap,
  User,
  Package,
  Plus,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  ExternalLink,
  LogOut,
  Video,
  Clock,
  DollarSign,
  CheckCircle2,
  X
} from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MagneticButton } from '../components/ui/MagneticButton';
import type { Artwork, CourseLecture, MediumType, AchievementTimelineItem } from '../types';

interface AdminDashboardPageProps {
  onBackToSite: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBackToSite }) => {
  const {
    artworks,
    courses,
    artistProfile,
    timeline,
    addArtwork,
    updateArtwork,
    deleteArtwork,
    updateCourse,
    addLectureToModule,
    deleteLectureFromModule,
    updateArtistProfile,
    addTimelineItem,
    deleteTimelineItem,
    resetToDefaults
  } = useStudioData();

  const { adminLogout } = useAuth();
  const { orders } = useCart();

  const [activeTab, setActiveTab] = useState<'paintings' | 'courses' | 'about' | 'orders'>('paintings');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // 1. ADD / EDIT PAINTING STATE
  // -------------------------------------------------------------
  const [isPaintingModalOpen, setIsPaintingModalOpen] = useState(false);
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);
  const [artworkForm, setArtworkForm] = useState({
    title: '',
    subtitle: '',
    medium: 'Oil on Canvas' as MediumType,
    dimensions: '36 x 48 in (91 x 122 cm)',
    price: 3200,
    year: 2026,
    image: '',
    description: '',
    story: '',
    status: 'available' as 'available' | 'sold',
    framed: true,
    featured: false
  });

  const openNewPaintingModal = () => {
    setEditingArtworkId(null);
    setArtworkForm({
      title: '',
      subtitle: 'Original Fine Art Masterpiece',
      medium: 'Oil on Canvas',
      dimensions: '36 x 48 in (91 x 122 cm)',
      price: 3500,
      year: 2026,
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
      description: 'Handcrafted master oil work featuring classical multi-layered glazing and hand-ground mineral pigments.',
      story: 'Painted in the Chelsea atelier over several months of drying intervals.',
      status: 'available',
      framed: true,
      featured: true
    });
    setIsPaintingModalOpen(true);
  };

  const openEditPaintingModal = (art: Artwork) => {
    setEditingArtworkId(art.id);
    setArtworkForm({
      title: art.title,
      subtitle: art.subtitle,
      medium: art.medium,
      dimensions: art.dimensions,
      price: art.price,
      year: art.year,
      image: art.image,
      description: art.description,
      story: art.story,
      status: art.status === 'sold' ? 'sold' : 'available',
      framed: art.framed,
      featured: Boolean(art.featured)
    });
    setIsPaintingModalOpen(true);
  };

  const handleSavePainting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artworkForm.title || !artworkForm.image) {
      alert('Please provide a title and image URL.');
      return;
    }

    if (editingArtworkId) {
      updateArtwork(editingArtworkId, {
        title: artworkForm.title,
        subtitle: artworkForm.subtitle,
        medium: artworkForm.medium,
        dimensions: artworkForm.dimensions,
        price: Number(artworkForm.price),
        year: Number(artworkForm.year),
        image: artworkForm.image,
        description: artworkForm.description,
        story: artworkForm.story,
        status: artworkForm.status,
        framed: artworkForm.framed,
        featured: artworkForm.featured
      });
      showToast(`Artwork "${artworkForm.title}" updated successfully!`);
    } else {
      const newArt: Artwork = {
        id: 'art-' + Date.now(),
        title: artworkForm.title,
        subtitle: artworkForm.subtitle,
        medium: artworkForm.medium,
        dimensions: artworkForm.dimensions,
        price: Number(artworkForm.price),
        year: Number(artworkForm.year),
        image: artworkForm.image,
        description: artworkForm.description,
        story: artworkForm.story,
        status: artworkForm.status,
        framed: artworkForm.framed,
        featured: artworkForm.featured,
        paletteColors: ['#C5A059', '#1A1816', '#0E2A47', '#D97706'],
        weight: '12 lbs',
        varnishType: 'Archival Dammar Satin'
      };
      addArtwork(newArt);
      showToast(`New artwork "${newArt.title}" added to gallery!`);
    }
    setIsPaintingModalOpen(false);
  };

  // -------------------------------------------------------------
  // 2. COURSE & LECTURE EDIT STATE
  // -------------------------------------------------------------
  const [selectedCourseForLectures, setSelectedCourseForLectures] = useState<string>(
    courses[0]?.id || ''
  );
  const activeCourse = courses.find((c) => c.id === selectedCourseForLectures) || courses[0];

  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [lectureModuleIndex, setLectureModuleIndex] = useState(0);
  const [lectureForm, setLectureForm] = useState({
    title: '',
    duration: '45 Mins',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    summary: 'Step-by-step master demonstration with Kuldeep Sir.'
  });

  const openAddLectureModal = (modIdx: number) => {
    setLectureModuleIndex(modIdx);
    setLectureForm({
      title: `Lesson: Masterstroke Technique`,
      duration: '45 Mins',
      videoUrl: '',
      summary: 'In this high-definition lesson, Artist Kuldeep Singh demonstrates the exact pigment balance and stroke pressure.'
    });
    setIsLectureModalOpen(true);
  };

  const handleSaveLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse) return;
    const newLecture: CourseLecture = {
      id: 'lec-' + Date.now(),
      title: lectureForm.title,
      duration: lectureForm.duration,
      videoUrl: lectureForm.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      summary: lectureForm.summary
    };
    addLectureToModule(activeCourse.id, lectureModuleIndex, newLecture);
    showToast(`Lecture added to ${activeCourse.title}!`);
    setIsLectureModalOpen(false);
  };

  // -------------------------------------------------------------
  // 3. ABOUT PROFILE EDIT STATE
  // -------------------------------------------------------------
  const [profileForm, setProfileForm] = useState({ ...artistProfile });
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [timelineForm, setTimelineForm] = useState<AchievementTimelineItem>({
    year: '2026',
    title: '',
    roleOrLocation: '',
    description: '',
    milestoneType: 'Exhibition',
    highlightMetric: ''
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateArtistProfile(profileForm);
    showToast('Artist profile & biography updated in real-time!');
  };

  const handleSaveTimelineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineForm.title) return;
    addTimelineItem({ ...timelineForm });
    showToast(`Milestone "${timelineForm.title}" added to legacy!`);
    setIsTimelineModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#141210] text-stone-100 font-sans pb-20 selection:bg-artisan-gold selection:text-black">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-semibold text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#1B1816]/90 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-artisan-gold to-amber-500 text-stone-950 font-serif font-bold text-lg flex items-center justify-center shadow-lg">
            KS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-lg text-white">
                Artist Kuldeep Singh Atelier
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-artisan-gold/20 text-artisan-gold border border-artisan-gold/30">
                Owner Command
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Full Autonomy Control Center • Real-Time Live Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors border border-stone-700"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Restore original studio data? Any unsaved custom edits will be reset.')) {
                resetToDefaults();
                showToast('Studio data reset to factory demo values.');
              }
            }}
            title="Reset to original demo data"
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              adminLogout();
              onBackToSite();
            }}
            className="px-4 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-red-800/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#1E1B18] rounded-2xl border border-stone-800 w-fit">
          <button
            onClick={() => setActiveTab('paintings')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'paintings'
                ? 'bg-artisan-gold text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Paintings & Gallery ({artworks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-artisan-gold text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Masterclasses & Lectures ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'about'
                ? 'bg-artisan-gold text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>About Artist & 12Y Legacy</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-artisan-gold text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Collector Orders ({orders.length})</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: PAINTINGS & GALLERY MANAGER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'paintings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[#1A1815] rounded-3xl border border-stone-800">
              <div>
                <h2 className="font-serif font-bold text-xl text-white">
                  Fine Art Catalog Management
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Upload new artworks, edit descriptions, adjust prices, and toggle sold status.
                </p>
              </div>

              <MagneticButton
                onClick={openNewPaintingModal}
                variant="primary"
                className="px-5 py-2.5 bg-artisan-gold hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Painting</span>
              </MagneticButton>
            </div>

            {/* Artworks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((art) => (
                <div
                  key={art.id}
                  className="bg-[#1C1917] rounded-3xl border border-stone-800 overflow-hidden flex flex-col justify-between hover:border-stone-700 transition-all group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          art.status === 'available'
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-stone-800/90 text-stone-300'
                        }`}
                      >
                        {art.status}
                      </span>
                      {art.featured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-artisan-gold text-stone-950">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-artisan-gold font-bold block">
                        {art.medium} • {art.year}
                      </span>
                      <h3 className="font-serif font-bold text-base text-white mt-1">
                        {art.title}
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-2 mt-1">
                        {art.description}
                      </p>
                      <div className="text-xs text-stone-500 mt-2">
                        <span>Dimensions: {art.dimensions}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                      <span className="font-serif font-bold text-lg text-artisan-gold">
                        ${art.price.toLocaleString()} USD
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Quick Sold Toggle */}
                        <button
                          onClick={() => {
                            const newStatus = art.status === 'available' ? 'sold' : 'available';
                            updateArtwork(art.id, { status: newStatus });
                            showToast(`Status updated to "${newStatus}"!`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                            art.status === 'available'
                              ? 'border-stone-700 text-stone-300 hover:bg-stone-800'
                              : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/40'
                          }`}
                        >
                          {art.status === 'available' ? 'Mark Sold' : 'Mark Available'}
                        </button>

                        <button
                          onClick={() => openEditPaintingModal(art)}
                          className="p-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-colors"
                          title="Edit painting"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${art.title}" from catalog?`)) {
                              deleteArtwork(art.id);
                              showToast(`Artwork "${art.title}" deleted.`);
                            }
                          }}
                          className="p-2 text-red-400 hover:text-red-200 bg-red-950/40 hover:bg-red-900/40 rounded-xl transition-colors"
                          title="Delete painting"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: MASTERCLASSES & 40-VIDEO LECTURES MANAGER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'courses' && activeCourse && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Course Selector Header */}
            <div className="p-6 bg-[#1A1815] rounded-3xl border border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-artisan-gold block">
                  Select Masterclass to Configure
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {courses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCourseForLectures(c.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCourseForLectures === c.id
                          ? 'bg-artisan-gold text-stone-950 shadow-md'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-400 block">Total Curriculum Lessons</span>
                <span className="font-serif font-bold text-xl text-artisan-gold">
                  {activeCourse.totalLessons} Lectures
                </span>
              </div>
            </div>

            {/* Course Details Card */}
            <div className="p-6 bg-[#1C1917] rounded-3xl border border-stone-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    {activeCourse.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    {activeCourse.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 px-3 py-1.5 rounded-xl">
                    <DollarSign className="w-3.5 h-3.5 text-artisan-gold" />
                    <input
                      type="number"
                      value={activeCourse.price}
                      onChange={(e) => {
                        const newPrice = Number(e.target.value);
                        updateCourse(activeCourse.id, { price: newPrice });
                      }}
                      className="w-20 bg-transparent text-white text-sm font-bold outline-none"
                    />
                    <span className="text-[10px] text-stone-400 uppercase font-bold">USD</span>
                  </div>

                  <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-artisan-gold" />
                    <input
                      type="text"
                      value={activeCourse.durationMonths}
                      onChange={(e) => {
                        updateCourse(activeCourse.id, { durationMonths: e.target.value });
                      }}
                      className="w-44 bg-transparent text-white text-xs font-semibold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modules & Video Lectures */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-stone-200">
                    Curriculum Modules & Video Lectures
                  </h4>
                  <span className="text-xs text-stone-400">
                    Video Stream Access Active (No Downloads)
                  </span>
                </div>

                {activeCourse.modules.map((mod, modIdx) => (
                  <div
                    key={mod.id}
                    className="p-5 bg-[#201D1A] rounded-2xl border border-stone-800 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-artisan-gold">
                          Module {modIdx + 1}
                        </span>
                        <h5 className="font-serif font-bold text-sm text-white mt-0.5">
                          {mod.title}
                        </h5>
                        <p className="text-xs text-stone-400">
                          Duration: {mod.duration}
                        </p>
                      </div>

                      <button
                        onClick={() => openAddLectureModal(modIdx)}
                        className="px-3.5 py-1.5 bg-artisan-gold/20 hover:bg-artisan-gold text-artisan-gold hover:text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-artisan-gold/30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Video Lecture</span>
                      </button>
                    </div>

                    {/* Lecture List in this Module */}
                    <div className="space-y-2">
                      {mod.lectures && mod.lectures.length > 0 ? (
                        mod.lectures.map((lec, lecIdx) => (
                          <div
                            key={lec.id}
                            className="p-3 bg-stone-900/80 rounded-xl border border-stone-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-artisan-gold/10 text-artisan-gold flex items-center justify-center font-bold flex-shrink-0">
                                <Video className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <span className="font-bold text-white block truncate">
                                  {lec.title}
                                </span>
                                <span className="text-[11px] text-stone-400">
                                  {lec.duration} • Stream URL:{' '}
                                  <span className="font-mono text-[10px] text-artisan-gold">
                                    {lec.videoUrl || 'Standard Embed'}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                deleteLectureFromModule(activeCourse.id, modIdx, lecIdx);
                                showToast('Lecture removed.');
                              }}
                              className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="py-4 text-center text-xs text-stone-500 border border-dashed border-stone-800 rounded-xl">
                          <p>Topics defined: {mod.topics.join(' • ')}</p>
                          <p className="mt-1 text-[11px] text-stone-400">
                            Click "+ Add Video Lecture" to link specific Bunny/Cloudflare/YouTube videos to this week!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: ABOUT ARTIST & 12Y LEGACY MANAGER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 bg-[#1A1815] rounded-3xl border border-stone-800">
              <h2 className="font-serif font-bold text-xl text-white">
                Artist Biography & Legacy Customizer
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Customize Kuldeep Singh's bio, studio images, continuous mastery years, and exhibition timeline.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Card & Key Statistics */}
              <div className="p-6 bg-[#1C1917] rounded-3xl border border-stone-800 space-y-6">
                <h3 className="font-serif font-bold text-lg text-artisan-gold">
                  1. Artist Identity & Key Metrics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Artist Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Title / Atelier Role
                    </label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Years of Mastery
                    </label>
                    <input
                      type="text"
                      value={profileForm.yearsExperience}
                      onChange={(e) => setProfileForm({ ...profileForm, yearsExperience: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Artworks Collected
                    </label>
                    <input
                      type="text"
                      value={profileForm.artworksCount}
                      onChange={(e) => setProfileForm({ ...profileForm, artworksCount: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-800">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      International Exhibitions
                    </label>
                    <input
                      type="text"
                      value={profileForm.exhibitionsCount}
                      onChange={(e) => setProfileForm({ ...profileForm, exhibitionsCount: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Academy Students Trained
                    </label>
                    <input
                      type="text"
                      value={profileForm.studentsCount}
                      onChange={(e) => setProfileForm({ ...profileForm, studentsCount: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Bio & Studio Images */}
              <div className="p-6 bg-[#1C1917] rounded-3xl border border-stone-800 space-y-6">
                <h3 className="font-serif font-bold text-lg text-artisan-gold">
                  2. Headline, Biography & Sanctuary Images
                </h3>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Main Hero Headline
                  </label>
                  <input
                    type="text"
                    value={profileForm.bioHeadline}
                    onChange={(e) => setProfileForm({ ...profileForm, bioHeadline: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Philosophy Quote
                  </label>
                  <input
                    type="text"
                    value={profileForm.philosophyQuote}
                    onChange={(e) => setProfileForm({ ...profileForm, philosophyQuote: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Detailed Biography Narrative (Separate paragraphs with double enter)
                  </label>
                  <textarea
                    rows={4}
                    value={profileForm.bioStory.join('\n\n')}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        bioStory: e.target.value.split('\n\n').filter((p) => p.trim().length > 0)
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3.5 text-xs text-white outline-none focus:border-artisan-gold font-sans leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-800">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Studio / Portrait Photo URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.portraitImage}
                      onChange={(e) => setProfileForm({ ...profileForm, portraitImage: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Sanctuary Atmosphere Photo URL
                    </label>
                    <input
                      type="text"
                      value={profileForm.studioImage}
                      onChange={(e) => setProfileForm({ ...profileForm, studioImage: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <MagneticButton
                    type="submit"
                    variant="primary"
                    className="px-6 py-2.5 bg-artisan-gold hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Artist Profile Changes</span>
                  </MagneticButton>
                </div>
              </div>
            </form>

            {/* Timeline Milestones Section */}
            <div className="p-6 bg-[#1C1917] rounded-3xl border border-stone-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-artisan-gold">
                    3. Exhibition Milestones & Awards Timeline
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Showcase international accolades and gallery shows.
                  </p>
                </div>

                <button
                  onClick={() => setIsTimelineModalOpen(true)}
                  className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-artisan-gold">
                          {item.year}
                        </span>
                        <span className="text-stone-300 font-bold">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                          {item.roleOrLocation}
                        </span>
                      </div>
                      <p className="text-stone-400 text-[11px]">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        deleteTimelineItem(idx);
                        showToast('Milestone removed.');
                      }}
                      className="p-2 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: ORDERS & ENROLLED STUDENTS */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 bg-[#1A1815] rounded-3xl border border-stone-800">
              <h2 className="font-serif font-bold text-xl text-white">
                Collector Acquisitions & Student Enrollments
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Real-time record of all painting purchases and masterclass enrollments.
              </p>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-16 text-center text-stone-500 bg-[#1C1917] rounded-3xl border border-stone-800">
                  <Package className="w-10 h-10 mx-auto text-stone-600 mb-2" />
                  <p className="font-serif text-base text-stone-300">No orders recorded in session yet.</p>
                  <p className="text-xs text-stone-500 mt-1">
                    When patrons checkout or students enroll, their receipts will populate here automatically.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-[#1C1917] rounded-3xl border border-stone-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-800 pb-3">
                      <div>
                        <span className="font-mono font-bold text-artisan-gold text-sm">
                          #{order.id}
                        </span>
                        <span className="text-stone-400 ml-2">
                          {order.date} • {order.customerName} ({order.customerEmail})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {order.paymentStatus}
                        </span>
                        <span className="font-serif font-bold text-sm text-white">
                          ${order.totalAmount.toLocaleString()} USD
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-xl bg-stone-900 border border-stone-800"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold text-white block">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {item.type.toUpperCase()} • ${item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT PAINTING */}
      {/* ------------------------------------------------------------- */}
      {isPaintingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#1A1816] text-stone-100 rounded-3xl border border-artisan-gold/40 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPaintingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-2xl text-white mb-1">
              {editingArtworkId ? 'Edit Artwork' : 'Upload New Original Painting'}
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Fill in the fine art specifications to show in the store and home gallery.
            </p>

            <form onSubmit={handleSavePainting} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                    Painting Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={artworkForm.title}
                    onChange={(e) => setArtworkForm({ ...artworkForm, title: e.target.value })}
                    placeholder="e.g. Celestial Twilight in Amber"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                    Subtitle / Concept
                  </label>
                  <input
                    type="text"
                    value={artworkForm.subtitle}
                    onChange={(e) => setArtworkForm({ ...artworkForm, subtitle: e.target.value })}
                    placeholder="e.g. Study on Natural Light"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                    Medium
                  </label>
                  <select
                    value={artworkForm.medium}
                    onChange={(e) => setArtworkForm({ ...artworkForm, medium: e.target.value as MediumType })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  >
                    <option value="Oil on Canvas">Oil on Canvas</option>
                    <option value="Charcoal & Graphite">Charcoal & Graphite</option>
                    <option value="Watercolor & Ink">Watercolor & Ink</option>
                    <option value="Acrylic & Mixed Media">Acrylic & Mixed Media</option>
                    <option value="Limited Edition Print">Limited Edition Print</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                    Price (USD $) *
                  </label>
                  <input
                    type="number"
                    required
                    value={artworkForm.price}
                    onChange={(e) => setArtworkForm({ ...artworkForm, price: Number(e.target.value) })}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={artworkForm.dimensions}
                    onChange={(e) => setArtworkForm({ ...artworkForm, dimensions: e.target.value })}
                    placeholder="e.g. 36 x 48 in"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  High-Res Image URL *
                </label>
                <input
                  type="text"
                  required
                  value={artworkForm.image}
                  onChange={(e) => setArtworkForm({ ...artworkForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Description & Technique
                </label>
                <textarea
                  rows={3}
                  value={artworkForm.description}
                  onChange={(e) => setArtworkForm({ ...artworkForm, description: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-white outline-none focus:border-artisan-gold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={artworkForm.status === 'sold'}
                    onChange={(e) =>
                      setArtworkForm({ ...artworkForm, status: e.target.checked ? 'sold' : 'available' })
                    }
                    className="rounded border-stone-700 text-artisan-gold focus:ring-0"
                  />
                  <span>Mark as Sold / In Private Collection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={artworkForm.featured}
                    onChange={(e) => setArtworkForm({ ...artworkForm, featured: e.target.checked })}
                    className="rounded border-stone-700 text-artisan-gold focus:ring-0"
                  />
                  <span>Feature on Homepage Spotlight</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPaintingModalOpen(false)}
                  className="px-4 py-2 text-stone-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <MagneticButton
                  type="submit"
                  variant="primary"
                  className="px-6 py-2.5 bg-artisan-gold hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  {editingArtworkId ? 'Save Changes' : 'Publish Painting to Gallery'}
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD VIDEO LECTURE */}
      {/* ------------------------------------------------------------- */}
      {isLectureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#1A1816] text-stone-100 rounded-3xl border border-artisan-gold/40 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsLectureModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl text-white mb-1">
              Add Video Lecture to Module {lectureModuleIndex + 1}
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Enter the lecture details and stream link (Bunny Stream / Cloudflare / YouTube Unlisted).
            </p>

            <form onSubmit={handleSaveLecture} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Lecture Title *
                </label>
                <input
                  type="text"
                  required
                  value={lectureForm.title}
                  onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                  placeholder="e.g. Lesson 12: Preparing Rabbit Skin Glue & Sizing"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Duration (e.g. 45 Mins, 1 Hour)
                </label>
                <input
                  type="text"
                  value={lectureForm.duration}
                  onChange={(e) => setLectureForm({ ...lectureForm, duration: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Video Stream URL (Bunny Stream / Cloudflare / YouTube / Vimeo)
                </label>
                <input
                  type="text"
                  value={lectureForm.videoUrl}
                  onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                  placeholder="https://video.bunnycdn.com/embed/... or YouTube link"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Lesson Objective & Summary
                </label>
                <textarea
                  rows={3}
                  value={lectureForm.summary}
                  onChange={(e) => setLectureForm({ ...lectureForm, summary: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-white outline-none focus:border-artisan-gold"
                />
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLectureModalOpen(false)}
                  className="px-4 py-2 text-stone-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <MagneticButton
                  type="submit"
                  variant="primary"
                  className="px-6 py-2.5 bg-artisan-gold hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Save Lecture
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD TIMELINE MILESTONE */}
      {/* ------------------------------------------------------------- */}
      {isTimelineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#1A1816] text-stone-100 rounded-3xl border border-artisan-gold/40 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsTimelineModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl text-white mb-1">
              Add Exhibition / Award Milestone
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Enter milestone details to appear on the About & 12Y Legacy page.
            </p>

            <form onSubmit={handleSaveTimelineItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                    Year / Period *
                  </label>
                  <input
                    type="text"
                    required
                    value={timelineForm.year}
                    onChange={(e) => setTimelineForm({ ...timelineForm, year: e.target.value })}
                    placeholder="e.g. 2026"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                    Type
                  </label>
                  <select
                    value={timelineForm.milestoneType}
                    onChange={(e) =>
                      setTimelineForm({
                        ...timelineForm,
                        milestoneType: e.target.value as 'Exhibition' | 'Award' | 'Studio Milestone' | 'Publication'
                      })
                    }
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                  >
                    <option value="Exhibition">Exhibition</option>
                    <option value="Award">Award</option>
                    <option value="Studio Milestone">Studio Milestone</option>
                    <option value="Publication">Publication</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={timelineForm.title}
                  onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                  placeholder="e.g. Solo Exhibition: 'Mastery of Light'"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Location / Institution
                </label>
                <input
                  type="text"
                  value={timelineForm.roleOrLocation}
                  onChange={(e) => setTimelineForm({ ...timelineForm, roleOrLocation: e.target.value })}
                  placeholder="e.g. Royal Academy of Arts, London"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-artisan-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-white outline-none focus:border-artisan-gold"
                />
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimelineModalOpen(false)}
                  className="px-4 py-2 text-stone-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <MagneticButton
                  type="submit"
                  variant="primary"
                  className="px-6 py-2.5 bg-artisan-gold hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Add Milestone
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
