import type { Hall } from '../types';

export const HALLS_DATA: Hall[] = [
  {
    id: 'grand-imperial',
    name: 'The Grand Imperial Ballroom',
    subtitle: 'Our Flagship Masterpiece of Royalty & Grandeur',
    capacityMin: 150,
    capacityMax: 600,
    areaSqFt: 12500,
    priceMorning: 250000,
    priceEvening: 450000,
    priceFullDay: 650000,
    description: 'Featuring 28-foot coffered ceilings, Austrian Swarovski crystal chandeliers, programmable LED mood lighting, and dual grand marble staircases. Ideal for lavish wedding receptions, royal galas, and mega corporate summits.',
    image: '/assets/hero_ballroom.png',
    galleryImages: [
      '/assets/hero_ballroom.png',
      '/assets/crystal_pavilion.png',
      '/assets/skylight_lounge.png'
    ],
    features: [
      '28ft High Coffered Ceiling',
      'Built-in 4K Modular LED Wall (24ft)',
      'Dual Bridal Preparation Suites',
      'Private VIP Entrance & Valet Drop-off',
      'State-of-the-Art Meyer Sound System',
      'Flexible Partition Walls'
    ],
    recommendedFor: ['Wedding', 'Corporate Gala', 'Award Ceremony', 'Private Banquet'],
    rating: 4.95,
    reviewCount: 148,
    popular: true
  },
  {
    id: 'crystal-pavilion',
    name: 'Crystal Garden Pavilion',
    subtitle: 'Lush Botanical Glass Architecture at Twilight',
    capacityMin: 80,
    capacityMax: 300,
    areaSqFt: 7200,
    priceMorning: 150000,
    priceEvening: 300000,
    priceFullDay: 420000,
    description: 'Surrounded by 360-degree floor-to-ceiling glass, custom fairy lights, and cascading vertical orchid gardens. Complete with a private outdoor terrace for sunset cocktail hours.',
    image: '/assets/crystal_pavilion.png',
    galleryImages: [
      '/assets/crystal_pavilion.png',
      '/assets/skylight_lounge.png',
      '/assets/hero_ballroom.png'
    ],
    features: [
      '360° Glass Panoramic Garden Views',
      'Private Outdoor Firepit Terrace',
      'Custom Overhead Fairy Light Canopy',
      'Climate Controlled All Seasons',
      'Acoustic Wood Panel Accents',
      'Direct Outdoor Photo Lawn Access'
    ],
    recommendedFor: ['Wedding', 'Birthday Party', 'Anniversary', 'Private Banquet'],
    rating: 4.91,
    reviewCount: 96,
    popular: true
  },
  {
    id: 'skylight-suite',
    name: 'Skylight Executive Lounge',
    subtitle: 'Rooftop Chic & City Skyline Sophistication',
    capacityMin: 40,
    capacityMax: 160,
    areaSqFt: 4500,
    priceMorning: 100000,
    priceEvening: 200000,
    priceFullDay: 280000,
    description: 'Perched on the top floor with a glass dome skylight, plush velvet lounge sofas, glowing champagne marble bar, and panoramic city night views.',
    image: '/assets/skylight_lounge.png',
    galleryImages: [
      '/assets/skylight_lounge.png',
      '/assets/hero_ballroom.png',
      '/assets/crystal_pavilion.png'
    ],
    features: [
      'Retractable Glass Dome Skylight',
      'Illuminated Onyx Bar Counter',
      'Bose Surround Sound System',
      'High-Speed Fiber Tech for Hybrid Events',
      'Dedicated Sommelier Station',
      'Private Rooftop Balcony'
    ],
    recommendedFor: ['Corporate Gala', 'Birthday Party', 'Conference', 'Anniversary'],
    rating: 4.88,
    reviewCount: 72
  },
  {
    id: 'royal-terrace',
    name: 'Royal Heritage Court',
    subtitle: 'Open-Air Elegance & Classical Columns',
    capacityMin: 50,
    capacityMax: 250,
    areaSqFt: 6000,
    priceMorning: 120000,
    priceEvening: 220000,
    priceFullDay: 320000,
    description: 'An open-air Italian marble courtyard with roman fountains, string lights, and ambient landscape illumination. Perfect for starry night banquets and engagement ceremonies.',
    image: '/assets/catering_feast.png',
    galleryImages: [
      '/assets/catering_feast.png',
      '/assets/crystal_pavilion.png',
      '/assets/hero_ballroom.png'
    ],
    features: [
      'Illuminated Marble Water Fountains',
      'Full Covered Arcaded Promenade',
      'Integrated Outdoor Heat Lamps',
      'Staging Area for Live Bands',
      'Custom BBQ & Live Grill Station',
      'Romantic Floral Arches'
    ],
    recommendedFor: ['Wedding', 'Birthday Party', 'Anniversary', 'Private Banquet'],
    rating: 4.86,
    reviewCount: 54
  }
];
