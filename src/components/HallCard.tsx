import React from 'react';
import { Users, Maximize2, Star, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Hall } from '../types';
import { useBooking } from '../context/BookingContext';

interface HallCardProps {
  hall: Hall;
}

export const HallCard: React.FC<HallCardProps> = ({ hall }) => {
  const { openBookingModal, openHallDetailsModal } = useBooking();

  return (
    <div className="group relative bg-[#111827]/80 rounded-2xl overflow-hidden border border-slate-800 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#D4AF37]/10">
      <div>
        {/* Card Image Container */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={hall.image}
            alt={hall.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-black/30" />

          {/* Popular Tag */}
          {hall.popular && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-slate-950 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>Most Popular</span>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-[#0A0F1D]/80 backdrop-blur-md border border-[#D4AF37]/30 text-white font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
            <span>{hall.rating}</span>
            <span className="text-gray-400 text-[10px]">({hall.reviewCount})</span>
          </div>

          {/* Hall Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#FFF5C0] transition-colors">
              {hall.name}
            </h3>
            <p className="text-xs text-gray-300 font-light line-clamp-1">{hall.subtitle}</p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 py-3 px-4 rounded-xl bg-[#0A0F1D]/60 border border-slate-800/80 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="text-gray-400 block text-[10px]">CAPACITY</span>
                <span className="font-semibold text-white">{hall.capacityMin}–{hall.capacityMax} Guests</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-[#D4AF37]" />
              <div>
                <span className="text-gray-400 block text-[10px]">SPACE AREA</span>
                <span className="font-semibold text-white">{hall.areaSqFt.toLocaleString()} sq.ft</span>
              </div>
            </div>
          </div>

          {/* Features Highlights */}
          <div className="space-y-2 mb-6">
            {hall.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="line-clamp-1">{feat}</span>
              </div>
            ))}
          </div>

          {/* Pricing Info */}
          <div className="flex items-baseline justify-between pt-3 border-t border-slate-800">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Starting From</span>
              <span className="text-2xl font-serif font-bold text-[#D4AF37]">
                Rs. {hall.priceMorning.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400"> / slot</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 font-semibold block">Full Day Available</span>
              <span className="text-xs text-gray-300">Rs. {hall.priceFullDay.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-6 pb-6 pt-2 flex items-center gap-3">
        <button
          onClick={() => openHallDetailsModal(hall)}
          className="flex-1 py-2.5 text-xs font-semibold text-gray-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 rounded-xl transition-all cursor-pointer"
        >
          View Specs
        </button>
        <button
          onClick={() => openBookingModal({ hallId: hall.id })}
          className="flex-1 py-2.5 text-xs font-bold text-slate-950 gold-gradient-bg rounded-xl flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#D4AF37]/15 cursor-pointer"
        >
          <span>Reserve</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
