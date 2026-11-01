import React, { useState } from 'react';
import { X, Search, CheckCircle, Clock, XCircle, Printer, AlertCircle, Loader2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const STATUS_DISPLAY: Record<string, { label: string; classes: string; icon: any }> = {
  new: { label: 'Awaiting Verification', classes: 'bg-blue-950 text-blue-400 border-blue-800', icon: Clock },
  pending: { label: 'Payment Pending Review', classes: 'bg-amber-950 text-amber-400 border-amber-800', icon: Clock },
  verified: { label: 'Confirmed & Reserved', classes: 'bg-emerald-950 text-emerald-400 border-emerald-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', classes: 'bg-red-950 text-red-400 border-red-800', icon: XCircle },
};

export const BookingLookupModal: React.FC = () => {
  const { isLookupModalOpen, closeLookupModal, findBookingById, halls } = useBooking();
  const [searchId, setSearchId] = useState('');
  const [foundBooking, setFoundBooking] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  if (!isLookupModalOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSearching(true);
    try {
      const res = await findBookingById(searchId);
      if (res) {
        setFoundBooking(res);
      } else {
        setFoundBooking(null);
        setErrorMsg(`No active reservation found with ID "${searchId}". Please check your receipt.`);
      }
    } catch {
      setFoundBooking(null);
      setErrorMsg('Failed to look up booking. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const hall = foundBooking ? halls.find(h => h.id === foundBooking.hallId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0A0F1D] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={closeLookupModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-serif font-bold text-white mb-2">
          Find Your Reservation Status
        </h2>
        <p className="text-xs text-gray-300 mb-6">
          Enter your 7-character Booking Reference Code (e.g. <span className="text-[#D4AF37] font-bold">GR-89421</span>)
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              required
              disabled={isSearching}
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Booking ID (e.g. GR-89421)"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-3 text-sm focus:border-[#D4AF37] outline-none uppercase font-mono tracking-wider disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="gold-gradient-bg text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[110px]"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching…</span>
              </>
            ) : (
              'Search'
            )}
          </button>
        </form>

        {isSearching && (
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
            <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
            <span>Looking up your reservation…</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {foundBooking && (
          <div className="glass-panel p-6 rounded-xl border border-[#D4AF37]/30 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Booking Reference</span>
                <span className="text-xl font-mono font-bold text-[#D4AF37]">{foundBooking.bookingId}</span>
              </div>
              <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase flex items-center gap-1 ${(STATUS_DISPLAY[foundBooking.status] || STATUS_DISPLAY.new).classes}`}>
                {(() => {
                  const Icon = (STATUS_DISPLAY[foundBooking.status] || STATUS_DISPLAY.new).icon;
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
                <span>{(STATUS_DISPLAY[foundBooking.status] || STATUS_DISPLAY.new).label}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Host Name</span>
                <span className="font-bold text-white text-sm">{foundBooking.customerName}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Contact Email</span>
                <span className="text-gray-200">{foundBooking.customerEmail}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Reserved Hall</span>
                <span className="font-bold text-white">{hall?.name || foundBooking.hallId}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Event Date & Slot</span>
                <span className="font-bold text-white">{foundBooking.date} ({foundBooking.timeSlot})</span>
              </div>
              <div>
                <span className="text-gray-400 block">Expected Guests</span>
                <span className="font-bold text-white">{foundBooking.guestCount} Guests</span>
              </div>
              <div>
                <span className="text-gray-400 block">Total Booking Value</span>
                <span className="font-serif font-bold text-[#D4AF37] text-sm">Rs. {foundBooking.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className={`text-xs font-semibold ${foundBooking.amountPaid >= foundBooking.totalPrice ? 'text-emerald-400' : foundBooking.amountPaid > 0 ? 'text-amber-400' : 'text-gray-400'}`}>
                {foundBooking.amountPaid >= foundBooking.totalPrice
                  ? '✓ All Payment Received'
                  : foundBooking.amountPaid > 0
                  ? `PKR ${foundBooking.amountPaid.toLocaleString()} received, PKR ${(foundBooking.totalPrice - foundBooking.amountPaid).toLocaleString()} remaining`
                  : 'Payment not yet verified by our team'}
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
