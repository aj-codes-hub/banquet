import React, { useState } from 'react';
import { Calendar, Users, Building, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { availabilityApi } from '../api';
import type { TimeSlot, EventType } from '../types';

export const QuickAvailabilityBar: React.FC = () => {
  const { openBookingModal, halls } = useBooking();
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [selectedHall, setSelectedHall] = useState('grand-imperial');
  const [guestCount, setGuestCount] = useState(250);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('evening');
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [checking, setChecking] = useState(false);
  const [unavailableMsg, setUnavailableMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnavailableMsg(null);
    setChecking(true);
    try {
      // Check real availability against the backend before opening the
      // booking wizard, so the customer isn't led into a slot that's
      // already taken.
      const result = await availabilityApi.check(selectedHall, selectedDate);
      const isOpen = result.availability[timeSlot];
      if (!isOpen) {
        setUnavailableMsg(
          `The ${timeSlot} slot on ${selectedDate} is already booked for this hall. Try another date or hall.`
        );
        return;
      }
    } catch (error) {
      console.error('Availability check failed, proceeding anyway:', error);
      // If the backend is unreachable, don't block the customer — the
      // booking form itself re-validates availability on submit.
    } finally {
      setChecking(false);
    }

    openBookingModal({
      hallId: selectedHall,
      date: selectedDate,
      timeSlot,
      guestCount,
      eventType
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel-gold rounded-2xl p-4 md:p-6 shadow-2xl border border-[#D4AF37]/30">
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Date Picker */}
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-[#D4AF37] mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Date</span>
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-[#0A0F1D]/80 border border-slate-700 focus:border-[#D4AF37] text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer"
            required
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-[#D4AF37] mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Occasion</span>
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EventType)}
            className="w-full bg-[#0A0F1D]/80 border border-slate-700 focus:border-[#D4AF37] text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer"
          >
            <option value="Wedding" className="bg-[#0A0F1D]">Wedding Reception</option>
            <option value="Corporate Gala" className="bg-[#0A0F1D]">Corporate Gala</option>
            <option value="Birthday Party" className="bg-[#0A0F1D]">Birthday Party</option>
            <option value="Anniversary" className="bg-[#0A0F1D]">Anniversary</option>
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-[#D4AF37] mb-1 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" />
            <span>Select Hall</span>
          </label>
          <select
            value={selectedHall}
            onChange={(e) => setSelectedHall(e.target.value)}
            className="w-full bg-[#0A0F1D]/80 border border-slate-700 focus:border-[#D4AF37] text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer"
          >
            {halls.map((hall) => (
              <option key={hall.id} value={hall.id} className="bg-[#0A0F1D] text-white">
                {hall.name}
              </option>
            ))}
          </select>
        </div>

        {/* Guest Count */}
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-[#D4AF37] mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Expected Guests</span>
          </label>
          <input
            type="number"
            min={20}
            max={1000}
            step={10}
            value={guestCount}
            onChange={(e) => setGuestCount(parseInt(e.target.value) || 50)}
            className="w-full bg-[#0A0F1D]/80 border border-slate-700 focus:border-[#D4AF37] text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer"
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-xs uppercase font-bold tracking-wider text-[#D4AF37] mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Time Slot</span>
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
            className="w-full bg-[#0A0F1D]/80 border border-slate-700 focus:border-[#D4AF37] text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer"
          >
            <option value="evening" className="bg-[#0A0F1D]">Evening (5pm - 12am)</option>
            <option value="morning" className="bg-[#0A0F1D]">Morning (9am - 3pm)</option>
            <option value="fullDay" className="bg-[#0A0F1D]">Full Day (9am - 12am)</option>
          </select>
        </div>

        {/* Submit Search Button */}
        <div>
          <button
            type="submit"
            disabled={checking}
            className="w-full gold-gradient-bg text-slate-950 font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking Availability…</span>
              </>
            ) : (
              <>
                <span>Check & Book</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {unavailableMsg && (
        <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{unavailableMsg}</span>
        </div>
      )}
    </div>
  );
};
