import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Hall, BookingDetails, Review, CateringPackage, AddonOption } from '../types';
import type { GalleryItem } from '../data/galleryData';
import {
  bookingsApi,
  hallsApi,
  reviewsApi,
  packagesApi,
  addonsApi,
  galleryApi,
  settingsApi,
  type ReviewSubmission,
  type SiteSettings,
} from '../api';

interface BookingContextType {
  // Booking Wizard Modal
  isBookingOpen: boolean;
  openBookingModal: (initialData?: Partial<BookingDetails>) => void;
  closeBookingModal: () => void;
  bookingDraft: Partial<BookingDetails>;
  setBookingDraft: React.Dispatch<React.SetStateAction<Partial<BookingDetails>>>;

  // Hall Details Modal
  activeHallModal: Hall | null;
  openHallDetailsModal: (hall: Hall) => void;
  closeHallDetailsModal: () => void;

  // Image Lightbox
  lightboxImage: string | null;
  openLightbox: (imgUrl: string) => void;
  closeLightbox: () => void;

  // Chatbot State
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  toggleChatbot: () => void;

  // Review Modal
  isReviewModalOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;

  // Booking Lookup Modal
  isLookupModalOpen: boolean;
  openLookupModal: () => void;
  closeLookupModal: () => void;

  // Booking History / Confirmed Bookings
  confirmedBookings: BookingDetails[];
  addConfirmedBooking: (booking: BookingDetails) => Promise<BookingDetails>;
  findBookingById: (id: string) => Promise<BookingDetails | undefined>;

  // Halls — fetched from the backend (MongoDB). No fallback to static
  // mock data: if the backend is unreachable, hallsError is set.
  halls: Hall[];
  hallsLoading: boolean;
  hallsError: string | null;

  // Reviews — same real-data-or-explicit-error pattern
  reviews: Review[];
  reviewsLoading: boolean;
  reviewsError: string | null;
  submitReview: (review: ReviewSubmission) => Promise<void>;

  // Catering packages, add-ons, gallery — all fetched from the backend,
  // same real-data-or-explicit-error pattern (no static mock fallback).
  packages: CateringPackage[];
  packagesLoading: boolean;
  packagesError: string | null;

  addons: AddonOption[];
  addonsLoading: boolean;
  addonsError: string | null;

  gallery: GalleryItem[];
  galleryLoading: boolean;
  galleryError: string | null;

  // Site settings (business name, contact info) — editable from the admin panel.
  settings: SiteSettings | null;
  settingsLoading: boolean;
  settingsError: string | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDraft, setBookingDraft] = useState<Partial<BookingDetails>>({
    hallId: 'grand-imperial',
    date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // Default 7 days in future
    timeSlot: 'evening',
    eventType: 'Wedding',
    guestCount: 200,
    layoutTheme: 'royal-gold',
    cateringPackageId: 'platinum-royal',
    dietaryNotes: [],
    selectedAddonIds: ['decor-luxury-floral'],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  });

  const [activeHallModal, setActiveHallModal] = useState<Hall | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  // Halls — fetched from the backend (MongoDB). No fallback to static
  // mock data: if the backend is unreachable, callers see hallsError and
  // should show that clearly instead of pretending everything is fine.
  const [halls, setHalls] = useState<Hall[]>([]);
  const [hallsLoading, setHallsLoading] = useState(true);
  const [hallsError, setHallsError] = useState<string | null>(null);

  useEffect(() => {
    hallsApi
      .getAll()
      .then((data) => {
        setHalls(data);
        setHallsError(null);
      })
      .catch((error) => {
        console.error('Failed to load halls from backend:', error);
        setHallsError(
          'Could not connect to the backend server. Please make sure it is running on http://localhost:3001.'
        );
      })
      .finally(() => setHallsLoading(false));
  }, []);

  // Reviews — same real-data-or-explicit-error pattern as halls.
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    reviewsApi
      .getAll()
      .then((data) => {
        setReviews(data);
        setReviewsError(null);
      })
      .catch((error) => {
        console.error('Failed to load reviews from backend:', error);
        setReviewsError(
          'Could not connect to the backend server. Please make sure it is running on http://localhost:3001.'
        );
      })
      .finally(() => setReviewsLoading(false));
  }, []);

  const submitReview = async (review: ReviewSubmission) => {
    const saved = await reviewsApi.submit(review);
    setReviews((prev) => [saved, ...prev]);
  };

  // Catering packages
  const [packages, setPackages] = useState<CateringPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState<string | null>(null);

  useEffect(() => {
    packagesApi
      .getAll()
      .then((data) => {
        setPackages(data);
        setPackagesError(null);
      })
      .catch((error) => {
        console.error('Failed to load packages from backend:', error);
        setPackagesError('Could not connect to the backend server.');
      })
      .finally(() => setPackagesLoading(false));
  }, []);

  // Add-ons
  const [addons, setAddons] = useState<AddonOption[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(true);
  const [addonsError, setAddonsError] = useState<string | null>(null);

  useEffect(() => {
    addonsApi
      .getAll()
      .then((data) => {
        setAddons(data);
        setAddonsError(null);
      })
      .catch((error) => {
        console.error('Failed to load addons from backend:', error);
        setAddonsError('Could not connect to the backend server.');
      })
      .finally(() => setAddonsLoading(false));
  }, []);

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  useEffect(() => {
    galleryApi
      .getAll()
      .then((data) => {
        setGallery(data);
        setGalleryError(null);
      })
      .catch((error) => {
        console.error('Failed to load gallery from backend:', error);
        setGalleryError('Could not connect to the backend server.');
      })
      .finally(() => setGalleryLoading(false));
  }, []);

  // Site settings (business name, contact info)
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    settingsApi
      .get()
      .then((data) => {
        setSettings(data);
        setSettingsError(null);
      })
      .catch((error) => {
        console.error('Failed to load settings from backend:', error);
        setSettingsError('Could not connect to the backend server.');
      })
      .finally(() => setSettingsLoading(false));
  }, []);

  // No pre-seeded dummy booking — this starts empty. Every entry here
  // comes from an actual successful call to the backend.
  const [confirmedBookings, setConfirmedBookings] = useState<BookingDetails[]>([]);

  const openBookingModal = (initialData?: Partial<BookingDetails>) => {
    if (initialData) {
      setBookingDraft(prev => ({ ...prev, ...initialData }));
    }
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => setIsBookingOpen(false);

  const openHallDetailsModal = (hall: Hall) => setActiveHallModal(hall);
  const closeHallDetailsModal = () => setActiveHallModal(null);

  const openLightbox = (imgUrl: string) => setLightboxImage(imgUrl);
  const closeLightbox = () => setLightboxImage(null);

  const toggleChatbot = () => setIsChatbotOpen(prev => !prev);

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const openLookupModal = () => setIsLookupModalOpen(true);
  const closeLookupModal = () => setIsLookupModalOpen(false);

  const addConfirmedBooking = async (bookingData: BookingDetails): Promise<BookingDetails> => {
    // No local fallback: if the backend is down or rejects the booking
    // (e.g. the slot was just taken by someone else), the caller needs to
    // see that error and handle it — silently faking success would let a
    // customer walk away thinking they have a confirmed reservation when
    // they don't.
    const savedBooking = await bookingsApi.create(bookingData);
    setConfirmedBookings(prev => [savedBooking, ...prev]);
    return savedBooking;
  };

  const findBookingById = async (id: string): Promise<BookingDetails | undefined> => {
    const cleanId = id.trim().toUpperCase();
    // First check local state (fast)
    const local = confirmedBookings.find(b => b.bookingId?.toUpperCase() === cleanId);
    if (local) return local;
    // Then fetch from the backend API (MongoDB)
    try {
      const booking = await bookingsApi.getById(cleanId);
      return booking;
    } catch {
      return undefined;
    }
  };

  return (
    <BookingContext.Provider value={{
      isBookingOpen,
      openBookingModal,
      closeBookingModal,
      bookingDraft,
      setBookingDraft,
      activeHallModal,
      openHallDetailsModal,
      closeHallDetailsModal,
      lightboxImage,
      openLightbox,
      closeLightbox,
      isChatbotOpen,
      setIsChatbotOpen,
      toggleChatbot,
      isReviewModalOpen,
      openReviewModal,
      closeReviewModal,
      isLookupModalOpen,
      openLookupModal,
      closeLookupModal,
      confirmedBookings,
      addConfirmedBooking,
      findBookingById,
      halls,
      hallsLoading,
      hallsError,
      reviews,
      reviewsLoading,
      reviewsError,
      submitReview,
      packages,
      packagesLoading,
      packagesError,
      addons,
      addonsLoading,
      addonsError,
      gallery,
      galleryLoading,
      galleryError,
      settings,
      settingsLoading,
      settingsError
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
