import React, { useState } from 'react';
import { Star, CheckCircle2, PlusCircle, Award, Loader2, ServerCrash } from 'lucide-react';
import { AddReviewModal } from './AddReviewModal';
import { useBooking } from '../context/BookingContext';

export const ReviewsSection: React.FC = () => {
  const { openReviewModal, reviews, reviewsLoading, reviewsError, submitReview } = useBooking();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAddReview = async (newReviewData: {
    author: string;
    role: string;
    rating: number;
    eventType: string;
    hallName: string;
    comment: string;
  }) => {
    try {
      setSubmitError(null);
      // Persist to the backend (MongoDB) instead of only updating local state.
      await submitReview(newReviewData);
    } catch (error) {
      console.error('Failed to submit review to backend:', error);
      setSubmitError('Could not submit your review right now. Please try again in a moment.');
    }
  };

  return (
    <section id="reviews" className="py-20 bg-[#0A0F1D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFF5C0] text-xs font-semibold uppercase tracking-widest mb-3">
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>GUEST TESTIMONIALS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Endorsed by <span className="gold-gradient-text">Distinguished Hosts</span>
            </h2>
          </div>

          <button
            onClick={openReviewModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-bold text-slate-950 gold-gradient-bg shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Your Review</span>
          </button>
        </div>

        {submitError && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-2.5 mb-6">
            {submitError}
          </p>
        )}

        {/* Reviews Grid */}
        {reviewsLoading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
            <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
            <span>Loading reviews…</span>
          </div>
        ) : reviewsError ? (
          <div className="text-center py-16 text-gray-400">
            <ServerCrash className="w-8 h-8 mx-auto mb-3 text-red-400" />
            <p>Reviews could not be loaded. {reviewsError}</p>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No reviews yet — be the first to share your experience.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]/30"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-white text-base">{rev.author}</h4>
                      <span className="text-xs text-gray-400 block">{rev.role}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-gray-300 font-light leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Footer Event Details */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-[#D4AF37] font-semibold">{rev.eventType}</span>
                  <span>•</span>
                  <span>{rev.hallName}</span>
                </div>
                {rev.verified && (
                  <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[10px] uppercase">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Booking</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      <AddReviewModal onAddReview={handleAddReview} />
    </section>
  );
};
