import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Artwork, Course, CourseLecture, ArtistProfile, AchievementTimelineItem, Award } from '../types';
import { ARTWORKS } from '../data/artworks';
import { COURSES } from '../data/courses';
import { TIMELINE, AWARDS } from '../data/achievements';

const DEFAULT_PROFILE: ArtistProfile = {
  name: 'Artist Kuldeep Singh',
  title: 'Master Painter & Atelier Founder',
  tagline: '12 Years of Fine Art Mastery, Original Paintings & Masterclasses',
  yearsExperience: '12+',
  artworksCount: '450+',
  exhibitionsCount: '18',
  studentsCount: '5.2K+',
  portraitImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  studioImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  bioHeadline: 'A Life Dedicated to the Alchemy of Light, Oil & Form.',
  bioStory: [
    'Artist Kuldeep Singh has spent over a decade perfecting the discipline of classical European oil painting, anatomical draftsmanship, and pigment chemistry, bringing historical reverence into modern gallery spaces.',
    'In an era dominated by instantaneous digital algorithms, the act of grinding raw mineral earth into cold-pressed oil and applying it layer-by-layer to hand-stretched linen is an act of spiritual defiance.',
    'A painting should possess physical gravity. It should change as the sun moves across your room, revealing hidden glazes at twilight that were invisible at noon.'
  ],
  philosophyQuote: 'Every stroke of oil on linen is a conversation between human patience and natural light.',
  sanctuaryTitle: 'The Sanctuary in Chelsea, New York',
  sanctuaryLocation: 'Where centuries-old techniques meet boundless contemporary scale',
  contactEmail: 'atelier@kuldeepsingh.art',
  studioAddress: 'West 24th Street, Gallery District, Manhattan, NY 10011'
};

interface StudioDataContextType {
  artworks: Artwork[];
  courses: Course[];
  artistProfile: ArtistProfile;
  timeline: AchievementTimelineItem[];
  awards: Award[];
  // Paintings CRUD
  addArtwork: (artwork: Artwork) => void;
  updateArtwork: (id: string, updates: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  // Courses CRUD
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  // Lecture Management
  addLectureToModule: (courseId: string, moduleIndex: number, lecture: CourseLecture) => void;
  updateLectureInModule: (courseId: string, moduleIndex: number, lectureIndex: number, updates: Partial<CourseLecture>) => void;
  deleteLectureFromModule: (courseId: string, moduleIndex: number, lectureIndex: number) => void;
  // Profile & Legacy CRUD
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
  addTimelineItem: (item: AchievementTimelineItem) => void;
  updateTimelineItem: (index: number, updates: Partial<AchievementTimelineItem>) => void;
  deleteTimelineItem: (index: number) => void;
  // Factory Reset
  resetToDefaults: () => void;
}

const StudioDataContext = createContext<StudioDataContextType | undefined>(undefined);

export const StudioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Artworks State
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_artworks');
      return saved ? JSON.parse(saved) : ARTWORKS;
    } catch {
      return ARTWORKS;
    }
  });

  // 2. Courses State
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_courses');
      return saved ? JSON.parse(saved) : COURSES;
    } catch {
      return COURSES;
    }
  });

  // 3. Artist Profile State
  const [artistProfile, setArtistProfile] = useState<ArtistProfile>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // 4. Timeline State
  const [timeline, setTimeline] = useState<AchievementTimelineItem[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_timeline');
      return saved ? JSON.parse(saved) : TIMELINE;
    } catch {
      return TIMELINE;
    }
  });

  // 5. Awards State
  const [awards] = useState<Award[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_awards');
      return saved ? JSON.parse(saved) : AWARDS;
    } catch {
      return AWARDS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_artworks', JSON.stringify(artworks));
    } catch (e) {
      console.error(e);
    }
  }, [artworks]);

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_courses', JSON.stringify(courses));
    } catch (e) {
      console.error(e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_profile', JSON.stringify(artistProfile));
    } catch (e) {
      console.error(e);
    }
  }, [artistProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_timeline', JSON.stringify(timeline));
    } catch (e) {
      console.error(e);
    }
  }, [timeline]);

  // Painting Handlers
  const addArtwork = (artwork: Artwork) => {
    setArtworks((prev) => [artwork, ...prev]);
  };

  const updateArtwork = (id: string, updates: Partial<Artwork>) => {
    setArtworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((item) => item.id !== id));
  };

  // Course Handlers
  const addCourse = (course: Course) => {
    setCourses((prev) => [course, ...prev]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // Lecture Handlers
  const addLectureToModule = (courseId: string, moduleIndex: number, lecture: CourseLecture) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id !== courseId) return course;
        const newModules = [...course.modules];
        if (!newModules[moduleIndex]) return course;
        const currentLectures = newModules[moduleIndex].lectures || [];
        newModules[moduleIndex] = {
          ...newModules[moduleIndex],
          lectures: [...currentLectures, lecture],
          lessonsCount: currentLectures.length + 1,
          topics: [...newModules[moduleIndex].topics, lecture.title]
        };
        const total = newModules.reduce((acc, m) => acc + (m.lectures ? m.lectures.length : m.lessonsCount), 0);
        return {
          ...course,
          modules: newModules,
          totalLessons: total
        };
      })
    );
  };

  const updateLectureInModule = (
    courseId: string,
    moduleIndex: number,
    lectureIndex: number,
    updates: Partial<CourseLecture>
  ) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id !== courseId) return course;
        const newModules = [...course.modules];
        if (!newModules[moduleIndex]) return course;
        const currentLectures = [...(newModules[moduleIndex].lectures || [])];
        if (!currentLectures[lectureIndex]) return course;
        currentLectures[lectureIndex] = { ...currentLectures[lectureIndex], ...updates };
        newModules[moduleIndex] = {
          ...newModules[moduleIndex],
          lectures: currentLectures
        };
        return { ...course, modules: newModules };
      })
    );
  };

  const deleteLectureFromModule = (courseId: string, moduleIndex: number, lectureIndex: number) => {
    setCourses((prev) =>
      prev.map((course) => {
        if (course.id !== courseId) return course;
        const newModules = [...course.modules];
        if (!newModules[moduleIndex]) return course;
        const currentLectures = (newModules[moduleIndex].lectures || []).filter((_, idx) => idx !== lectureIndex);
        newModules[moduleIndex] = {
          ...newModules[moduleIndex],
          lectures: currentLectures,
          lessonsCount: currentLectures.length
        };
        const total = newModules.reduce((acc, m) => acc + (m.lectures ? m.lectures.length : m.lessonsCount), 0);
        return { ...course, modules: newModules, totalLessons: total };
      })
    );
  };

  // Profile Handlers
  const updateArtistProfile = (updates: Partial<ArtistProfile>) => {
    setArtistProfile((prev) => ({ ...prev, ...updates }));
  };

  const addTimelineItem = (item: AchievementTimelineItem) => {
    setTimeline((prev) => [item, ...prev]);
  };

  const updateTimelineItem = (index: number, updates: Partial<AchievementTimelineItem>) => {
    setTimeline((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...updates } : item))
    );
  };

  const deleteTimelineItem = (index: number) => {
    setTimeline((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Factory Reset
  const resetToDefaults = () => {
    localStorage.removeItem('kuldeep_studio_artworks');
    localStorage.removeItem('kuldeep_studio_courses');
    localStorage.removeItem('kuldeep_studio_profile');
    localStorage.removeItem('kuldeep_studio_timeline');
    localStorage.removeItem('kuldeep_studio_awards');
    setArtworks(ARTWORKS);
    setCourses(COURSES);
    setArtistProfile(DEFAULT_PROFILE);
    setTimeline(TIMELINE);
  };

  return (
    <StudioDataContext.Provider
      value={{
        artworks,
        courses,
        artistProfile,
        timeline,
        awards,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        addCourse,
        updateCourse,
        deleteCourse,
        addLectureToModule,
        updateLectureInModule,
        deleteLectureFromModule,
        updateArtistProfile,
        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,
        resetToDefaults
      }}
    >
      {children}
    </StudioDataContext.Provider>
  );
};

export const useStudioData = () => {
  const context = useContext(StudioDataContext);
  if (!context) {
    throw new Error('useStudioData must be used within a StudioDataProvider');
  }
  return context;
};
