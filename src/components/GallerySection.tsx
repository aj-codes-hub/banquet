import React, { useState } from 'react';
import { Camera, Maximize2, Users, Building2, Loader2, ServerCrash } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const GallerySection: React.FC = () => {
  const { openLightbox, gallery, galleryLoading, galleryError, settings } = useBooking();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Weddings', 'Corporate', 'Parties', 'Catering'];

  const filteredItems = activeCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-[#070B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFF5C0] text-xs font-semibold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>VISUAL PORTFOLIO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Captivating <span className="gold-gradient-text">Past Celebrations</span>
          </h2>
          <p className="text-gray-300 font-light text-sm sm:text-base">
            Browse through moments captured from real weddings, high-society galas, and corporate events hosted at {settings ? settings.businessName : '…'}.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'gold-gradient-bg text-slate-950 font-bold shadow-lg shadow-[#D4AF37]/20 scale-105'
                  : 'bg-slate-900 text-gray-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {galleryLoading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
            <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
            <span>Loading gallery…</span>
          </div>
        ) : galleryError ? (
          <div className="text-center py-16 text-gray-400">
            <ServerCrash className="w-8 h-8 mx-auto mb-3 text-red-400" />
            <p>Gallery could not be loaded. {galleryError}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item.image)}
              className="group relative h-80 rounded-2xl overflow-hidden border border-slate-800 hover:border-[#D4AF37]/50 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Hover Zoom Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0A0F1D]/80 backdrop-blur-md border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all duration-300">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2.5 py-0.5 rounded-full inline-block mb-2">
                  {item.category}
                </span>
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#FFF5C0] transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-300 mt-1">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#D4AF37]" />
                    <span className="line-clamp-1">{item.hallName}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Users className="w-3 h-3 text-[#D4AF37]" />
                    <span>{item.guestCount} Guests</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};
