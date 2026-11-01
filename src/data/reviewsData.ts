import type { Review } from '../types';

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    author: 'Victoria & Alexander Sterling',
    role: 'Bride & Groom',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'August 18, 2026',
    eventType: 'Wedding Reception',
    hallName: 'The Grand Imperial Ballroom',
    comment: 'Grand Royale surpassed every expectation we had for our wedding! The Swarovski chandeliers, white-glove catering service, and seamless AI booking assistant made planning stress-free. Our guests are still raving about the filet mignon!',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    role: 'VP of Global Events, Nexus Corp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'July 24, 2026',
    eventType: 'Corporate Gala',
    hallName: 'Skylight Executive Lounge',
    comment: 'We hosted our 500-person Annual Global Summit here. The 4K LED wall and sound setup were flawless. The online reservation calendar made holding our dates effortless. 10/10 venue experience.',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Elena & Roberto Rossi',
    role: 'Golden Anniversary Host',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'June 12, 2026',
    eventType: '50th Anniversary Party',
    hallName: 'Crystal Garden Pavilion',
    comment: 'The glass pavilion with the garden fairy lights provided the most magical atmosphere for my parents 50th anniversary. The team handled every detail from valet to custom floral setups with precision.',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Sophia Chen',
    role: 'Celebrity Event Planner',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'May 30, 2026',
    eventType: 'Fashion Award Gala',
    hallName: 'The Grand Imperial Ballroom',
    comment: 'As a luxury event planner, Grand Royale is always my top recommendation in the city. Their online portal, instant price calculator, and exceptional staff make organizing high-profile events a breeze.',
    verified: true
  }
];
