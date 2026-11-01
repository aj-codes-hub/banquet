import React, { useState } from 'react';
import { CheckCircle2, ChefHat, Palette, Award, Loader2, ServerCrash } from 'lucide-react';
import { DECOR_THEMES } from '../data/packagesData';
import { useBooking } from '../context/BookingContext';

export const CateringShowcase: React.FC = () => {
  const { openBookingModal, packages, packagesLoading, packagesError } = useBooking();
  const [activePkgId, setActivePkgId] = useState('platinum-royal');
  const [selectedThemeId, setSelectedThemeId] = useState('royal-gold');

  const currentPackage = packages.find(p => p.id === activePkgId) || packages[0];

  if (packagesLoading) {
    return (
      <section id="catering" className="py-20 bg-[#0A0F1D] flex items-center justify-center gap-2 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /> Loading catering packages…
      </section>
    );
  }

  if (packagesError || !currentPackage) {
    return (
      <section id="catering" className="py-20 bg-[#0A0F1D] text-center text-gray-400">
        <ServerCrash className="w-8 h-8 mx-auto mb-3 text-red-400" />
        <p>Catering packages could not be loaded. {packagesError}</p>
      </section>
    );
  }

  return (
    <section id="catering" className="py-20 bg-[#0A0F1D] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFF5C0] text-xs font-semibold uppercase tracking-widest mb-3">
            <ChefHat className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>GASTRONOMY & THEMES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
            White-Glove <span className="gold-gradient-text">Catering & Ambience</span>
          </h2>
          <p className="text-gray-300 font-light text-sm sm:text-base">
            Indulge your guests with menus crafted by Executive Master Chefs. Paired with custom lighting and artisanal decor themes.
          </p>
        </div>

        {/* Top Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Left Column: Image & Feature highlight */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl min-h-[350px]">
            <img
              src="/assets/catering_feast.png"
              alt="Gourmet Banquet Feast"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-xl border border-[#D4AF37]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">5-Star Culinary Team</h4>
                  <p className="text-xs text-gray-300">Customizable dietary menus for all guest palates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Package Selector */}
          <div className="lg:col-span-7 flex flex-col justify-between glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div>
              {/* Package Tabs */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setActivePkgId(pkg.id)}
                    className={`py-3 px-2 rounded-xl text-center transition-all border cursor-pointer ${
                      activePkgId === pkg.id
                        ? 'gold-gradient-bg text-slate-950 font-bold border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                        : 'bg-slate-900/80 text-gray-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wider font-semibold">
                      {pkg.name.split(' ')[0]}
                    </span>
                    <span className="text-xs opacity-90">Rs. {pkg.pricePerGuest.toLocaleString()}/guest</span>
                  </button>
                ))}
              </div>

              {/* Package Details Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold text-white">
                    {currentPackage.name}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#FFF5C0] text-xs font-semibold border border-[#D4AF37]/30">
                    {currentPackage.badge}
                  </span>
                </div>

                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  {currentPackage.description}
                </p>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentPackage.dietaryOptions.map((diet, idx) => (
                    <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                      ✓ {diet}
                    </span>
                  ))}
                </div>

                {/* Includes List */}
                <div className="space-y-2.5 pt-3">
                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Menu Features & Inclusions:</h4>
                  {currentPackage.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase text-gray-400 block">Package Price</span>
                <span className="text-2xl font-serif font-bold text-[#D4AF37]">
                  Rs. {currentPackage.pricePerGuest.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400"> / guest</span>
              </div>
              <button
                onClick={() => openBookingModal({ cateringPackageId: currentPackage.id })}
                className="gold-gradient-bg text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#D4AF37]/20 cursor-pointer"
              >
                Select Package for Reservation
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Decor Theme Visualizer */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-xl font-serif font-bold text-white">
              Signature Table Decor Themes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DECOR_THEMES.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setSelectedThemeId(theme.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer bg-gradient-to-b ${theme.previewBg} ${
                  selectedThemeId === theme.id
                    ? 'border-[#D4AF37] shadow-xl shadow-[#D4AF37]/15 scale-102'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-4 h-4 rounded-full border border-white/40"
                    style={{ backgroundColor: theme.colorHex }}
                  />
                  {selectedThemeId === theme.id && (
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                      Selected
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-white text-base mb-1">{theme.name}</h4>
                <p className="text-xs text-gray-300 font-light leading-relaxed">{theme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
