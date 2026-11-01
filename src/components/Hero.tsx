import React from 'react';
import { Crown, Sparkles, Star, Calendar, ShieldCheck, Award } from 'lucide-react';
import { QuickAvailabilityBar } from './QuickAvailabilityBar';
import { useBooking } from '../context/BookingContext';

export const Hero: React.FC = () => {
  const { openBookingModal, toggleChatbot } = useBooking();

  return (
    <section className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero_ballroom.png"
          alt="Grand Royale Luxury Banquet Hall"
          className="w-full h-full object-cover scale-105 transform animate-pulse duration-10000"
          style={{ animationDuration: '20s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/70 to-[#0A0F1D]/80" />
        <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none" />
      </div>

      {/* Hero Body Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 text-center flex-1 flex flex-col justify-center">
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFF5C0] text-xs font-semibold uppercase tracking-[0.2em] mx-auto mb-6 shadow-lg shadow-[#D4AF37]/10 backdrop-blur-md">
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span>PARADIGM OF LUXURY BANQUETING</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-tight leading-tight max-w-5xl mx-auto mb-6">
          Where Unforgettable Moments Turn into{' '}
          <span className="gold-gradient-text">Timeless Legends</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-8">
          Host your dream wedding, royal gala, or executive conference in our award-winning ballrooms. 
          Experience AI-assisted real-time booking and white-glove gourmet dining.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => openBookingModal()}
            className="gold-gradient-bg text-slate-950 font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#D4AF37]/25 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Your Event Online</span>
          </button>

          <button
            onClick={toggleChatbot}
            className="px-7 py-4 rounded-full text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800 border border-[#D4AF37]/40 flex items-center gap-2 transition-all hover:border-[#D4AF37] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Launch AI Concierge</span>
          </button>
        </div>

        {/* Key Highlights / Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-gray-400 border-t border-slate-800/80 pt-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>Voted #1 Banquet Venue 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            <span>4.95/5 Rated by 350+ Clients</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Instant Date Lock & Refund Guarantee</span>
          </div>
        </div>
      </div>

      {/* Quick Search & Availability Bar Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <QuickAvailabilityBar />
      </div>
    </section>
  );
};
