import React, { useState } from 'react';
import { Crown, Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const Footer: React.FC = () => {
  const { openBookingModal, openLookupModal, settings, halls } = useBooking();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-[#050811] border-t border-[#D4AF37]/20 pt-16 pb-8 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#997A15] to-[#FFF5C0] p-[1px]">
                <div className="w-full h-full bg-[#0A0F1D] rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-[#D4AF37]" />
                </div>
              </div>
              <span className="text-lg font-serif font-bold text-white tracking-wide">
                {settings ? settings.businessName.toUpperCase() : '…'}
              </span>
            </div>

            <p className="text-gray-300 font-light leading-relaxed max-w-sm">
              The premier destination for luxury banquets, wedding receptions, and executive corporate galas. Featuring AI-assisted online booking and 5-star gastronomy.
            </p>

            {settings && (settings.phone || settings.email || settings.address) && (
              <div className="space-y-1.5 text-gray-400">
                {settings.phone && (
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#D4AF37]" />{settings.phone}</div>
                )}
                {settings.email && (
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#D4AF37]" />{settings.email}</div>
                )}
                {settings.address && (
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />{settings.address}</div>
                )}
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => openBookingModal()}
                className="gold-gradient-bg text-slate-950 font-bold px-4 py-2 rounded-lg text-xs uppercase cursor-pointer"
              >
                Book Hall
              </button>
              <button
                onClick={openLookupModal}
                className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-gray-300 hover:text-white cursor-pointer"
              >
                Find Booking
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {['Halls & Spaces', 'Availability Calendar', 'Catering & Menus', 'Visual Gallery', 'Guest Reviews'].map((item, i) => (
                <li key={i}>
                  <a href={`#${item.toLowerCase().split(' ')[0]}`} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hall Destinations */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Majestic Spaces
            </h4>
            <ul className="space-y-2.5">
              {halls.map((hall) => (
                <li key={hall.id}><span className="hover:text-white transition-colors cursor-pointer">{hall.name}</span></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Privé VIP Newsletter
            </h4>
            <p className="text-gray-300 font-light mb-3">
              Subscribe to receive exclusive seasonal package discounts and date notifications.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 text-center font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>VIP Subscription Active!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2 text-xs focus:border-[#D4AF37] outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg gold-gradient-bg text-slate-950 font-bold text-xs uppercase hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Subfooter */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} {settings ? settings.businessName : ''} Banquet & Event Center. All rights reserved.{settings?.footerNote ? ` ${settings.footerNote}` : ''}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
