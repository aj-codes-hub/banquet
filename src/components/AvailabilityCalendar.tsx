import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { availabilityApi, type MonthAvailabilityResult } from '../api';

export const AvailabilityCalendar: React.FC = () => {
  const { openBookingModal, halls } = useBooking();
  const [selectedHallId, setSelectedHallId] = useState('grand-imperial');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<MonthAvailabilityResult['days']>({});
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Fetch real bookings for this hall + month whenever either changes.
  useEffect(() => {
    let cancelled = false;
    setLoadingAvailability(true);
    availabilityApi
      .checkMonth(selectedHallId, year, month + 1)
      .then((result) => {
        if (!cancelled) {
          setMonthData(result.days);
          setAvailabilityError(null);
        }
      })
      .catch((error) => {
        console.error('Failed to load month availability from backend:', error);
        if (!cancelled) {
          setMonthData({});
          setAvailabilityError('Could not connect to the backend — availability shown may be inaccurate.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingAvailability(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedHallId, year, month]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Midnight today, for a clean date-only comparison (no time-of-day noise).
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Real status from the backend — falls back to 'available' for any day
  // with no bookings at all (it simply won't be in monthData).
  // 'peak' is a purely cosmetic weekend flourish, not a claim about actual
  // booking status, so it's fine to keep it visual-only. 'past' always
  // wins over everything else — a past date can't be booked regardless
  // of what the backend says about it.
  const getDayStatus = (dayNum: number) => {
    const cellDate = new Date(year, month, dayNum);
    if (cellDate < today) return 'past';

    const dayKey = String(dayNum).padStart(2, '0');
    const real = monthData[dayKey];
    if (real) return real.status; // 'booked' or 'limited', from real data

    const isWeekend = (firstDayOfWeek + dayNum - 1) % 7 === 0 || (firstDayOfWeek + dayNum - 1) % 7 === 6;
    return isWeekend ? 'peak' : 'available';
  };

  const handleSelectDate = (dayNum: number) => {
    const cellDate = new Date(year, month, dayNum);
    if (cellDate < today) return; // past dates are never selectable

    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    openBookingModal({
      hallId: selectedHallId,
      date: formattedDate
    });
  };

  return (
    <section id="availability" className="py-20 bg-[#070B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFF5C0] text-xs font-semibold uppercase tracking-widest mb-3">
            <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>REAL-TIME SCHEDULE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Interactive <span className="gold-gradient-text">Availability Calendar</span>
          </h2>
          <p className="text-gray-300 font-light text-sm sm:text-base">
            Select your preferred hall and check available dates instantly. Weekend dates feature live peak demand indicators.
          </p>
        </div>

        {/* Calendar Control Header */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
            {/* Hall Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {halls.map((hall) => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHallId(hall.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedHallId === hall.id
                      ? 'gold-gradient-bg text-slate-950 shadow-md shadow-[#D4AF37]/20 font-bold'
                      : 'bg-slate-900 text-gray-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {hall.name}
                </button>
              ))}
            </div>

            {/* Month Navigators */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-900 text-gray-300 hover:text-white border border-slate-800 hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-serif font-bold text-white min-w-[140px] text-center flex items-center justify-center gap-2">
                {monthNames[month]} {year}
                {loadingAvailability && <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-900 text-gray-300 hover:text-white border border-slate-800 hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {availabilityError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
              {availabilityError}
            </div>
          )}

          {/* Calendar Grid Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-3">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
              <div key={i} className="py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for month start */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-xl bg-slate-950/40 opacity-20" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const status = getDayStatus(dayNum);
              const isToday = dayNum === new Date().getDate() && month === new Date().getMonth();

              return (
                <button
                  key={dayNum}
                  disabled={status === 'booked' || status === 'past'}
                  onClick={() => handleSelectDate(dayNum)}
                  className={`h-20 sm:h-24 rounded-xl p-2 flex flex-col justify-between text-left transition-all border group relative ${
                    status === 'past'
                      ? 'bg-slate-950/60 border-slate-900 opacity-30 cursor-not-allowed'
                      : status === 'booked'
                      ? 'bg-red-950/20 border-red-900/30 opacity-40 cursor-not-allowed'
                      : status === 'limited'
                      ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400 hover:scale-102 cursor-pointer'
                      : status === 'peak'
                      ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-400 hover:scale-102 cursor-pointer'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-[#D4AF37] hover:scale-102 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        isToday ? 'bg-[#D4AF37] text-slate-950 font-black' : 'text-gray-200'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Status Badge Icon */}
                    {status === 'past' && (
                      <span className="text-[10px] text-gray-500 font-bold uppercase hidden sm:inline">Past</span>
                    )}
                    {status === 'booked' && (
                      <span className="text-[10px] text-red-400 font-bold uppercase hidden sm:inline">All Slots Booked</span>
                    )}
                    {status === 'limited' && (
                      <span className="text-[10px] text-amber-400 font-bold uppercase hidden sm:inline">1 Slot Left</span>
                    )}
                    {status === 'peak' && (
                      <span className="text-[10px] text-purple-400 font-bold uppercase hidden sm:inline">Peak Date</span>
                    )}
                    {status === 'available' && (
                      <span className="text-[10px] text-emerald-400 font-semibold hidden sm:inline">Open</span>
                    )}
                  </div>

                  {/* Cell Bottom CTA info */}
                  <div className="mt-auto">
                    {status === 'past' ? (
                      <span className="text-[9px] text-gray-500">Date has passed</span>
                    ) : status === 'booked' ? (
                      <span className="text-[9px] text-red-400">Fully Reserved</span>
                    ) : (
                      <div className="text-[10px] text-gray-400 group-hover:text-[#D4AF37] font-semibold flex items-center justify-between">
                        <span>Click to Reserve</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-800 text-xs font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
              <span>Available Date</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-900/60 border border-purple-500" />
              <span>Peak Weekend Slot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-900/60 border border-amber-500" />
              <span>Limited Slots (1 Left)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-950 border border-red-900" />
              <span>All Slots Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800 opacity-50" />
              <span>Past Date</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
