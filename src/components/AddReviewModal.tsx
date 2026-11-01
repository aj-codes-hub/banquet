import React, { useState } from 'react';
import { X, Star, CheckCircle, Loader2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

interface AddReviewModalProps {
  onAddReview: (review: {
    author: string;
    role: string;
    rating: number;
    eventType: string;
    hallName: string;
    comment: string;
  }) => Promise<void>;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({ onAddReview }) => {
  const { isReviewModalOpen, closeReviewModal, halls, settings } = useBooking();
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('Bride / Groom');
  const [rating, setRating] = useState(5);
  const [eventType, setEventType] = useState('Wedding Reception');
  const [hallName, setHallName] = useState(halls[0]?.name ?? '');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isReviewModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    setSubmitting(true);
    setError(null);
    try {
      await onAddReview({
        author,
        role,
        rating,
        eventType,
        hallName: hallName || halls[0]?.name || '',
        comment
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        closeReviewModal();
      }, 1500);
    } catch {
      setError('Could not submit your review right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0A0F1D] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={closeReviewModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-sm text-gray-300">Your review has been verified and posted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-white mb-1">
              Share Your Event Experience
            </h2>
            <p className="text-xs text-gray-400 mb-4">We value your review of {settings ? settings.businessName : '…'} Banquet Services.</p>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Your Name</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Victoria & Alexander"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Role / Host Type</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Corporate Planner"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Event Type</label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="e.g. Wedding Reception"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-[#D4AF37] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Select Hall</label>
              <select
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:border-[#D4AF37] outline-none cursor-pointer"
              >
                {halls.map((h) => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'text-[#D4AF37] fill-[#D4AF37]'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#D4AF37] ml-2">{rating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Your Review</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the venue quality, service, food, and staff..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-sm text-slate-950 gold-gradient-bg shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Posting…</span>
                </>
              ) : (
                'Post Review'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
