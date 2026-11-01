import type { CateringPackage, AddonOption } from '../types';

export const CATERING_PACKAGES: CateringPackage[] = [
  {
    id: 'gold-gourmet',
    name: 'Gold Gourmet Buffet',
    badge: 'Standard Luxury',
    pricePerGuest: 3500,
    description: 'A rich culinary showcase featuring Pakistani & International multi-cuisine buffet spreads, live BBQ, salad bar, hot entrees, and traditional sweets.',
    includes: [
      '3 Live Appetizer & BBQ Stations',
      '4 Gourmet Main Entrees (Chicken Karahi, Mutton Biryani, Fish Fry & Veg)',
      'Fresh Naan & Roti Station & Salad Bar',
      'Dessert Display (Gulab Jamun, Kheer, Mini Cheesecakes)',
      'Free Flow Soft Drinks, Mineral Water & Kashmiri Chai',
      'Professional Buffet Service Staff'
    ],
    dietaryOptions: ['Vegetarian Options', 'Gluten-Free Available', 'Nut-Free']
  },
  {
    id: 'platinum-royal',
    name: 'Platinum Plated Dining',
    badge: 'Most Popular',
    pricePerGuest: 5500,
    description: 'Formal 4-course royal dining experience curated by Executive Master Chefs with white-glove table service.',
    includes: [
      'Passed Premium Hors d’Oeuvres (5 Varieties)',
      'First Course: Royal Mutton Yakhni Soup or Creamy Mushroom Soup',
      'Palate Cleanser Mint Margarita Sorbet',
      'Main Course Choice: Tender Beef Seekh Kabab, Stuffed Chicken Breast, or Grilled Prawns with Egg Fried Rice',
      'Artisanal Dessert Tasting Trio (Shahi Tukda, Lava Cake, Ice Cream)',
      'Mocktail Toast & Unlimited Fresh Juices',
      'Dedicated White-Glove Table Waiters'
    ],
    popular: true,
    dietaryOptions: ['Vegetarian', 'Vegan', 'Halal Certified 100%', 'Gluten-Free']
  },
  {
    id: 'imperial-monarch',
    name: 'Imperial Monarch Feast',
    badge: 'Ultra Luxury',
    pricePerGuest: 8500,
    description: 'The pinnacle of fine dining featuring live seafood bar, roasted whole lamb carving, premium imported steak, and executive dessert extravaganza.',
    includes: [
      'Beluga Caviar & Grilled Tiger Prawn Station',
      'Live Sushi & Teppanyaki Chef Bar',
      '5-Course Custom Plated Feast',
      'Tableside Carving Station (Whole Roasted Lamb & Ribeye Steak)',
      'Grand Chocolate Fountain & Live Jalebi & Halwa Puri Station',
      'Unlimited Premium Mocktail Bar & Gourmet Espresso',
      'Personalized Printed Gold Menus for Guests'
    ],
    dietaryOptions: ['Customizable for any dietary need (Halal, Vegan, Allergen-Free)']
  }
];

export const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'decor-luxury-floral',
    name: 'Royal Floral Stage Installation & Centerpieces',
    price: 85000,
    priceType: 'flat',
    description: 'Fresh imported red roses, white orchids, crystal tall vases, and grand bridal stage floral arch.',
    category: 'decor',
    icon: 'Flower2'
  },
  {
    id: 'decor-mood-lighting',
    name: 'Custom Architectural DMX Lighting & Cold Fireworks',
    price: 50000,
    priceType: 'flat',
    description: 'DMX controlled ambient uplighting, dry ice fog for couple entry, and cold spark pyrotechnics.',
    category: 'decor',
    icon: 'Sparkles'
  },
  {
    id: 'ent-live-dj-av',
    name: 'Concert Grade DJ & Master of Ceremonies',
    price: 75000,
    priceType: 'flat',
    description: 'Professional DJ, custom playlist, wireless mics, intelligent party lighting, and MC host.',
    category: 'entertainment',
    icon: 'Music'
  },
  {
    id: 'ent-photo-booth',
    name: '360 Video Booth & Mirror Photo Kiosk',
    price: 45000,
    priceType: 'flat',
    description: 'Interactive 360 rotating camera platform, instant physical prints, QR digital sharing, and props.',
    category: 'entertainment',
    icon: 'Camera'
  },
  {
    id: 'serv-valet-parking',
    name: 'White-Glove VIP Valet Parking Team',
    price: 35000,
    priceType: 'flat',
    description: 'Uniformed valet attendants for seamless arrival and departure for all your guests.',
    category: 'service',
    icon: 'Car'
  },
  {
    id: 'cat-choc-fountain',
    name: 'Grand 5-Tier Belgian Chocolate Fountain',
    price: 30000,
    priceType: 'flat',
    description: 'Flowing Belgian chocolate with strawberries, marshmallows, bakery pretzels, and pastries.',
    category: 'catering',
    icon: 'Cake'
  }
];

export const DECOR_THEMES = [
  {
    id: 'royal-gold',
    name: 'Royal Gold & Champagne',
    description: 'Warm gold linens, crystal charger plates, mahogany chiavari chairs, warm glowing amber light.',
    colorHex: '#D4AF37',
    previewBg: 'from-amber-900/40 via-yellow-950/30 to-amber-900/20'
  },
  {
    id: 'modern-chic',
    name: 'Modern Emerald & Velvet',
    description: 'Deep forest green velvet napkins, matte black utensils, geometric golden candle pillars.',
    colorHex: '#059669',
    previewBg: 'from-emerald-950/50 via-slate-900 to-emerald-950/30'
  },
  {
    id: 'romantic-blush',
    name: 'Romantic Blush & Ivory',
    description: 'Soft pink roses, sheer ivory drapery, silver cutlery, floating romantic candles.',
    colorHex: '#F472B6',
    previewBg: 'from-pink-950/40 via-rose-950/30 to-slate-900'
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight Sapphire & Diamond',
    description: 'Deep navy tablecloths, starry sky ceiling lights, clear acrylic ghost chairs, blue hydrangeas.',
    colorHex: '#2563EB',
    previewBg: 'from-blue-950/50 via-slate-900 to-indigo-950/40'
  }
];

export const SEATING_LAYOUTS = [
  { id: 'banquet-round', name: 'Banquet Round Tables (10 guests/table)', icon: 'Users' },
  { id: 'cocktail-reception', name: 'High Cocktail Tables & Lounge Pods', icon: 'Wine' },
  { id: 'theater-style', name: 'Auditorium / Theater Style Seating', icon: 'Grid' },
  { id: 'classroom-style', name: 'Classroom / Conference Setup', icon: 'BookOpen' },
  { id: 'u-shape', name: 'U-Shape Royal Head Table', icon: 'Maximize2' }
];
