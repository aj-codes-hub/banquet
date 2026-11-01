/**
 * API Client for the Grand Royale Banquet backend (Next.js on port 3001)
 * Centralizes all fetch calls to the backend API.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ─── Generic fetch helper ─────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `API error: ${res.status}`);
  }

  return json.data as T;
}

// ─── Halls ────────────────────────────────────────────────────────────────────

import type { Hall, BookingDetails, Review } from "./types";

export const hallsApi = {
  getAll: () => apiFetch<Hall[]>("/api/halls"),
  getById: (id: string) => apiFetch<Hall>(`/api/halls/${id}`),
};

// ─── Availability ─────────────────────────────────────────────────────────────

export interface AvailabilityResult {
  hallId: string;
  date: string;
  availability: {
    morning: boolean;
    evening: boolean;
    fullDay: boolean;
  };
  bookedSlots: string[];
}

export const availabilityApi = {
  check: (hallId: string, date: string) =>
    apiFetch<AvailabilityResult>(
      `/api/availability?hallId=${encodeURIComponent(hallId)}&date=${encodeURIComponent(date)}`
    ),
  checkMonth: (hallId: string, year: number, month: number) =>
    apiFetch<MonthAvailabilityResult>(
      `/api/availability/month?hallId=${encodeURIComponent(hallId)}&year=${year}&month=${month}`
    ),
};

export interface MonthAvailabilityResult {
  hallId: string;
  year: number;
  month: number;
  days: Record<string, { morning: boolean; evening: boolean; fullDay: boolean; status: string }>;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  create: (booking: Omit<BookingDetails, "bookingId" | "status" | "createdAt">) =>
    apiFetch<BookingDetails>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),

  getById: (id: string) =>
    apiFetch<BookingDetails>(`/api/bookings/${encodeURIComponent(id)}`),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface ReviewSubmission {
  author: string;
  role: string;
  rating: number;
  eventType: string;
  hallName: string;
  comment: string;
  avatar?: string;
}

export const reviewsApi = {
  getAll: () => apiFetch<Review[]>("/api/reviews"),
  submit: (review: ReviewSubmission) =>
    apiFetch<Review>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(review),
    }),
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  message: string;
  preferredHall?: string;
}

export interface ContactResponse {
  id: string;
}

export const contactApi = {
  submit: (data: ContactSubmission) =>
    apiFetch<ContactResponse>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export async function uploadPaymentProof(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/upload-payment-proof`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Could not upload payment screenshot.');
  }
  return json.data.url as string;
}

// ─── Catering Packages ────────────────────────────────────────────────────────

import type { CateringPackage, AddonOption } from "./types";
import type { GalleryItem } from "./data/galleryData";

export const packagesApi = {
  getAll: () => apiFetch<CateringPackage[]>("/api/packages"),
};

// ─── Add-ons ──────────────────────────────────────────────────────────────────

export const addonsApi = {
  getAll: () => apiFetch<AddonOption[]>("/api/addons"),
};

// ─── Gallery ──────────────────────────────────────────────────────────────────

export const galleryApi = {
  getAll: () => apiFetch<GalleryItem[]>("/api/gallery"),
};

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SiteSettings {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  footerNote: string;
  easypaisaNumber: string;
  easypaisaAccountName: string;
  jazzcashNumber: string;
  jazzcashAccountName: string;
  bankName: string;
  bankAccountTitle: string;
  bankAccountNumber: string;
  bankIban: string;
}

export const settingsApi = {
  get: () => apiFetch<SiteSettings>("/api/settings"),
};
