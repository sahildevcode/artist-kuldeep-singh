import type { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'course-oil-mastery',
    title: 'The Classical & Modern Oil Painting Masterclass',
    subtitle: 'From Blank Canvas to Gallery-Worthy Realism & Expressive Impasto',
    level: 'All Levels',
    category: 'Oil Painting',
    durationHours: 32,
    totalLessons: 48,
    price: 349,
    originalPrice: 499,
    rating: 4.96,
    studentsEnrolled: 2180,
    thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    summary: 'Master the timeless medium of oil paint. Learn historic Old Masters glazing, fat-over-lean layering, sculptural impasto palette knife work, and portrait flesh tones.',
    description: 'Developed over 12 years of studio practice and taught to thousands of artists globally, this comprehensive masterclass demystifies oil painting. Whether you are transitioning from acrylics or opening your first tube of oil, this curriculum guides you step-by-step through materials, chemical mediums, drying rates, tone transfer, and grand gallery execution.',
    whatYouWillLearn: [
      'Master the fundamental "Fat-over-Lean" chemistry and solvent management',
      'Underpainting techniques: Grisaille, Imprimatura, and Verdaccio',
      'Sculptural Impasto: Using palette knives and heavy body paints with confidence',
      'Mixing luminous skin tones and realistic fabric folds',
      'Glazing and Scumbling: Achieving unmatched depth and inner light',
      'Studio safety, archival varnishing, and stretching your own linen canvas'
    ],
    materialsNeeded: [
      'Artist-grade oil colors (Cadmium Red, Ultramarine Blue, Yellow Ochre, Burnt Umber, Titanium White)',
      'Cold-pressed linseed oil and odorless mineral spirits',
      'Filbert and Flat hogs bristle & synthetic sable brushes',
      'Primed cotton or Belgian linen canvas panels'
    ],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Studio Setup & Pigment Science',
        duration: '4h 15m',
        lessonsCount: 6,
        topics: ['Safety & Solvents', 'Oils & Mediums Breakdown', 'Choosing Brushes & Palette Knives', 'Preparing the Ground']
      },
      {
        id: 'mod-2',
        title: 'Module 2: Underpainting & Value Foundations',
        duration: '6h 30m',
        lessonsCount: 10,
        topics: ['Grisaille Master Technique', 'Tonal Wash Underpainting', 'Accurate Proportions', 'Locking Light & Shade']
      },
      {
        id: 'mod-3',
        title: 'Module 3: Direct Painting (Alla Prima) & Impasto',
        duration: '9h 45m',
        lessonsCount: 14,
        topics: ['Wet-into-wet Speed', 'Knife Sculpting on Canvas', 'Expressive Brush Calligraphy', 'Maintaining Vibrant Color Purity']
      },
      {
        id: 'mod-4',
        title: 'Module 4: Classical Glazes & Finishing Masterpieces',
        duration: '11h 30m',
        lessonsCount: 18,
        topics: ['Luminous Transparent Glazing', 'Scumbling Optical Effects', 'Archival Varnishing', 'Framing & Exhibition Readiness']
      }
    ],
    featured: true
  },
  {
    id: 'course-realistic-sketching',
    title: 'Foundations of Realistic Sketching & Anatomy',
    subtitle: 'Master Light, Shadow, Proportion, Charcoal, and Figure Drawing',
    level: 'Beginner',
    category: 'Realistic Sketching',
    durationHours: 24,
    totalLessons: 36,
    price: 249,
    originalPrice: 349,
    rating: 4.98,
    studentsEnrolled: 3420,
    thumbnail: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1200&auto=format&fit=crop',
    summary: 'The cornerstone of all great visual art. Learn how to see like a draftsman, master pencil pressures, control willow charcoal, and draw lifelike figures from observation.',
    description: 'Drawing is not a magical talent—it is a precise language of visual measurement, angle comparison, and tonal value control. In this course, you will transform stick-figure uncertainty into commanding anatomical precision and photographic realism.',
    whatYouWillLearn: [
      'How to hold the pencil and charcoal for loose expressive gestures and razor details',
      'The Sight-Size and Comparative Measurement methods used by European Academies',
      'The 5-Value System: Highlight, Midtone, Core Shadow, Reflected Light, Cast Shadow',
      'Human facial proportions, bone landmarks, and expressive eyes/lips',
      'Rendering metallic, glass, cloth, and skin textures with graphite & kneaded erasers',
      'Speed sketching in public sketchbooks without fear of mistakes'
    ],
    materialsNeeded: [
      'Graphite pencils (2H, HB, 2B, 4B, 6B, 8B)',
      'Willow and compressed charcoal sticks',
      'Kneaded eraser and tombow mono zero precision eraser',
      'Smooth heavy cartridge drawing paper (A3 or A4)'
    ],
    modules: [
      {
        id: 'mod-s1',
        title: 'Module 1: The Draftsman’s Eye & Line Dynamics',
        duration: '4h 00m',
        lessonsCount: 7,
        topics: ['Line Weight & Rhythm', 'Sight-Size Measuring', 'Angles & Negative Space', 'Contour Exercises']
      },
      {
        id: 'mod-s2',
        title: 'Module 2: The Architecture of Light & Shadow',
        duration: '6h 15m',
        lessonsCount: 9,
        topics: ['The 5 Core Values', 'Spheres & Organic Cylinders', 'Cast Shadow Edge Softness', 'Chiaroscuro Drama']
      },
      {
        id: 'mod-s3',
        title: 'Module 3: Portrait & Human Form Landmarks',
        duration: '8h 20m',
        lessonsCount: 12,
        topics: ['Loomis & Reilly Head Rhythms', 'Drawing Eyes with Soul', 'Nose & Mouth Geometry', 'Full Figure Gestures']
      },
      {
        id: 'mod-s4',
        title: 'Module 4: Master Charcoal Workflows & Longevity',
        duration: '5h 25m',
        lessonsCount: 8,
        topics: ['Powdered Charcoal Blending', 'Eraser Sculpting', 'Fixing Charcoal Drawings', 'Portfolio Presentation']
      }
    ],
    featured: true
  },
  {
    id: 'course-color-alchemy',
    title: 'Color Theory & Pigment Alchemy: Master Every Palette',
    subtitle: 'Eliminate Muddy Colors, Control Temperature & Harness Chromatic Impact',
    level: 'Intermediate',
    category: 'Color Theory',
    durationHours: 18,
    totalLessons: 28,
    price: 199,
    originalPrice: 280,
    rating: 4.94,
    studentsEnrolled: 1850,
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
    summary: 'Unlock the secret physics and psychological poetry of color. Never buy premixed colors blindly again—learn how to mix any hue in under 10 seconds.',
    description: 'Why do colors look vibrant on your palette but turn into dull mud on your painting? This course breaks down spectral reflectance, warm vs cool bias within primary pigments, Munsell value structures, and color harmony schemes that trigger immediate emotional resonance in viewers.',
    whatYouWillLearn: [
      'The split-primary palette system (Warm & Cool Reds, Blues, Yellows)',
      'Why muddy mixtures happen and the exact mathematical fix',
      'Mastering color temperature shifts across sunlit surfaces and ambient shadows',
      'The psychology of atmospheric mood: High key vs Low key paintings',
      'Creating harmonious limited palettes (Zorn Palette, Triadic, Complementary)',
      'Color vibration techniques used by the French Impressionists'
    ],
    materialsNeeded: [
      'Primary colors in your preferred medium (Cadmium Yellow Light, Yellow Ochre, Ultramarine, Cerulean, Cadmium Red, Alizarin Crimson)',
      'Palette knife and grey mixing palette for unbiased perception',
      'Heavy swatch paper or study canvas board'
    ],
    modules: [
      {
        id: 'mod-c1',
        title: 'Module 1: The Physics & Bias of Pigments',
        duration: '3h 30m',
        lessonsCount: 6,
        topics: ['Hue vs Saturation vs Value', 'Warm/Cool Bias in Primaries', 'Color Temperature Secrets', 'The Mud-Free Matrix']
      },
      {
        id: 'mod-c2',
        title: 'Module 2: Mixing Harmony & Historic Palettes',
        duration: '5h 15m',
        lessonsCount: 8,
        topics: ['The Legendary Zorn Palette', 'Triadic Harmonies', 'Complementary Vibration', 'Atmospheric Depth in Landscape']
      },
      {
        id: 'mod-c3',
        title: 'Module 3: Flesh Tones & Organic Color Realism',
        duration: '5h 45m',
        lessonsCount: 8,
        topics: ['Three Zones of the Human Face', 'Veins and Subsurface Scattering', 'Foliage Greens without Harshness', 'Water Reflections']
      },
      {
        id: 'mod-c4',
        title: 'Module 4: Color Grading Your Own Signature Style',
        duration: '3h 30m',
        lessonsCount: 6,
        topics: ['Emotional Color Keys', 'Dominant Hue Schemes', 'Signature Visual Voice', 'Final Chromatic Project']
      }
    ],
    featured: true
  },
  {
    id: 'course-watercolor-fluid',
    title: 'Expressive Watercolor & Fluid Pigment Dynamics',
    subtitle: 'Befriend Water, Wet-on-Wet Splashes & Luminous Transparent Washes',
    level: 'All Levels',
    category: 'Watercolor & Fluid',
    durationHours: 20,
    totalLessons: 30,
    price: 219,
    originalPrice: 299,
    rating: 4.92,
    studentsEnrolled: 1640,
    thumbnail: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=1200&auto=format&fit=crop',
    summary: 'Stop overworking your paintings. Learn to trust water, let pigments dance across 100% cotton paper, and capture sunlight and movement with joyful spontaneity.',
    description: 'Watercolor has a reputation for being unforgiving—until you understand the four stages of paper wetness. In this serene yet empowering course, Julian Vance guides you through fluid granulating pigments, salt textures, dry-brush calligraphy, and creating atmospheric seascapes and botanicals that feel alive with moisture.',
    whatYouWillLearn: [
      'The 4 moisture states of cotton rag and when to strike with the brush',
      'Luminous flat washes, graded sunset washes, and variegated blends',
      'Negative painting techniques to preserve glowing whites without masking fluid',
      'Exploiting granulation and pigment separation (Ultramarine & Burnt Sienna magic)',
      'Spatter and dry-brush accents for ripples, mist, and botanical foliage',
      'Fixing accidents and transforming happy surprises into art'
    ],
    materialsNeeded: [
      'Artist-grade watercolor pan or tube set (12-18 colors)',
      '100% Cotton cold-pressed 300gsm watercolor paper block',
      'Mop brush, Round sizes #8, #12, and Rigger brush',
      'Ceramic mixing well and sea sponge'
    ],
    modules: [
      {
        id: 'mod-w1',
        title: 'Module 1: Water Tension & Paper Mechanics',
        duration: '3h 45m',
        lessonsCount: 6,
        topics: ['Cotton vs Cellulose Paper', 'Soaking & Stretching', 'Controlling Water-to-Paint Ratios', 'The Perfect Flat Wash']
      },
      {
        id: 'mod-w2',
        title: 'Module 2: Wet-on-Wet Atmosphere & Bloom Effects',
        duration: '5h 30m',
        lessonsCount: 8,
        topics: ['Cloud & Sky Formations', 'Granulation Explosions', 'Soft Edge Control', 'Creating Mist & Fog']
      },
      {
        id: 'mod-w3',
        title: 'Module 3: Precision & Negative Painting',
        duration: '5h 15m',
        lessonsCount: 8,
        topics: ['Carving Space Around White Lights', 'Architecture in Watercolor', 'Botanical Precision', 'Dry-brush Texture']
      },
      {
        id: 'mod-w4',
        title: 'Module 4: Full Painting Projects from Start to Finish',
        duration: '5h 30m',
        lessonsCount: 8,
        topics: ['Venetian Canal Reflections', 'Forest Light Rays', 'Loose Expressive Portraiture', 'Signing & Framing']
      }
    ],
    featured: false
  }
];
