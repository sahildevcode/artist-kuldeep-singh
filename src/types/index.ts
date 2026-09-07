export type MediumType = 'Oil on Canvas' | 'Charcoal & Graphite' | 'Watercolor & Ink' | 'Acrylic & Mixed Media' | 'Limited Edition Print';

export interface Artwork {
  id: string;
  title: string;
  subtitle: string;
  year: number;
  medium: MediumType;
  dimensions: string; // e.g., "36 x 48 in (91 x 122 cm)"
  price: number;
  image: string;
  detailImages?: string[];
  description: string;
  story: string;
  framed: boolean;
  status: 'available' | 'sold' | 'reserved';
  featured?: boolean;
  paletteColors: string[]; // hex codes of primary pigments used
  weight?: string;
  varnishType?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  lessonsCount: number;
  topics: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  level: 'Beginner' | 'Intermediate' | 'Master / Advanced' | 'All Levels';
  category: 'Oil Painting' | 'Realistic Sketching' | 'Color Theory' | 'Watercolor & Fluid';
  durationHours: number;
  durationMonths: string;
  schedule: string;
  startDate: string;
  mode: string;
  certification: string;
  prerequisites?: string;
  totalLessons: number;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsEnrolled: number;
  thumbnail: string;
  previewVideoUrl?: string;
  summary: string;
  description: string;
  whatYouWillLearn: string[];
  materialsNeeded: string[];
  modules: CourseModule[];
  featured?: boolean;
}

export interface AchievementTimelineItem {
  year: string;
  title: string;
  roleOrLocation: string;
  description: string;
  milestoneType: 'Exhibition' | 'Award' | 'Studio Milestone' | 'Publication';
  highlightMetric?: string;
}

export interface Award {
  year: string;
  award: string;
  institution: string;
  location: string;
  badgeText: string;
}

export interface CollectorReview {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  artworkAcquired?: string;
  courseTaken?: string;
  comment: string;
  rating: number;
  verifiedPurchase: boolean;
}

export interface CartItem {
  id: string;
  type: 'artwork' | 'course';
  title: string;
  subtitle: string;
  price: number;
  image: string;
  quantity: number;
  mediumOrCategory?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'collector' | 'student';
  avatar?: string;
  memberSince: string;
  collectedCount?: number;
  enrolledCoursesCount?: number;
  enrolledCourseIds?: string[];
}
