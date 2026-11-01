export type TimeSlot = 'morning' | 'evening' | 'fullDay';

export type EventType = 
  | 'Wedding' 
  | 'Corporate Gala' 
  | 'Birthday Party' 
  | 'Anniversary' 
  | 'Award Ceremony' 
  | 'Private Banquet' 
  | 'Conference';

export interface Hall {
  id: string;
  name: string;
  subtitle: string;
  capacityMin: number;
  capacityMax: number;
  areaSqFt: number;
  priceMorning: number;
  priceEvening: number;
  priceFullDay: number;
  description: string;
  image: string;
  galleryImages: string[];
  features: string[];
  recommendedFor: EventType[];
  rating: number;
  reviewCount: number;
  virtual3DUrl?: string;
  popular?: boolean;
}

export interface CateringPackage {
  id: string;
  name: string;
  badge: string;
  pricePerGuest: number;
  description: string;
  includes: string[];
  popular?: boolean;
  dietaryOptions: string[];
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
  priceType: 'flat' | 'perGuest';
  description: string;
  category: 'decor' | 'entertainment' | 'catering' | 'service';
  icon: string;
}

export interface BookingDetails {
  bookingId?: string;
  hallId: string;
  date: string;
  timeSlot: TimeSlot;
  eventType: EventType;
  guestCount: number;
  layoutTheme: string;
  cateringPackageId: string;
  dietaryNotes: string[];
  selectedAddonIds: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
  basePrice: number;
  cateringPrice: number;
  addonsPrice: number;
  serviceCharge: number;
  taxes: number;
  totalPrice: number;
  depositDue: number;
  paymentMethod: 'easypaisa' | 'jazzcash' | 'bank';
  paymentChoice: 'deposit' | 'full';
  transactionId: string;
  paymentProofUrl?: string;
  amountPaid?: number;
  status: 'new' | 'pending' | 'verified' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  date: string;
  eventType: string;
  hallName: string;
  comment: string;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickChips?: string[];
  actionLink?: {
    label: string;
    action: string;
    payload?: any;
  };
}
