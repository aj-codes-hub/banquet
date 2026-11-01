import React, { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, Sparkles, Printer, ArrowRight, ArrowLeft, AlertTriangle, Copy, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBooking } from '../../context/BookingContext';
import { availabilityApi, uploadPaymentProof, type AvailabilityResult } from '../../api';
import { DECOR_THEMES, SEATING_LAYOUTS } from '../../data/packagesData';
import type { TimeSlot, EventType, BookingDetails } from '../../types';

function CopyRow({
  label,
  value,
  copiedField,
  setCopiedField,
}: {
  label: string;
  value: string;
  copiedField: string | null;
  setCopiedField: (field: string | null) => void;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <button type="button" onClick={handleCopy} className="flex items-center gap-1.5 text-white font-mono font-semibold cursor-pointer hover:text-[#D4AF37]">
        {value}
        {copiedField === label ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

export const BookingWizardModal: React.FC = () => {
  const { isBookingOpen, closeBookingModal, bookingDraft, addConfirmedBooking, halls, packages, addons, settings } = useBooking();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State initialized from draft
  const [hallId, setHallId] = useState(bookingDraft.hallId || 'grand-imperial');
  const [date, setDate] = useState(
    bookingDraft.date || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(bookingDraft.timeSlot || 'evening');
  const [eventType, setEventType] = useState<EventType>(bookingDraft.eventType || 'Wedding');
  const [guestCount, setGuestCount] = useState(bookingDraft.guestCount || 200);

  const [layoutTheme, setLayoutTheme] = useState(bookingDraft.layoutTheme || 'royal-gold');
  const [seatingLayout, setSeatingLayout] = useState('banquet-round');

  const [cateringPkgId, setCateringPkgId] = useState(bookingDraft.cateringPackageId || 'platinum-royal');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(
    bookingDraft.selectedAddonIds || ['decor-luxury-floral']
  );

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Manual payment info (EasyPaisa / JazzCash / Bank transfer)
  const [paymentMethod, setPaymentMethod] = useState<'easypaisa' | 'jazzcash' | 'bank' | ''>('');
  const [paymentChoice, setPaymentChoice] = useState<'deposit' | 'full'>('deposit');
  const [transactionId, setTransactionId] = useState('');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [uploadingProof, setUploadingProof] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookingDetails | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Live slot availability for the selected hall + date. Re-checked
  // every time either changes, so an already-booked slot (e.g. morning
  // was just taken) is disabled here instead of only being caught after
  // the customer tries to submit.
  const [slotAvailability, setSlotAvailability] = useState<AvailabilityResult['availability'] | null>(null);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [slotCheckError, setSlotCheckError] = useState<string | null>(null);

  useEffect(() => {
    if (!isBookingOpen || !hallId || !date) return;
    let cancelled = false;
    setCheckingSlots(true);
    setSlotCheckError(null);
    availabilityApi
      .check(hallId, date)
      .then((result) => {
        if (cancelled) return;
        setSlotAvailability(result.availability);
        // If the slot the customer currently has selected just became
        // unavailable (someone else booked it), bump them to whichever
        // slot is still open instead of leaving a dead selection.
        if (!result.availability[timeSlot]) {
          const fallback = (['evening', 'morning', 'fullDay'] as TimeSlot[]).find(
            (slot) => result.availability[slot]
          );
          if (fallback) setTimeSlot(fallback);
        }
      })
      .catch((error) => {
        console.error('Failed to check slot availability:', error);
        if (!cancelled) {
          setSlotAvailability(null);
          setSlotCheckError('Could not verify availability from the backend. Please confirm the server is running.');
        }
      })
      .finally(() => {
        if (!cancelled) setCheckingSlots(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hallId, date, isBookingOpen]);

  if (!isBookingOpen) return null;

  // Guard against rendering before halls/packages have loaded from the
  // backend — without this, selectedHall/selectedCatering would be
  // undefined and every price calculation below would throw.
  if (halls.length === 0 || packages.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#0F1524] border border-gold/20 rounded-2xl p-8 text-center">
          <p className="text-gray-300 mb-2">Loading booking options…</p>
          <p className="text-xs text-gray-500">If this doesn't finish, the backend server may not be running.</p>
        </div>
      </div>
    );
  }

  const selectedHall = halls.find(h => h.id === hallId) || halls[0];
  const selectedCatering = packages.find(p => p.id === cateringPkgId) || packages[0];

  // Calculation Logic
  const getBasePrice = () => {
    if (timeSlot === 'morning') return selectedHall.priceMorning;
    if (timeSlot === 'evening') return selectedHall.priceEvening;
    return selectedHall.priceFullDay;
  };

  const basePrice = getBasePrice();
  const cateringPrice = selectedCatering.pricePerGuest * guestCount;

  const addonsPrice = selectedAddonIds.reduce((sum, addonId) => {
    const addon = addons.find(a => a.id === addonId);
    if (!addon) return sum;
    return sum + (addon.priceType === 'perGuest' ? addon.price * guestCount : addon.price);
  }, 0);

  const subtotal = basePrice + cateringPrice + addonsPrice;
  const serviceCharge = Math.round(subtotal * 0.10); // 10%
  const taxes = Math.round(subtotal * 0.05); // 5%
  const totalPrice = subtotal + serviceCharge + taxes;
  const depositDue = Math.round(totalPrice * 0.25 * 100) / 100; // 25% Deposit

  const handleAddonToggle = (id: string) => {
    if (selectedAddonIds.includes(id)) {
      setSelectedAddonIds(selectedAddonIds.filter(a => a !== id));
    } else {
      setSelectedAddonIds([...selectedAddonIds, id]);
    }
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields: string[] = [];
    if (!customerName.trim()) missingFields.push('Full Name');
    if (!customerEmail.trim()) missingFields.push('Email');
    if (!customerPhone.trim()) missingFields.push('Phone Number');
    if (!paymentMethod) missingFields.push('Payment Method');
    if (!transactionId.trim()) missingFields.push('Transaction ID');

    if (missingFields.length > 0) {
      setBookingError(`Please fill in the following before submitting: ${missingFields.join(', ')}.`);
      return;
    }

    setBookingError(null);
    setPaymentProcessing(true);

    // Re-verify the slot is still free right before charging — someone
    // else may have booked it in the time since the customer opened
    // this modal.
    try {
      const freshCheck = await availabilityApi.check(hallId, date);
      if (!freshCheck.availability[timeSlot]) {
        setPaymentProcessing(false);
        setSlotAvailability(freshCheck.availability);
        setBookingError(
          `The ${timeSlot} slot on ${date} was just booked by someone else. Please choose a different date or time slot.`
        );
        setCurrentStep(1);
        return;
      }
    } catch (error) {
      setPaymentProcessing(false);
      setBookingError('Could not reach the backend server to confirm availability. Please check your connection and try again.');
      return;
    }

    setTimeout(async () => {
      const newBooking: BookingDetails = {
        hallId,
        date,
        timeSlot,
        eventType,
        guestCount,
        layoutTheme,
        cateringPackageId: cateringPkgId,
        dietaryNotes: selectedCatering.dietaryOptions,
        selectedAddonIds,
        customerName,
        customerEmail,
        customerPhone,
        specialRequests,
        basePrice,
        cateringPrice,
        addonsPrice,
        serviceCharge,
        taxes,
        totalPrice,
        depositDue,
        paymentMethod,
        paymentChoice,
        transactionId: transactionId.trim(),
        paymentProofUrl,
        status: 'new',
        createdAt: new Date().toISOString().split('T')[0]
      };

      try {
        const saved = await addConfirmedBooking(newBooking);
        setPaymentProcessing(false);
        setConfirmedBookingData(saved);
        setCurrentStep(5);

        // Trigger Confetti
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (err) {
          // ignore — confetti is cosmetic only
        }
      } catch (error) {
        setPaymentProcessing(false);
        const message = error instanceof Error ? error.message : 'Could not complete this booking.';
        setBookingError(message);
        // A 409 conflict means someone else took the slot — send the
        // customer back to step 1 to pick a different date/time instead
        // of leaving them stuck on the payment screen.
        setCurrentStep(1);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0A0F1D] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] my-6">
        {/* Header Close */}
        <button
          onClick={closeBookingModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Title */}
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> ONLINE RESERVATION ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {currentStep === 5 ? 'Reservation Confirmed!' : 'Book Your Event at '}
            {settings && currentStep <= 4 ? settings.businessName : ''}
          </h2>
        </div>

        {bookingError && currentStep !== 4 && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* Wizard Progress Indicator */}
        {currentStep < 5 && (
          <div className="grid grid-cols-4 gap-2 mb-8 border-b border-slate-800 pb-4">
            {[
              { num: 1, label: 'Hall & Date' },
              { num: 2, label: 'Setup & Theme' },
              { num: 3, label: 'Catering & Addons' },
              { num: 4, label: 'Review & Pay' }
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-center gap-2 text-xs font-semibold pb-2 border-b-2 transition-all ${
                  currentStep === step.num
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : currentStep > step.num
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-slate-800 text-gray-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    currentStep === step.num
                      ? 'bg-[#D4AF37] text-slate-950 font-bold'
                      : currentStep > step.num
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-gray-400'
                  }`}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Date & Hall Picker */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Hall Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-2">Select Venue Hall</label>
                <div className="space-y-3">
                  {halls.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => setHallId(h.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        hallId === h.id
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={h.image} alt={h.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-sm font-bold text-white">{h.name}</h4>
                          <span className="text-xs text-gray-400">Cap: {h.capacityMin}–{h.capacityMax} guests</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#D4AF37]">Rs. {h.priceEvening.toLocaleString()}/eve</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Date, Time & Event Type */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Reservation Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    <span>Time Slot</span>
                  </label>

                  {checkingSlots && (
                    <div className="flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold rounded-lg px-3 py-2 mb-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Checking availability for this date…</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'morning', label: 'Morning', sub: '9am - 3pm' },
                      { id: 'evening', label: 'Evening', sub: '5pm - 12am' },
                      { id: 'fullDay', label: 'Full Day', sub: '9am - 12am' }
                    ].map((slot) => {
                      const isUnavailable = !checkingSlots && slotAvailability ? !slotAvailability[slot.id as TimeSlot] : false;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          disabled={isUnavailable || checkingSlots}
                          onClick={() => setTimeSlot(slot.id as TimeSlot)}
                          className={`p-2.5 rounded-xl text-center border text-xs transition-all ${
                            checkingSlots
                              ? 'bg-slate-950 text-gray-600 border-slate-900 cursor-wait opacity-40'
                              : isUnavailable
                              ? 'bg-slate-950 text-gray-600 border-slate-900 cursor-not-allowed opacity-50'
                              : timeSlot === slot.id
                              ? 'gold-gradient-bg text-slate-950 font-bold border-[#D4AF37] cursor-pointer'
                              : 'bg-slate-900 text-gray-300 border-slate-800 cursor-pointer'
                          }`}
                        >
                          <span className="block font-bold">{slot.label}</span>
                          <span className="text-[10px] opacity-80">{checkingSlots ? '…' : isUnavailable ? 'Booked' : slot.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                  {slotCheckError && (
                    <p className="text-[11px] text-red-400 mt-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {slotCheckError}
                    </p>
                  )}
                  {!checkingSlots && !slotCheckError && slotAvailability &&
                    !slotAvailability.morning && !slotAvailability.evening && !slotAvailability.fullDay && (
                      <p className="text-[11px] text-red-400 mt-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        All slots are booked for this hall on this date. Please choose another date.
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Event Occasion</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none cursor-pointer"
                  >
                    {['Wedding', 'Corporate Gala', 'Birthday Party', 'Anniversary', 'Award Ceremony', 'Private Banquet'].map((ev) => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                    Number of Guests: <span className="text-[#D4AF37] font-bold">{guestCount}</span>
                  </label>
                  <input
                    type="range"
                    min={selectedHall.capacityMin}
                    max={selectedHall.capacityMax}
                    step={10}
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Min: {selectedHall.capacityMin}</span>
                    <span>Max: {selectedHall.capacityMax}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={checkingSlots || (slotAvailability !== null && !slotAvailability[timeSlot])}
                className="gold-gradient-bg text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {checkingSlots ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking Availability...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Setup & Theme</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Seating & Decor Theme */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-300 mb-3">1. Choose Seating Layout</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SEATING_LAYOUTS.map((layout) => (
                  <div
                    key={layout.id}
                    onClick={() => setSeatingLayout(layout.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      seatingLayout === layout.id
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-gray-300'
                    }`}
                  >
                    <span className="text-xs">{layout.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-gray-300 mb-3">2. Select Signature Decor Theme</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DECOR_THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => setLayoutTheme(theme.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all bg-gradient-to-b ${theme.previewBg} ${
                      layoutTheme === theme.id
                        ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30'
                        : 'border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-sm">{theme.name}</span>
                      <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: theme.colorHex }} />
                    </div>
                    <p className="text-xs text-gray-300">{theme.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs text-gray-300 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="gold-gradient-bg text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 cursor-pointer"
              >
                <span>Continue to Catering & Addons</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Catering & Add-ons */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-sm font-bold uppercase text-gray-300 mb-3">1. Select Catering Menu Tier</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setCateringPkgId(pkg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      cateringPkgId === pkg.id
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white text-sm">{pkg.name}</h4>
                      <span className="text-xs text-[#D4AF37] font-bold">Rs. {pkg.pricePerGuest.toLocaleString()}/guest</span>
                    </div>
                    <p className="text-[11px] text-gray-300 line-clamp-2">{pkg.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-gray-300 mb-3">2. Optional Event Add-ons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addons.map((addon) => {
                  const selected = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleAddonToggle(addon.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-emerald-950/40 border-emerald-500'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div>
                        <h5 className="text-xs font-bold text-white">{addon.name}</h5>
                        <p className="text-[10px] text-gray-400">{addon.description}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 shrink-0 ml-2">
                        +Rs. {addon.price.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs text-gray-300 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="gold-gradient-bg text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 cursor-pointer"
              >
                <span>Review Order & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Details & Payment Checkout */}
        {currentStep === 4 && (
          <form onSubmit={handleCompletePayment} className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Contact Form & Payment Card simulation */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-sm font-bold uppercase text-gray-300">Contact & Billing Information</h3>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Customer Name *"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email Address *"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
                    />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Phone Number *"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Special requests or dietary notes..."
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:border-[#D4AF37] outline-none resize-none"
                  />
                </div>

                <h3 className="text-sm font-bold uppercase text-gray-300 pt-2">Payment</h3>

                {/* Deposit vs Full choice */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('deposit')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentChoice === 'deposit' ? 'gold-gradient-bg border-[#D4AF37]' : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    <span className={`block text-xs font-bold ${paymentChoice === 'deposit' ? 'text-slate-950' : 'text-white'}`}>Pay Deposit Now</span>
                    <span className={`block text-sm font-bold ${paymentChoice === 'deposit' ? 'text-slate-950' : 'text-[#D4AF37]'}`}>Rs. {depositDue.toLocaleString()}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentChoice('full')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentChoice === 'full' ? 'gold-gradient-bg border-[#D4AF37]' : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    <span className={`block text-xs font-bold ${paymentChoice === 'full' ? 'text-slate-950' : 'text-white'}`}>Pay Full Amount Now</span>
                    <span className={`block text-sm font-bold ${paymentChoice === 'full' ? 'text-slate-950' : 'text-[#D4AF37]'}`}>Rs. {totalPrice.toLocaleString()}</span>
                  </button>
                </div>

                {/* Payment method selection */}
                <div className="grid grid-cols-3 gap-2">
                  {settings?.easypaisaNumber && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('easypaisa')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        paymentMethod === 'easypaisa' ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' : 'bg-slate-900 border-slate-700 text-gray-300'
                      }`}
                    >
                      EasyPaisa
                    </button>
                  )}
                  {settings?.jazzcashNumber && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('jazzcash')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        paymentMethod === 'jazzcash' ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' : 'bg-slate-900 border-slate-700 text-gray-300'
                      }`}
                    >
                      JazzCash
                    </button>
                  )}
                  {settings?.bankAccountNumber && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        paymentMethod === 'bank' ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]' : 'bg-slate-900 border-slate-700 text-gray-300'
                      }`}
                    >
                      Bank Transfer
                    </button>
                  )}
                </div>

                {/* Account details for the selected method */}
                {paymentMethod && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 space-y-2 text-xs">
                    <p className="text-gray-400 mb-1">
                      Send <span className="text-[#D4AF37] font-bold">Rs. {(paymentChoice === 'full' ? totalPrice : depositDue).toLocaleString()}</span> to:
                    </p>
                    {paymentMethod === 'easypaisa' && (
                      <>
                        <CopyRow label="EasyPaisa Number" value={settings!.easypaisaNumber} copiedField={copiedField} setCopiedField={setCopiedField} />
                        <CopyRow label="Account Name" value={settings!.easypaisaAccountName} copiedField={copiedField} setCopiedField={setCopiedField} />
                      </>
                    )}
                    {paymentMethod === 'jazzcash' && (
                      <>
                        <CopyRow label="JazzCash Number" value={settings!.jazzcashNumber} copiedField={copiedField} setCopiedField={setCopiedField} />
                        <CopyRow label="Account Name" value={settings!.jazzcashAccountName} copiedField={copiedField} setCopiedField={setCopiedField} />
                      </>
                    )}
                    {paymentMethod === 'bank' && (
                      <>
                        <CopyRow label="Bank" value={settings!.bankName} copiedField={copiedField} setCopiedField={setCopiedField} />
                        <CopyRow label="Account Title" value={settings!.bankAccountTitle} copiedField={copiedField} setCopiedField={setCopiedField} />
                        <CopyRow label="Account Number" value={settings!.bankAccountNumber} copiedField={copiedField} setCopiedField={setCopiedField} />
                        {settings!.bankIban && <CopyRow label="IBAN" value={settings!.bankIban} copiedField={copiedField} setCopiedField={setCopiedField} />}
                      </>
                    )}
                  </div>
                )}

                {/* Transaction ID + optional screenshot */}
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Transaction ID (from your payment app) *"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
                />

                <label className="block">
                  <span className="text-[11px] text-gray-400 block mb-1.5">Payment screenshot (optional, but speeds up verification)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingProof(true);
                      try {
                        const url = await uploadPaymentProof(file);
                        setPaymentProofUrl(url);
                      } catch (err) {
                        alert(err instanceof Error ? err.message : 'Upload failed.');
                      } finally {
                        setUploadingProof(false);
                      }
                    }}
                    className="block w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-[#D4AF37] hover:file:bg-slate-700 file:cursor-pointer"
                  />
                  {uploadingProof && <p className="text-xs text-gray-400 mt-1">Uploading…</p>}
                  {paymentProofUrl && <p className="text-xs text-emerald-400 mt-1">Screenshot attached ✓</p>}
                </label>
              </div>

              {/* Right: Itemized Price Summary */}
              <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-[#D4AF37]/30 space-y-3 text-xs">
                <h4 className="font-serif font-bold text-white text-base border-b border-slate-800 pb-2">
                  Reservation Price Summary
                </h4>

                <div className="flex justify-between">
                  <span className="text-gray-300">{selectedHall.name} ({timeSlot})</span>
                  <span className="font-bold text-white">Rs. {basePrice.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">{selectedCatering.name} ({guestCount} guests)</span>
                  <span className="font-bold text-white">Rs. {cateringPrice.toLocaleString()}</span>
                </div>

                {selectedAddonIds.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Selected Addons ({selectedAddonIds.length})</span>
                    <span className="font-bold text-white">Rs. {addonsPrice.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Service Fee (10%)</span>
                  <span>Rs. {serviceCharge.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-400 border-b border-slate-800 pb-2">
                  <span>Estimated Taxes (5%)</span>
                  <span>Rs. {taxes.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-1">
                  <span>Total Event Value</span>
                  <span className="gold-gradient-text">Rs. {totalPrice.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-center">
                  <span className="text-[10px] text-gray-300 block uppercase">
                    {paymentChoice === 'full' ? 'Paying Full Amount Now' : 'Deposit Due Now'}
                  </span>
                  <span className="text-lg font-serif font-bold text-[#D4AF37]">
                    Rs. {(paymentChoice === 'full' ? totalPrice : depositDue).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {bookingError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs text-gray-300 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={paymentProcessing}
                className="gold-gradient-bg text-slate-950 font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[#D4AF37]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Booking…</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Submit Booking (Rs. {(paymentChoice === 'full' ? totalPrice : depositDue).toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Printable Confirmation Voucher */}
        {currentStep === 5 && confirmedBookingData && (
          <div id="printable-voucher" className="space-y-6 text-center animate-fadeIn py-4">
            <div className="w-16 h-16 rounded-full bg-amber-950 border border-amber-500 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Booking Received — Pending Verification</h3>
              <p className="text-xs text-gray-300 mt-1">
                Your booking reference ID is{' '}
                <span className="text-[#D4AF37] font-mono font-bold text-base px-2 py-0.5 rounded bg-[#D4AF37]/10">
                  {confirmedBookingData.bookingId}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
                We've received your payment details and sent a confirmation to your email. Our team will verify your
                transaction and confirm your reservation shortly — you can check the status anytime using your Booking ID.
              </p>
            </div>

            {/* Printable Pass Card */}
            <div className="glass-panel p-6 rounded-2xl border border-[#D4AF37]/40 text-left max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">VENUE LOCATION</span>
                  <span className="font-bold text-white text-sm">Grand Royale Banquet & Event Center</span>
                </div>
                <span className="text-xs font-bold text-[#D4AF37] font-mono">{confirmedBookingData.date}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block">Host Name</span>
                  <span className="font-bold text-white">{confirmedBookingData.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Reserved Hall</span>
                  <span className="font-bold text-white">{selectedHall.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Occasion & Slot</span>
                  <span className="font-bold text-white">{confirmedBookingData.eventType} ({confirmedBookingData.timeSlot})</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Guest Count</span>
                  <span className="font-bold text-white">{confirmedBookingData.guestCount} Guests</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Deposit Paid</span>
                  <span className="font-bold text-emerald-400">Rs. {confirmedBookingData.depositDue.toLocaleString()} (Paid)</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Total Contract Value</span>
                  <span className="font-bold text-[#D4AF37]">Rs. {confirmedBookingData.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Confirmation Voucher</span>
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  closeBookingModal();
                }}
                className="gold-gradient-bg text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase cursor-pointer"
              >
                Return to Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
