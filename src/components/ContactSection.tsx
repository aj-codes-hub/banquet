import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown, ChevronUp, Loader2, AlertTriangle } from 'lucide-react';
import { contactApi } from '../api';
import { useBooking } from '../context/BookingContext';

export const ContactSection: React.FC = () => {
  const [inquirySent, setInquirySent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { settings } = useBooking();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const faqs = [
    {
      q: 'What is the deposit requirement to secure a hall?',
      a: 'We require a 25% deposit upon signing the digital reservation contract. The remaining balance is split into two installments prior to event day.'
    },
    {
      q: 'Can we bring our own outside caterer or decorator?',
      a: 'While our Executive Chefs provide award-winning catering, we do permit licensed outside specialty caterers and decor planners with prior venue management approval.'
    },
    {
      q: 'Is valet parking included for all guests?',
      a: 'Yes! We offer complimentary white-glove valet service for up to 300 vehicles along with adjacent covered garage parking.'
    },
    {
      q: 'What sound and curfew policies apply for late events?',
      a: 'Our indoor ballrooms feature concert-grade sound insulation with music permitted until 2:00 AM. Outdoor courtyard music transitions indoors by midnight.'
    }
  ];

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing: string[] = [];
    if (!name.trim()) missing.push('Full Name');
    if (!email.trim()) missing.push('Email');
    if (!phone.trim()) missing.push('Phone Number');
    if (!eventDate) missing.push('Preferred Event Date');
    if (!message.trim()) missing.push('Event Notes & Requests');

    if (missing.length > 0) {
      setSubmitError(`Please fill in: ${missing.join(', ')}.`);
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      await contactApi.submit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        eventType,
        eventDate,
        guestCount: guestCount ? Number(guestCount) : 0,
        message: message.trim(),
      });
      setInquirySent(true);
      setName('');
      setEmail('');
      setPhone('');
      setEventDate('');
      setGuestCount('');
      setMessage('');
      setTimeout(() => setInquirySent(false), 6000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not send your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#070B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFF5C0] text-xs font-semibold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            Visit & <span className="gold-gradient-text">Contact  {settings ? settings.businessName.toUpperCase() : '…'}</span>
          </h2>
          <p className="text-gray-300 font-light text-sm sm:text-base">
            Our event specialists are standing by to offer private venue walkthroughs and tailor custom banquet packages for you.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Contact Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xl font-serif font-bold text-white">Concierge Hotline</h3>

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Venue Address</span>
                  <span>{settings ? settings.address : '…'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Event Helpline</span>
                  <span>{settings ? settings.phone : '…'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Email Enquiries</span>
                  <span>{settings ? settings.email : '…'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-white block">Tours & Office Hours</span>
                  <span>Mon - Sun: 9:00 AM – 9:00 PM</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive Map Representation */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-xl bg-slate-900">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> PRIME METROPOLITAN LOCATION
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                    300+ Parking Bays
                  </span>
                </div>
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#997A15] to-[#FFF5C0] p-[2px] mx-auto mb-2 animate-bounce">
                    <div className="w-full h-full bg-[#0A0F1D] rounded-full flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                      GR
                    </div>
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">{settings ? settings.businessName : '…'} Estate</h4>
                  <p className="text-xs text-gray-400">10 Mins from Central Metro Station</p>
                </div>
                <div className="text-xs text-center text-gray-400 border-t border-slate-800 pt-2">
                  Helipad & Private VIP Drop-off Gate Available
                </div>
              </div>
            </div>
          </div>

          {/* Direct Inquiry Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">
                Send a Direct Venue Inquiry
              </h3>
              <p className="text-xs text-gray-300 mb-6 font-light">
                Fill out the quick form below for custom date holds or private site tour requests.
              </p>

              {inquirySent ? (
                <div className="p-8 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-serif font-bold text-white">Inquiry Received Successfully!</h4>
                  <p className="text-xs text-emerald-200">
                    A Senior Event Manager will contact you via email and phone within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-4">
                  {submitError && (
                    <p className="text-xs text-red-300 bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2.5 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      {submitError}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Your Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 0000000"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Estimated Guests</label>
                      <input
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        placeholder="e.g. 200"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Event Type</label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none cursor-pointer"
                      >
                        {['Wedding', 'Corporate Gala', 'Birthday Party', 'Anniversary', 'Award Ceremony', 'Private Banquet'].map((ev) => (
                          <option key={ev} value={ev}>{ev}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Preferred Event Date</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:border-[#D4AF37] outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase mb-1">Event Notes & Requests</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your event vision, preferred month, or special catering requests..."
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm focus:border-[#D4AF37] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 gold-gradient-bg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Inquiry…</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Venue Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-serif font-bold text-white text-center mb-8">
            Frequently Asked Venue Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-xl border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-serif font-semibold text-white text-sm hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed font-light border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};