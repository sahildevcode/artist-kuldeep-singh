import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PromoCode, StoreDeliverySettings, Artwork, Course, CourseModule, CourseLecture, ArtistProfile, AchievementTimelineItem, Award, EnrolledStudent, LiveBroadcastStatus, UpcomingCourse, CollectorReview } from '../types';
import { ARTWORKS } from '../data/artworks';
import { COURSES } from '../data/courses';
import { TIMELINE, AWARDS } from '../data/achievements';
import { INITIAL_UPCOMING_COURSES } from '../data/upcomingCourses';
import { REVIEWS } from '../data/reviews';


export const DEFAULT_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'ARTISAN15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 0,
    isActive: true,
    description: '15% Off on Atelier Artworks & Prints'
  },
  {
    id: 'promo-2',
    code: 'KULDEEP15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 0,
    isActive: true,
    description: '15% Collector Welcome Discount'
  },
  {
    id: 'promo-3',
    code: 'VIP20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    isActive: true,
    description: '20% VIP Patron Discount'
  }
];

export const DEFAULT_DELIVERY_SETTINGS: StoreDeliverySettings = {
  deliveryFee: 0,
  freeDeliveryThreshold: 0,
  deliveryLabel: 'Insured Fine Art Delivery',
  isEnabled: false
};

const DEFAULT_PROFILE: ArtistProfile = {
  name: 'Artist Kuldeep Singh',
  title: 'Master Painter & Atelier Founder',
  tagline: '12 Years of Fine Art Mastery, Original Paintings & Masterclasses',
  yearsExperience: '12+',
  artworksCount: '450+',
  exhibitionsCount: '18',
  studentsCount: '5.2K+',
  portraitImage: '/images/artist-kuldeep-singh.jpg',
  studioImage: '/images/artist-kuldeep-singh.jpg',
  bioHeadline: 'A Life Dedicated to the Alchemy of Light, Oil & Form.',
  bioStory: [
    'Artist Kuldeep Singh has spent over a decade perfecting the discipline of classical European oil painting, anatomical draftsmanship, and pigment chemistry, bringing historical reverence into modern gallery spaces.',
    'In an era dominated by instantaneous digital algorithms, the act of grinding raw mineral earth into cold-pressed oil and applying it layer-by-layer to hand-stretched linen is an act of spiritual defiance.',
    'A painting should possess physical gravity. It should change as the sun moves across your room, revealing hidden glazes at twilight that were invisible at noon.'
  ],
  philosophyQuote: 'Every stroke of oil on linen is a conversation between human patience and natural light.',
  sanctuaryTitle: 'The Sanctuary in Chelsea, New York',
  sanctuaryLocation: 'Where centuries-old techniques meet boundless contemporary scale',
  contactEmail: 'artistkuldeepsingh26@gmail.com',
  studioAddress: 'Delhi, India',
  studioVideoUrl: '/videos/hero-cinematic.mp4',
  studioVideoTitle: 'Artist Kuldeep Singh • Master Oil Painting in Atelier',
  studioVideoPoster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
  heroShowcaseType: 'video',
  heroShowcaseBadge: 'Featured Canvas',
  heroShowcaseTitle: 'Artist Kuldeep Singh',
  heroShowcaseSubtitle: 'Original Oil on Belgian Linen (40 x 54 in)',
  heroShowcasePrice: '₹4,12,250',
  heroShowcaseImage: 'https://vz-bb84e70d-4d1.b-cdn.net/c6dd45dc-ae17-4465-a95e-ef3e67c996a6/thumbnail.jpg',
  heroShowcaseVideoUrl: '/videos/hero-cinematic.mp4',
  heroShowcaseCertificateText: 'Archival Certificate',
  aboutHeroBanner: '/images/artist-hero-banner.png',
  aboutSection01Image: '/images/buddha-tree-of-life-painting.jpg',
  aboutSection02Image: '/images/abstract-spiritual-canvas-print.jpg',
  aboutSection03Image: '/images/abstract-woman-leopard-eagle-painting.jpg',
  aboutSection04Image: '/images/abstract-face-contemporary-painting.jpg'
};

const INITIAL_STUDENTS: EnrolledStudent[] = [];

interface StudioDataContextType {
  artworks: Artwork[];
  courses: Course[];
  students: EnrolledStudent[];
  artistProfile: ArtistProfile;
  timeline: AchievementTimelineItem[];
  awards: Award[];
  liveStatus: LiveBroadcastStatus;
  upcomingCourses: UpcomingCourse[];
  // Upcoming Courses CRUD
  addUpcomingCourse: (course: UpcomingCourse) => void;
  updateUpcomingCourse: (id: string, updates: Partial<UpcomingCourse>) => void;
  deleteUpcomingCourse: (id: string) => void;
  // Testimonials / Reviews CRUD
  reviews: CollectorReview[];
  addReview: (review: CollectorReview) => void;
  updateReview: (id: string, updates: Partial<CollectorReview>) => void;
  deleteReview: (id: string) => void;
  // Promos & Delivery
  promoCodes: PromoCode[];
  deliverySettings: StoreDeliverySettings;
  addPromoCode: (promo: PromoCode) => void;
  updatePromoCode: (id: string, updates: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
  updateDeliverySettings: (updates: Partial<StoreDeliverySettings>) => void;
  // Paintings CRUD
  addArtwork: (artwork: Artwork) => void;
  updateArtwork: (id: string, updates: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  // Courses CRUD
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  // Students CRUD
  addStudent: (student: EnrolledStudent) => void;
  updateStudent: (id: string, updates: Partial<EnrolledStudent>) => void;
  deleteStudent: (id: string) => void;
  // Lecture & Module Management
  addLectureToModule: (courseId: string, moduleIndex: number, lecture: CourseLecture) => void;
  updateLectureInModule: (courseId: string, moduleIndex: number, lectureIndex: number, updates: Partial<CourseLecture>) => void;
  deleteLectureFromModule: (courseId: string, moduleIndex: number, lectureIndex: number) => void;
  addModuleToCourse: (courseId: string, title?: string, duration?: string) => void;
  deleteModuleFromCourse: (courseId: string, moduleIndex: number) => void;
  // Profile & Legacy CRUD
  updateArtistProfile: (updates: Partial<ArtistProfile>) => void;
  addTimelineItem: (item: AchievementTimelineItem) => void;
  updateTimelineItem: (index: number, updates: Partial<AchievementTimelineItem>) => void;
  deleteTimelineItem: (index: number) => void;
  // Factory Reset
  resetToDefaults: () => void;
}

const StudioDataContext = createContext<StudioDataContextType | undefined>(undefined);

const DUMMY_COURSE_IDS = ['course-oil-mastery', 'course-realistic-sketching', 'course-watercolor-fluid', 'course-color-alchemy'];

export const StudioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper to ensure all course modules have lecture objects without auto-generating fake ones
  const normalizeCourses = (courseList: Course[]): Course[] => {
    return (courseList || []).map((c) => ({
      ...c,
      modules: (c.modules || []).map((m) => {
        const lecs = Array.isArray(m.lectures) ? m.lectures : [];
        return {
          ...m,
          lectures: lecs,
          lessonsCount: lecs.length,
          topics: lecs.map((l) => l.title)
        };
      })
    }));
  };

  // Promos State
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_promos');
      return saved ? JSON.parse(saved) : DEFAULT_PROMO_CODES;
    } catch {
      return DEFAULT_PROMO_CODES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_promos', JSON.stringify(promoCodes));
    } catch {}
  }, [promoCodes]);

  // Delivery Settings State
  const [deliverySettings, setDeliverySettings] = useState<StoreDeliverySettings>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_delivery_v2');
      if (saved) return JSON.parse(saved);
      // Clean up legacy delivery fee if existed
      localStorage.removeItem('kuldeep_studio_delivery');
      return DEFAULT_DELIVERY_SETTINGS;
    } catch {
      return DEFAULT_DELIVERY_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_delivery_v2', JSON.stringify(deliverySettings));
    } catch {}
  }, [deliverySettings]);

  const addPromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [promo, ...prev]);
  };

  const updatePromoCode = (id: string, updates: Partial<PromoCode>) => {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
  };

  const updateDeliverySettings = (updates: Partial<StoreDeliverySettings>) => {
    setDeliverySettings((prev) => ({ ...prev, ...updates }));
  };

  // 1. Artworks State - Real-time cloud sync; never load stale demo/dummy artworks
  const [artworks, setArtworks] = useState<Artwork[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_artworks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((a: any) => a.id && !a.id.startsWith('art-0') && Number(a.price) > 100);
          if (valid.length > 0) {
            const cachedIds = new Set(valid.map((a: any) => a.id));
            const missing = ARTWORKS.filter((a) => !cachedIds.has(a.id));
            if (missing.length > 0) {
              const merged = [...valid, ...missing];
              try { localStorage.setItem('kuldeep_studio_artworks', JSON.stringify(merged)); } catch {}
              return merged;
            }
            if (valid.length < ARTWORKS.length) {
              return ARTWORKS;
            }
            return valid;
          }
        }
      }
      return ARTWORKS;
    } catch {
      return ARTWORKS;
    }
  });

  // 2. Courses State - Real-time cloud sync; never load stale demo/dummy courses
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_courses');
      const loaded: Course[] = saved ? JSON.parse(saved) : [];
      // Only filter out known dummy/demo course IDs - don't filter by price (price check was causing real courses to be hidden)
      const clean = (Array.isArray(loaded) && loaded.length > 0 ? loaded : []).filter((c: any) => !DUMMY_COURSE_IDS.includes(c.id));
      return normalizeCourses(clean);
    } catch {
      return [];
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

  // 6. Enrolled Students State
  const [students, setStudents] = useState<EnrolledStudent[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_students', JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  // 7. Live Studio Broadcast State
  const [liveStatus, setLiveStatus] = useState<LiveBroadcastStatus>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_live_status');
      return saved
        ? JSON.parse(saved)
        : {
            isLive: false,
            liveStreamUrl: 'https://meet.google.com/ks-studio-atelier',
            courseId: null,
            courseTitle: null,
            topic: 'Masterclass Live Studio Broadcast • Atelier Demonstration'
          };
    } catch {
      return {
        isLive: false,
        liveStreamUrl: 'https://meet.google.com/ks-studio-atelier',
        courseId: null,
        courseTitle: null,
        topic: 'Masterclass Live Studio Broadcast • Atelier Demonstration'
      };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_live_status', JSON.stringify(liveStatus));
    } catch (e) {
      console.error(e);
    }
  }, [liveStatus]);

  // 8. Upcoming Courses State
  const [upcomingCourses, setUpcomingCourses] = useState<UpcomingCourse[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_upcoming_courses_v2');
      return saved ? JSON.parse(saved) : INITIAL_UPCOMING_COURSES;
    } catch {
      return INITIAL_UPCOMING_COURSES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_upcoming_courses_v2', JSON.stringify(upcomingCourses));
    } catch (e) {
      console.error(e);
    }
  }, [upcomingCourses]);

  // 9. Testimonials / Reviews State
  const [reviews, setReviews] = useState<CollectorReview[]>(() => {
    try {
      const saved = localStorage.getItem('kuldeep_studio_testimonials');
      return saved ? JSON.parse(saved) : REVIEWS;
    } catch {
      return REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kuldeep_studio_testimonials', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Real-Time 24/7 Cloud Backend Synchronization (Artworks, Courses, Lectures & Live Broadcast)
  useEffect(() => {
    let isMounted = true;

    const fetchAllCloudData = async () => {
      try {
        // 1. Artworks
        const artRes = await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/artworks');
        if (artRes.ok) {
          const cloudArtworks: Artwork[] = await artRes.json();
          if (Array.isArray(cloudArtworks) && isMounted) {
            // Guard: never wipe local data with empty cloud response (cold-start protection)
                        // Normalize cloud artworks: preserve clean local /images/ paths where available
            const normalizedArtworks = cloudArtworks.map((cArt) => {
              const localMatch = ARTWORKS.find((a) => a.id === cArt.id);
              if (localMatch && cArt.image && cArt.image.startsWith('data:')) {
                return { ...cArt, image: localMatch.image };
              }
              return cArt;
            });

            setArtworks((prev) => {
              if (normalizedArtworks.length === 0 && prev.length > 0) return prev;
              return normalizedArtworks;
            });

            if (normalizedArtworks.length > 0) {
              try {
                localStorage.setItem('kuldeep_studio_artworks', JSON.stringify(normalizedArtworks));
              } catch {}
            }
          }
        }

        // 2. Courses, Lectures & Live Status
        const courseRes = await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/courses');
        if (courseRes.ok) {
          const cloudCourses: Course[] = await courseRes.json();
          if (Array.isArray(cloudCourses) && isMounted) {
            const clean = cloudCourses.filter((c) => !DUMMY_COURSE_IDS.includes(c.id));
            const normalized = normalizeCourses(clean);
            // Guard: never wipe local courses with empty cloud response (cold-start protection)
            setCourses((prev) => {
              if (normalized.length === 0 && prev.length > 0) return prev;
              return normalized;
            });
            if (normalized.length > 0) {
              try {
                localStorage.setItem('kuldeep_studio_courses', JSON.stringify(normalized));
              } catch {}
            }
          }
        }

        // 3. Students (Cloud is absolute source of truth)
        const stuRes = await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/students');
        if (stuRes.ok) {
          const cloudStudents: EnrolledStudent[] = await stuRes.json();
          if (Array.isArray(cloudStudents) && isMounted) {
            // Guard: never wipe local students with empty cloud response (cold-start protection)
            setStudents((prev) => {
              if (cloudStudents.length === 0 && prev.length > 0) return prev;
              return cloudStudents;
            });
            if (cloudStudents.length > 0) {
              try {
                localStorage.setItem('kuldeep_studio_students', JSON.stringify(cloudStudents));
              } catch {}
            }
          }
        }

        // 4. Live Broadcast Status
        const liveRes = await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/live');
        if (liveRes.ok) {
          const cloudLive = await liveRes.json();
          if (cloudLive && isMounted) {
            setLiveStatus({
              isLive: Boolean(cloudLive.isLive),
              liveStreamUrl: cloudLive.liveStreamUrl || 'https://meet.google.com/ks-studio-atelier',
              courseId: cloudLive.courseId || null,
              courseTitle: cloudLive.courseTitle || null,
              topic: cloudLive.topic || 'Masterclass Live Studio Broadcast • Atelier Demonstration',
              updatedAt: cloudLive.updatedAt
            });
          }
        }

        // 5. Artist Profile & Studio Reels
        const profileRes = await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/profile').catch(() => null);
        if (profileRes && profileRes.ok) {
          const cloudProfile = await profileRes.json();
          if (cloudProfile && isMounted) {
            setArtistProfile((prev) => {
              const merged = { ...prev, ...cloudProfile };
              if (JSON.stringify(prev) === JSON.stringify(merged)) return prev;
              return merged;
            });
          }
        }

        // 6. Upcoming Courses
        const upRes = await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/upcoming-courses').catch(() => null);
        if (upRes && upRes.ok) {
          const upData = await upRes.json();
          const list = upData?.upcomingCourses || (Array.isArray(upData) ? upData : null);
          if (Array.isArray(list) && isMounted) {
            setUpcomingCourses(list);
          }
        }

        // 7. Testimonials / Reviews
        const testRes = await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/testimonials').catch(() => null);
        if (testRes && testRes.ok) {
          const testData = await testRes.json();
          const list = testData?.testimonials || (Array.isArray(testData) ? testData : null);
          if (Array.isArray(list) && isMounted && list.length > 0) {
            setReviews(list);
          }
        }
      } catch (err) {
        console.warn('Could not fetch data from cloud backend, using cached data:', err);
      }
    };

    fetchAllCloudData();

    // EventSource for Instant Real-Time Push Sync across Admin and Website
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('https://kuldeep-singh-backend-nehy.onrender.com/api/events');
      eventSource.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          const type = raw.type;
          const data = raw.data || raw.payload;

          if (type === 'ARTWORK_CREATED' && data) {
            setArtworks((prev) => {
              if (prev.some((a) => a.id === data.id)) return prev;
              const next = [data, ...prev];
              try { localStorage.setItem('kuldeep_studio_artworks', JSON.stringify(next)); } catch {}
              return next;
            });
          } else if (type === 'ARTWORK_UPDATED' && data?.id) {
            setArtworks((prev) => {
              const next = prev.map((a) => a.id === data.id ? { ...a, ...data } : a);
              try { localStorage.setItem('kuldeep_studio_artworks', JSON.stringify(next)); } catch {}
              return next;
            });
          } else if (type === 'ARTWORK_DELETED' && data?.id) {
            setArtworks((prev) => {
              const next = prev.filter((a) => a.id !== data.id && (a as any)._id !== data.id);
              try { localStorage.setItem('kuldeep_studio_artworks', JSON.stringify(next)); } catch {}
              return next;
            });
          } else if (type === 'COURSE_ADDED' && data) {
            setCourses((prev) => {
              if (prev.some((c) => c.id === data.id)) return prev;
              const next = normalizeCourses([data, ...prev]);
              try { localStorage.setItem('kuldeep_studio_courses', JSON.stringify(next)); } catch {}
              return next;
            });
          } else if (type === 'COURSE_UPDATED' && data?.id) {
            setCourses((prev) => {
              const next = normalizeCourses(prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
              try { localStorage.setItem('kuldeep_studio_courses', JSON.stringify(next)); } catch {}
              return next;
            });
          } else if (type === 'COURSE_DELETED' && data?.id) {
            setCourses((prev) => {
              const next = prev.filter((c) => c.id !== data.id);
              try { localStorage.setItem('kuldeep_studio_courses', JSON.stringify(next)); } catch {}
              return next;
            });
          } else if (type === 'LECTURE_DELETED' && data?.courseId) {
            setCourses((prev) => {
              const next = prev.map((course) => {
                if (course.id !== data.courseId) return course;
                const newModules = [...course.modules];
                if (!newModules[data.moduleIndex]) return course;
                const currentLectures = newModules[data.moduleIndex].lectures || [];
                const filtered = data.lectureId
                  ? currentLectures.filter((l) => l.id !== data.lectureId)
                  : currentLectures.filter((_, idx) => idx !== data.lectureIndex);
                newModules[data.moduleIndex] = {
                  ...newModules[data.moduleIndex],
                  lectures: filtered,
                  lessonsCount: filtered.length,
                  topics: filtered.map((l) => l.title)
                };
                const total = newModules.reduce((acc, m) => acc + (m.lectures ? m.lectures.length : m.lessonsCount), 0);
                return { ...course, modules: newModules, totalLessons: total };
              });
              try { localStorage.setItem('kuldeep_studio_courses', JSON.stringify(next)); } catch {}
              return next;
            });
          } else if (type === 'LIVE_STATUS_CHANGED' && data) {
            setLiveStatus({
              isLive: Boolean(data.isLive),
              liveStreamUrl: data.liveStreamUrl || 'https://meet.google.com/ks-studio-atelier',
              courseId: data.courseId || null,
              courseTitle: data.courseTitle || null,
              topic: data.topic || 'Masterclass Live Studio Broadcast • Atelier Demonstration',
              updatedAt: data.updatedAt
            });
          } else if (type === 'PROFILE_UPDATED' && data) {
            setArtistProfile((prev) => ({ ...prev, ...data }));
          } else if (type === 'UPCOMING_COURSE_CREATED' && data) {
            setUpcomingCourses((prev) => [data, ...prev.filter((c) => c.id !== data.id)]);
          } else if (type === 'UPCOMING_COURSE_UPDATED' && data?.id) {
            setUpcomingCourses((prev) => prev.map((c) => c.id === data.id ? { ...c, ...data } : c));
          } else if (type === 'UPCOMING_COURSE_DELETED' && data?.id) {
            setUpcomingCourses((prev) => prev.filter((c) => c.id !== data.id));
          } else if (type === 'TESTIMONIAL_CREATED' && data) {
            setReviews((prev) => [data, ...prev.filter((r) => r.id !== data.id)]);
          } else if (type === 'TESTIMONIAL_UPDATED' && data?.id) {
            setReviews((prev) => prev.map((r) => r.id === data.id ? { ...r, ...data } : r));
          } else if (type === 'TESTIMONIAL_DELETED' && data?.id) {
            setReviews((prev) => prev.filter((r) => r.id !== data.id));
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // fallback to polling
    }

    // Smart Zero-Poll Sync (Zero repetitive polling intervals - saves 100% idle bandwidth on Render)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAllCloudData();
      }
    };

    const onFocus = () => {
      fetchAllCloudData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', onFocus);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kuldeep_studio_courses' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && isMounted) {
            setCourses(normalizeCourses(parsed));
          }
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === 'kuldeep_studio_upcoming_courses' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && isMounted) {
            setUpcomingCourses(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
      if (e.key === 'kuldeep_studio_testimonials' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && isMounted) {
            setReviews(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      if (eventSource) eventSource.close();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

  // Painting Handlers (Local Optimistic + Instant 24/7 Cloud Sync)
  const addArtwork = async (artwork: Artwork) => {
    setArtworks((prev) => [artwork, ...prev]);
    try {
      await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/artworks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artwork)
      });
    } catch (err) {
      console.error('Error syncing new artwork to cloud database:', err);
    }
  };

  const updateArtwork = async (id: string, updates: Partial<Artwork>) => {
    setArtworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    try {
      await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/artworks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.error('Error updating artwork in cloud database:', err);
    }
  };

  const deleteArtwork = async (id: string) => {
    setArtworks((prev) => {
      const next = prev.filter((item) => item.id !== id && (item as any)._id !== id);
      try {
        localStorage.setItem('kuldeep_studio_artworks', JSON.stringify(next));
      } catch {}
      return next;
    });
    try {
      await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/artworks/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error('Error deleting artwork from cloud database:', err);
    }
  };

  // Course Handlers
  const addCourse = async (course: Course) => {
    setCourses((prev) => [course, ...prev]);
    try {
      await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course)
      });
    } catch (e) {
      console.error('Error adding course:', e);
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    try {
      await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error('Error updating course:', e);
    }
  };

  const deleteCourse = async (id: string) => {
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('kuldeep_studio_courses', JSON.stringify(next));
      } catch {}
      return next;
    });
    try {
      await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/courses/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error('Error deleting course:', e);
    }
  };

  // Lecture Handlers (Synchronous & Race-Free)
  const addLectureToModule = async (courseId: string, moduleIndex: number, lecture: CourseLecture) => {
    let currentCourses = courses;
    try {
      const stored = localStorage.getItem('kuldeep_studio_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentCourses = parsed;
        }
      }
    } catch {}

    let targetCourse: Course | null = null;
    const nextCourses = currentCourses.map((course) => {
      if (course.id !== courseId) return course;
      const newModules = [...course.modules];
      if (!newModules[moduleIndex]) {
        newModules[moduleIndex] = {
          id: `mod-${Date.now()}-1`,
          title: 'Module 1: Foundations & Live Orientation',
          duration: '2 Weeks',
          lessonsCount: 1,
          topics: [lecture.title],
          lectures: [lecture]
        };
      } else {
        const currentLectures = newModules[moduleIndex].lectures || [];
        if (currentLectures.some((l) => l.id === lecture.id || (l.videoUrl && l.videoUrl === lecture.videoUrl))) {
          targetCourse = course;
          return course;
        }
        const allLecs = [...currentLectures, lecture];
        newModules[moduleIndex] = {
          ...newModules[moduleIndex],
          lectures: allLecs,
          lessonsCount: allLecs.length,
          topics: [...(newModules[moduleIndex].topics || []), lecture.title]
        };
      }
      const total = newModules.reduce((acc, m) => acc + (m.lectures ? m.lectures.length : m.lessonsCount), 0);
      const resCourse = {
        ...course,
        modules: newModules,
        totalLessons: total
      };
      targetCourse = resCourse;
      return resCourse;
    });

    setCourses(nextCourses);
    try {
      localStorage.setItem('kuldeep_studio_courses', JSON.stringify(nextCourses));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }

    try {
      await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/courses/${courseId}/modules/${moduleIndex}/lectures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lecture)
      });
      if (targetCourse) {
        await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/courses/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetCourse)
        });
      }
    } catch (e) {
      console.error('Failed to sync new lecture to backend:', e);
    }
  };

  const updateLectureInModule = async (
    courseId: string,
    moduleIndex: number,
    lectureIndex: number,
    updates: Partial<CourseLecture>
  ) => {
    let currentCourses = courses;
    try {
      const stored = localStorage.getItem('kuldeep_studio_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentCourses = parsed;
        }
      }
    } catch {}

    let targetCourse: Course | null = null;
    const nextCourses = currentCourses.map((course) => {
      if (course.id !== courseId) return course;
      const newModules = [...course.modules];
      if (!newModules[moduleIndex]) return course;
      const currentLectures = [...(newModules[moduleIndex].lectures || [])];
      if (!currentLectures[lectureIndex]) return course;
      currentLectures[lectureIndex] = { ...currentLectures[lectureIndex], ...updates };
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lectures: currentLectures,
        topics: currentLectures.map((l) => l.title)
      };
      const resCourse = { ...course, modules: newModules };
      targetCourse = resCourse;
      return resCourse;
    });

    setCourses(nextCourses);
    try {
      localStorage.setItem('kuldeep_studio_courses', JSON.stringify(nextCourses));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }

    if (targetCourse) {
      try {
        await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/courses/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetCourse)
        });
      } catch (e) {
        console.error('Failed to sync updated lecture to backend:', e);
      }
    }
  };

  const deleteLectureFromModule = async (courseId: string, moduleIndex: number, lectureIndex: number) => {
    let currentCourses = courses;
    try {
      const stored = localStorage.getItem('kuldeep_studio_courses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentCourses = parsed;
        }
      }
    } catch {}

    let targetLectureId: string | null = null;
    let targetCourse: Course | null = null;

    const nextCourses = currentCourses.map((course) => {
      if (course.id !== courseId) return course;
      const newModules = [...course.modules];
      if (!newModules[moduleIndex]) return course;
      const currentLectures = newModules[moduleIndex].lectures || [];
      if (currentLectures[lectureIndex]) {
        targetLectureId = currentLectures[lectureIndex].id;
      }
      const filteredLectures = currentLectures.filter((_, idx) => idx !== lectureIndex);
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lectures: filteredLectures,
        lessonsCount: filteredLectures.length,
        topics: filteredLectures.map((l) => l.title)
      };
      const total = newModules.reduce((acc, m) => acc + (m.lectures ? m.lectures.length : m.lessonsCount), 0);
      const resCourse = { ...course, modules: newModules, totalLessons: total };
      targetCourse = resCourse;
      return resCourse;
    });

    setCourses(nextCourses);
    try {
      localStorage.setItem('kuldeep_studio_courses', JSON.stringify(nextCourses));
      if (targetLectureId) {
        const deletedList: string[] = JSON.parse(localStorage.getItem('kuldeep_studio_deleted_lectures') || '[]');
        if (!deletedList.includes(targetLectureId)) {
          deletedList.push(targetLectureId);
          localStorage.setItem('kuldeep_studio_deleted_lectures', JSON.stringify(deletedList));
        }
      }
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }

    try {
      const delUrl = targetLectureId
        ? `https://kuldeep-singh-backend-nehy.onrender.com/api/courses/${courseId}/modules/${moduleIndex}/lectures/${lectureIndex}?lectureId=${targetLectureId}`
        : `https://kuldeep-singh-backend-nehy.onrender.com/api/courses/${courseId}/modules/${moduleIndex}/lectures/${lectureIndex}`;
      await fetch(delUrl, { method: 'DELETE' });
    } catch (e) {
      console.error('Error deleting lecture on backend:', e);
    }

    if (targetCourse) {
      try {
        await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/courses/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetCourse)
        });
      } catch (e) {
        console.error('Failed to sync course update after lecture deletion:', e);
      }
    }
  };

  const addModuleToCourse = async (courseId: string, title?: string, duration?: string) => {
    let updatedCourse: Course | null = null;
    setCourses((prev) => {
      const updated = prev.map((course) => {
        if (course.id !== courseId) return course;
        const newMod: CourseModule = {
          id: 'mod-' + Date.now(),
          title: title || `Module ${course.modules.length + 1}: Masterclass Continuation`,
          duration: duration || '3 Weeks',
          lessonsCount: 0,
          topics: [],
          lectures: []
        };
        const resCourse = {
          ...course,
          modules: [...course.modules, newMod]
        };
        updatedCourse = resCourse;
        return resCourse;
      });

      try {
        localStorage.setItem('kuldeep_studio_courses', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }

      return updated;
    });

    let courseToPut = updatedCourse;
    if (!courseToPut) {
      try {
        const stored = JSON.parse(localStorage.getItem('kuldeep_studio_courses') || '[]');
        courseToPut = stored.find((c: Course) => c.id === courseId) || null;
      } catch {
        // ignore
      }
    }

    if (courseToPut) {
      const backendEndpoints = [
        'https://kuldeep-singh-backend-nehy.onrender.com',
        'http://localhost:5000'
      ];
      for (const baseUrl of backendEndpoints) {
        try {
          await fetch(`${baseUrl}/api/courses/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseToPut)
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const deleteModuleFromCourse = async (courseId: string, moduleIndex: number) => {
    let updatedCourse: Course | null = null;
    setCourses((prev) => {
      const updated = prev.map((course) => {
        if (course.id !== courseId) return course;
        const newModules = course.modules.filter((_, idx) => idx !== moduleIndex);
        const total = newModules.reduce((acc, m) => acc + (m.lectures ? m.lectures.length : m.lessonsCount), 0);
        const resCourse = {
          ...course,
          modules: newModules,
          totalLessons: total
        };
        updatedCourse = resCourse;
        return resCourse;
      });

      try {
        localStorage.setItem('kuldeep_studio_courses', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }

      return updated;
    });

    let courseToPut = updatedCourse;
    if (!courseToPut) {
      try {
        const stored = JSON.parse(localStorage.getItem('kuldeep_studio_courses') || '[]');
        courseToPut = stored.find((c: Course) => c.id === courseId) || null;
      } catch {
        // ignore
      }
    }

    if (courseToPut) {
      const backendEndpoints = [
        'https://kuldeep-singh-backend-nehy.onrender.com',
        'http://localhost:5000'
      ];
      for (const baseUrl of backendEndpoints) {
        try {
          await fetch(`${baseUrl}/api/courses/${courseId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseToPut)
          });
        } catch {
          // ignore
        }
      }
    }
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

  // Student Handlers (Optimistic Local + 24/7 Cloud Sync)
  const addStudent = async (student: EnrolledStudent) => {
    setStudents((prev) => [student, ...prev]);
    try {
      await fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
    } catch (e) {
      console.error('Failed to sync new student to cloud backend:', e);
    }
  };

  const updateStudent = async (id: string, updates: Partial<EnrolledStudent>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    try {
      await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error('Failed to sync student update to backend:', e);
    }
  };

  const deleteStudent = async (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/students/${id}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error('Failed to sync deleted student to backend:', e);
    }
  };

  // Upcoming Courses CRUD
  const addUpcomingCourse = (course: UpcomingCourse) => {
    setUpcomingCourses((prev) => [course, ...prev]);
    fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/upcoming-courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    }).catch((e) => console.warn('Cloud sync error for upcoming course:', e));
  };

  const updateUpcomingCourse = (id: string, updates: Partial<UpcomingCourse>) => {
    setUpcomingCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/upcoming-courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch((e) => console.warn('Cloud sync error for upcoming course:', e));
  };

  const deleteUpcomingCourse = (id: string) => {
    setUpcomingCourses((prev) => prev.filter((c) => c.id !== id));
    fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/upcoming-courses/${id}`, {
      method: 'DELETE'
    }).catch((e) => console.warn('Cloud delete error for upcoming course:', e));
  };

  // Testimonials / Reviews CRUD
  const addReview = (review: CollectorReview) => {
    setReviews((prev) => [review, ...prev]);
    fetch('https://kuldeep-singh-backend-nehy.onrender.com/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    }).catch((e) => console.warn('Cloud sync error for testimonial:', e));
  };

  const updateReview = (id: string, updates: Partial<CollectorReview>) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch((e) => console.warn('Cloud update error for testimonial:', e));
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    fetch(`https://kuldeep-singh-backend-nehy.onrender.com/api/testimonials/${id}`, {
      method: 'DELETE'
    }).catch((e) => console.warn('Cloud delete error for testimonial:', e));
  };

  // Factory Reset
  const resetToDefaults = () => {
    localStorage.removeItem('kuldeep_studio_artworks');
    localStorage.removeItem('kuldeep_studio_courses');
    localStorage.removeItem('kuldeep_studio_students');
    localStorage.removeItem('kuldeep_studio_profile');
    localStorage.removeItem('kuldeep_studio_timeline');
    localStorage.removeItem('kuldeep_studio_awards');
    localStorage.removeItem('kuldeep_studio_upcoming_courses');
    localStorage.removeItem('kuldeep_studio_upcoming_courses_v2');
    localStorage.removeItem('kuldeep_studio_testimonials');
    setArtworks(ARTWORKS);
    setCourses(COURSES);
    setStudents(INITIAL_STUDENTS);
    setArtistProfile(DEFAULT_PROFILE);
    setTimeline(TIMELINE);
    setUpcomingCourses(INITIAL_UPCOMING_COURSES);
    setReviews(REVIEWS);
  };

  return (
    <StudioDataContext.Provider
      value={{
        artworks,
        courses,
        students,
        artistProfile,
        timeline,
        awards,
        liveStatus,
        upcomingCourses,
        addUpcomingCourse,
        updateUpcomingCourse,
        deleteUpcomingCourse,
        reviews,
        addReview,
        updateReview,
        deleteReview,
        promoCodes,
        deliverySettings,
        addPromoCode,
        updatePromoCode,
        deletePromoCode,
        updateDeliverySettings,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        addCourse,
        updateCourse,
        deleteCourse,
        addStudent,
        updateStudent,
        deleteStudent,
        addLectureToModule,
        updateLectureInModule,
        deleteLectureFromModule,
        addModuleToCourse,
        deleteModuleFromCourse,
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
