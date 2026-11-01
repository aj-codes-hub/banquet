import React from 'react';
import { X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const LightboxModal: React.FC = () => {
  const { lightboxImage, closeLightbox } = useBooking();

  if (!lightboxImage) return null;

  return (
    <div
      onClick={closeLightbox}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn cursor-pointer"
    >
      <button
        onClick={closeLightbox}
        className="absolute top-6 right-6 p-3 text-white bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700 transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl"
      >
        <img
          src={lightboxImage}
          alt="Enlarged View"
          className="w-full h-full object-contain max-h-[80vh]"
        />
      </div>
    </div>
  );
};
