import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HallCard } from './components/HallCard';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { CateringShowcase } from './components/CateringShowcase';
import { GallerySection } from './components/GallerySection';
import { LightboxModal } from './components/LightboxModal';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HallDetailsModal } from './components/HallDetailsModal';
import { BookingWizardModal } from './components/BookingWizard/BookingWizardModal';
import { BookingLookupModal } from './components/BookingLookupModal';
import { ChatBotWidget } from './components/AIChatbot/ChatBotWidget';
import { Building2, ServerCrash, Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { halls, hallsLoading, hallsError } = useBooking();
  return (
    <div className="min-h-screen bg-[#070B14] text-white selection:bg-[#D4AF37] selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar />

      {/* Backend connectivity banner — shown honestly instead of silently
          falling back to fake data when the server can't be reached. */}
      {hallsError && (
        <div className="bg-red-950/60 border-b border-red-800 text-red-200 text-sm px-4 py-3 flex items-center justify-center gap-2 text-center">
          <ServerCrash className="w-4 h-4 shrink-0" />
          <span>{hallsError}</span>
        </div>
      )}

      {/* Hero & Quick Search */}
      <Hero />

      {/* Halls & Spaces Showcase */}
      <section id="halls" className="py-24 bg-[#0A0F1D] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#FFF5C0] text-xs font-semibold uppercase tracking-widest mb-3">
              <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>THE COLLECTION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">
              Explore Our <span className="gold-gradient-text">Majestic Spaces</span>
            </h2>
            <p className="text-gray-300 font-light text-sm sm:text-base">
              From grand Swarovski-lit ballrooms to twilight botanical glasshouses, select the perfect setting tailored to your guest capacity.
            </p>
          </div>

          {hallsLoading ? (
            <div className="flex items-center justify-center gap-2 text-gray-400 py-16">
              <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
              <span>Loading halls…</span>
            </div>
          ) : hallsError ? (
            <div className="text-center py-16 text-gray-400">
              <ServerCrash className="w-8 h-8 mx-auto mb-3 text-red-400" />
              <p>Halls could not be loaded. {hallsError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {halls.map((hall) => (
                <HallCard key={hall.id} hall={hall} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Real-time Interactive Availability Calendar */}
      <AvailabilityCalendar />

      {/* White Glove Catering & Decor Customizer */}
      <CateringShowcase />

      {/* Past Events & Gallery */}
      <GallerySection />

      {/* Customer Reviews & Testimonials */}
      <ReviewsSection />

      {/* Location Map, Contact & FAQ */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Global Modals & Overlay Widgets */}
      <HallDetailsModal />
      <BookingWizardModal />
      <BookingLookupModal />
      <LightboxModal />
      <ChatBotWidget />
    </div>
  );
};

export function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}

export default App;
