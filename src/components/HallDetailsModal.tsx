import React, { useState } from 'react';
import { X, Users, Maximize2, Check, Calendar, Star } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const HallDetailsModal: React.FC = () => {
  const { activeHallModal, closeHallDetailsModal, openBookingModal } = useBooking();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!activeHallModal) return null;

  const images = activeHallModal.galleryImages.length > 0 
    ? activeHallModal.galleryImages 
    : [activeHallModal.image];

  const handleStartBooking = () => {
    const hallId = activeHallModal.id;
    closeHallDetailsModal();
    openBookingModal({ hallId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0A0F1D] border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={closeHallDetailsModal}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white bg-black/60 rounded-full hover:bg-black/90 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery Viewer */}
          <div className="p-6 bg-[#070B14] flex flex-col justify-between">
            <div>
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-3 border border-slate-800">
                <img
                  src={images[activeImgIndex]}
                  alt={activeHallModal.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#0A0F1D]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#D4AF37] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  <span>{activeHallModal.rating} ({activeHallModal.reviewCount} Reviews)</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImgIndex === idx ? 'border-[#D4AF37] scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="text-gray-400 text-[10px] block">GUEST RANGE</span>
                  <span className="font-bold text-white">{activeHallModal.capacityMin} – {activeHallModal.capacityMax}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <span className="text-gray-400 text-[10px] block">TOTAL AREA</span>
                  <span className="font-bold text-white">{activeHallModal.areaSqFt.toLocaleString()} sq.ft</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Details */}
          <div className="p-6 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  HALL SPECIFICATIONS
                </span>
                <h2 className="text-2xl font-serif font-bold text-white mt-1">
                  {activeHallModal.name}
                </h2>
                <p className="text-xs text-gray-400 mt-1">{activeHallModal.subtitle}</p>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">
                {activeHallModal.description}
              </p>

              {/* Recommended Events */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Recommended For
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeHallModal.recommendedFor.map((ev, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-md bg-[#D4AF37]/10 text-[#FFF5C0] text-xs border border-[#D4AF37]/20">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features List */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Architectural & Tech Highlights
                </h4>
                <div className="space-y-2">
                  {activeHallModal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-200">
                      <div className="w-4 h-4 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#D4AF37]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental Rates Table */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-6">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">
                  Base Rental Rates
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-slate-800/50">
                    <span className="text-gray-400 block text-[10px]">Morning Slot</span>
                    <span className="font-bold text-[#D4AF37]">Rs. {activeHallModal.priceMorning.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-800/50">
                    <span className="text-gray-400 block text-[10px]">Evening Slot</span>
                    <span className="font-bold text-[#D4AF37]">Rs. {activeHallModal.priceEvening.toLocaleString()}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-800/50">
                    <span className="text-gray-400 block text-[10px]">Full Day</span>
                    <span className="font-bold text-[#D4AF37]">Rs. {activeHallModal.priceFullDay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={handleStartBooking}
                className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 gold-gradient-bg shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve {activeHallModal.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
