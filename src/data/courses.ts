import type { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'course-oil-mastery',
    title: 'The Master Oil Painting Atelier Diploma',
    subtitle: '12-Month Comprehensive Masterclass on Old Master Techniques & Chiaroscuro',
    level: 'Master / Advanced',
    category: 'Oil Painting',
    durationHours: 120,
    durationMonths: '12 Months',
    schedule: 'Saturday & Sunday • 6:00 PM – 8:00 PM IST',
    startDate: 'Ongoing Batch • Admissions Active',
    mode: 'Live Studio Broadcast + HD Recorded Atelier Lectures',
    certification: 'Official Hand-Embossed Diploma from Atelier Kuldeep Singh',
    prerequisites: 'Basic drawing knowledge recommended but all passionate artists welcome.',
    totalLessons: 48,
    price: 349,
    originalPrice: 699,
    rating: 4.95,
    studentsEnrolled: 1840,
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop'
    ],
    previewVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    summary: 'Master the Flemish and Venetian multi-layer oil painting methods, historical pigment chemistry, and dramatic lighting from Artist Kuldeep Singh.',
    description: 'A transformative atelier mentorship designed to turn committed artists into master painters. From hand-stretching Belgian linen and grinding natural mineral pigments to mastering indirect glazing, scumbling, and impasto highlights.',
    whatYouWillLearn: [
      'Hand-preparation of rabbit-skin glue and chalk gesso grounds on Belgian linen',
      'Pigment chemistry: toxicity, lightfastness, and historical color palettes',
      'Grisaille and verdaccio underpaintings for depth and light luminosity',
      'Indirect glazing techniques of the Dutch and Italian Renaissance masters',
      'Live figurative portraiture with chiaroscuro lighting and flesh tone mastery',
      'Archival varnishing, framing, and gallery presentation protocols'
    ],
    materialsNeeded: [
      'Artist-grade oil colors (Flake white, Burnt umber, Yellow ochre, Ultramarine, Vermilion)',
      'Cold-pressed linseed oil and spike lavender oil medium',
      'Filbert, flat, and round Kolinsky sable and hog bristle brushes',
      'Handmade wooden palette and palette knives',
      'Stretched cotton or linen canvases (18x24 in and 24x36 in)'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: The Alchemy of Ground & Underpainting',
        duration: '4 Weeks • 8 Lectures',
        lessonsCount: 4,
        topics: [
          'Lecture 1: Surface Science & Canvas Preparation',
          'Lecture 2: The Monochromatic Imprimatura & Structural Drawing',
          'Lecture 3: Verdaccio Tonal Underpainting for Portraiture',
          'Lecture 4: Optical Density & Initial Wash Discipline'
        ],
        lectures: [
          {
            id: 'lec-1-1',
            title: 'Surface Science: Preparing Linen & True Chalk Gesso Grounds',
            duration: '45 mins',
            summary: 'Learn the exact historical ground preparation that ensures 300+ year archival stability without peeling or acid degradation.',
            accessType: 'free',
            isFreePreview: true
          },
          {
            id: 'lec-1-2',
            title: 'Imprimatura & Structural Proportions from Live Models',
            duration: '52 mins',
            summary: 'Setting the atmospheric tonal foundation before oil pigments touch the canvas.',
            accessType: 'enrolled',
            isFreePreview: false
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Flesh Tones, Luminosity & Chiaroscuro Glazing',
        duration: '4 Weeks • 8 Lectures',
        lessonsCount: 4,
        topics: [
          'Lecture 5: The Zorn Palette & Skin Undertone Mixing',
          'Lecture 6: Glazing vs. Scumbling: Manipulating Refracted Light',
          'Lecture 7: Master Portraiture Demonstration (Part I)',
          'Lecture 8: Master Portraiture Demonstration (Part II)'
        ],
        lectures: [
          {
            id: 'lec-2-1',
            title: 'The Zorn 4-Pigment Palette for Lifelike Human Portraits',
            duration: '60 mins',
            summary: 'Learn how to generate thousands of delicate skin variations with only 4 basic earth colors.',
            accessType: 'enrolled',
            isFreePreview: false
          }
        ]
      }
    ],
    featured: true,
    isUpcoming: false
  },
  {
    id: 'course-realistic-sketching',
    title: 'Foundations of Realistic Sketching & Human Anatomy',
    subtitle: '6-Month Classical Draftsmanship, Bargue Plates & Proportion Analysis',
    level: 'All Levels',
    category: 'Realistic Sketching',
    durationHours: 60,
    durationMonths: '6 Months',
    schedule: 'Tuesday & Thursday • 7:00 PM – 9:00 PM IST',
    startDate: 'Ongoing Batch • Open Enrollment',
    mode: 'Interactive Live Atelier + Personal Critique Sessions',
    certification: 'Certificate of Classical Draftsmanship',
    totalLessons: 24,
    price: 249,
    originalPrice: 499,
    rating: 4.9,
    studentsEnrolled: 2310,
    thumbnail: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    summary: 'The bedrock of all fine art. Master sight-size drawing, contour anatomy, and dramatic tonal rendering in vine charcoal and conté.',
    description: 'Designed for artists who wish to break through drawing plateaus. We study classical Charles Bargue plates, skeletal landmark identification, and muscle grouping to produce breathtaking three-dimensional sketches.',
    whatYouWillLearn: [
      'Accurate sight-size proportioning and comparative measurement',
      'The plumb-line method and negative space calibration',
      'Anatomical landmarks: skull planes, ribcage tilt, and pelvic rhythm',
      'Cross-hatching, stump blending, and kneaded erasure highlights'
    ],
    materialsNeeded: [
      'Willow and vine charcoal sticks (Soft, Medium, Hard)',
      'Fabriano 200gsm archival sketch paper',
      'Kneaded erasers and paper tortillions / blending stumps',
      'Plumb line and proportional divider'
    ],
    modules: [
      {
        id: 'mod-sketch-1',
        title: 'Module 1: Measurement & Contour Precision',
        duration: '3 Weeks • 6 Lessons',
        lessonsCount: 3,
        topics: [
          'Lesson 1: The Plumb Line & Sight Size Principle',
          'Lesson 2: Blocking-In Structural Angles',
          'Lesson 3: The Shadow Line (Terminator Edge)'
        ],
        lectures: [
          {
            id: 'lec-sk-1',
            title: 'The Plumb Line & Absolute Proportional Accuracy',
            duration: '40 mins',
            summary: 'How to eliminate guesswork and render proportions with mathematical certainty.',
            accessType: 'free',
            isFreePreview: true
          }
        ]
      }
    ],
    featured: true,
    isUpcoming: false
  },
  {
    id: 'course-upcoming-monumental-landscape',
    title: 'Monumental Plein Air & Atmospheric Landscape Mastery',
    subtitle: 'Upcoming Specialized Masterclass • Atmospheric Light & Golden Hour Horizons',
    level: 'Master / Advanced',
    category: 'Oil Painting',
    durationHours: 80,
    durationMonths: '4 Months',
    schedule: 'Saturday & Sunday • 11:00 AM – 1:00 PM IST',
    startDate: 'Batch Starting 15th November 2026',
    mode: 'Outdoor Field Broadcasts + Studio Composition Classes',
    certification: 'Landscape Master Certificate • Atelier Kuldeep Singh',
    totalLessons: 32,
    price: 299,
    originalPrice: 599,
    rating: 5.0,
    studentsEnrolled: 420,
    thumbnail: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    summary: 'Master the fleeting drama of twilight skies, aerial perspective, and rushing waterways with heavy impasto and fluid oil washes.',
    description: 'An exclusive upcoming masterclass by Artist Kuldeep Singh focusing purely on outdoor light capture, weather psychology in paint, and translating rapid field studies into majestic gallery-sized canvases.',
    whatYouWillLearn: [
      'Rapid field color-matching within 45-minute sun shifts',
      'Atmospheric perspective: desaturation, cooling, and edge softening',
      'Sculptural knife impasto for rocks, tree bark, and crashing surf',
      'Studio scaling: turning small 8x10 field studies into monumental 50-inch canvases'
    ],
    materialsNeeded: [
      'French Pochade Box or lightweight field easel',
      'Limited plein air oil palette (Warm & cool primary pairs)',
      'Prepared linen panels (8x10 and 11x14 in)'
    ],
    modules: [
      {
        id: 'mod-land-1',
        title: 'Module 1: Sky Architecture & Rapid Atmosphere',
        duration: '4 Weeks • 8 Lectures',
        lessonsCount: 2,
        topics: [
          'Lecture 1: Cloud Physics & Light Scattering',
          'Lecture 2: Sunset Gradient Blending in Wet-on-Wet Oil'
        ],
        lectures: [
          {
            id: 'lec-land-1',
            title: 'Deconstructing Sky Gradients at Twilight',
            duration: '48 mins',
            summary: 'Understanding atmospheric Rayleigh scattering and using cadmium red with cobalt blue without making mud.',
            accessType: 'free',
            isFreePreview: true
          }
        ]
      }
    ],
    featured: true,
    isUpcoming: true,
    upcomingDate: 'Starts 15 Nov 2026 • Early Bird Enrollment Open'
  },
  {
    id: 'course-upcoming-watercolor-portraiture',
    title: 'Expressive Watercolor & Fluid Pigment Portraiture',
    subtitle: 'Upcoming Intensive Masterclass • Wet-in-Wet Spontaneity & Glazing Control',
    level: 'All Levels',
    category: 'Watercolor & Fluid',
    durationHours: 50,
    durationMonths: '3 Months',
    schedule: 'Monday & Wednesday • 7:30 PM – 9:30 PM IST',
    startDate: 'Batch Starting 1st December 2026',
    mode: 'High-Definition Dual-Angle Live Studio Stream',
    certification: 'Watercolor Specialist Certificate',
    totalLessons: 20,
    price: 199,
    originalPrice: 399,
    rating: 4.9,
    studentsEnrolled: 310,
    thumbnail: 'https://images.unsplash.com/photo-1579783923665-35632f426dd8?q=80&w=1200&auto=format&fit=crop',
    previewVideoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    summary: 'Conquer the fear of watercolor. Learn to balance paper moisture, granulating earth pigments, and effortless expressive brush economy.',
    description: 'Watercolor is alive. This upcoming masterclass teaches you to collaborate with water rather than fight it. Learn how Kuldeep Singh achieves dramatic emotional portraits with just 3 tonal passes.',
    whatYouWillLearn: [
      'Moisture control: from bone dry to saturated wash gradients',
      'Granulation chemistry: ultramarines, lunar blacks, and ochres',
      'Preserving white paper highlights without masking fluid',
      'Edge control: lost, soft, and razor-sharp focal accents'
    ],
    materialsNeeded: [
      '100% Cotton 300gsm Rough or Cold Press watercolor block',
      'Mop brushes (Squirrel or synthetic quill) and rigger brushes',
      'Professional artist tube watercolors (Daniel Smith / Schmincke)'
    ],
    modules: [
      {
        id: 'mod-wc-1',
        title: 'Module 1: The Physics of Water on Cotton',
        duration: '3 Weeks • 6 Lectures',
        lessonsCount: 2,
        topics: [
          'Lecture 1: The 4 Stages of Paper Wetness',
          'Lecture 2: Pigment-to-Water Ratio Mastery'
        ],
        lectures: [
          {
            id: 'lec-wc-1',
            title: 'Mastering the 4 Paper Wetness States',
            duration: '38 mins',
            summary: 'Learn the exact timing to drop pigments into wet washes without blooming or cauliflowers.',
            accessType: 'free',
            isFreePreview: true
          }
        ]
      }
    ],
    featured: true,
    isUpcoming: true,
    upcomingDate: 'Starts 1 Dec 2026 • Limited Batch of 30 Students'
  }
];
