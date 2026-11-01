export interface GalleryItem {
  id: string;
  title: string;
  category: 'Weddings' | 'Corporate' | 'Parties' | 'Catering';
  image: string;
  hallName: string;
  guestCount: number;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'The Royal Sovereign Wedding',
    category: 'Weddings',
    image: '/assets/hero_ballroom.png',
    hallName: 'The Grand Imperial Ballroom',
    guestCount: 450
  },
  {
    id: 'gal-2',
    title: 'Twilight Glass Pavilion Reception',
    category: 'Weddings',
    image: '/assets/crystal_pavilion.png',
    hallName: 'Crystal Garden Pavilion',
    guestCount: 220
  },
  {
    id: 'gal-3',
    title: 'Apex Tech Global Leadership Summit',
    category: 'Corporate',
    image: '/assets/skylight_lounge.png',
    hallName: 'Skylight Executive Lounge',
    guestCount: 150
  },
  {
    id: 'gal-4',
    title: 'Grand Culinary Buffet Feast',
    category: 'Catering',
    image: '/assets/catering_feast.png',
    hallName: 'The Grand Imperial Ballroom',
    guestCount: 500
  },
  {
    id: 'gal-5',
    title: 'Emerald Enchantment Gala Night',
    category: 'Parties',
    image: '/assets/hero_ballroom.png',
    hallName: 'The Grand Imperial Ballroom',
    guestCount: 380
  },
  {
    id: 'gal-6',
    title: 'Rooftop Midnight Champagne Toast',
    category: 'Parties',
    image: '/assets/skylight_lounge.png',
    hallName: 'Skylight Executive Lounge',
    guestCount: 120
  }
];
