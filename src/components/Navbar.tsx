import React, { useState, useEffect } from 'react';
import { Crown, Calendar, Search, Menu, X, Sparkles } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const Navbar: React.FC = () => {
  const { openBookingModal, openLookupModal, toggleChatbot, settings } = useBooking();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Halls & Spaces', href: '#halls' },
    { name: 'Availability Calendar', href: '#availability' },
    { name: 'Catering & Menus', href: '#catering' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact & Location', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
        ? 'bg-[#0A0F1D]/90 backdrop-blur-md border-b border-[#D4AF37]/20 py-3 shadow-2xl shadow-black/50'
        : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#997A15] via-[#D4AF37] to-[#FFF5C0] p-[1px] shadow-lg shadow-[#D4AF37]/20">
              <div className="w-full h-full bg-[#0A0F1D] rounded-full flex items-center justify-center group-hover:bg-[#070B14] transition-colors">
                <Crown className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-serif tracking-wider text-white font-bold block leading-none">
                {settings ? settings.businessName.toUpperCase() : '…'}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-sans">
                {settings ? settings.tagline : ''}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors relative group py-1 cursor-pointer"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#D4AF37] to-[#FFF5C0] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={toggleChatbot}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold tracking-wide text-gray-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-[#D4AF37]/40 rounded-full transition-all cursor-pointer"
              title="Ask AI Concierge"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>AI Concierge</span>
            </button>

            {/* Lookup Booking */}
            <button
              onClick={openLookupModal}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Booking</span>
            </button>

            {/* Book Now Button */}
            <button
              onClick={() => openBookingModal()}
              className="relative group overflow-hidden rounded-full p-[1px] font-semibold text-xs uppercase tracking-wider text-slate-950 transition-all active:scale-95 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#FFF5C0] group-hover:opacity-90 transition-opacity" />
              <span className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#997A15] font-bold text-slate-950 cursor-pointer">
                <Calendar className="w-4 h-4" />
                <span>Reserve Hall</span>
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleChatbot}
              className="p-2 text-[#D4AF37] bg-slate-800/60 rounded-full cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0F1D]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 px-4 pt-4 pb-6 mt-2">
          <nav className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-gray-200 hover:text-[#D4AF37] font-medium transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLookupModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-300 bg-slate-800/70 border border-slate-700 rounded-lg cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#D4AF37]" />
              <span>Lookup Reservation</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 font-bold text-sm text-slate-950 gold-gradient-bg rounded-lg shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Hall Online</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
