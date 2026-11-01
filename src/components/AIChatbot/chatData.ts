import { HALLS_DATA } from '../../data/hallsData';
import { CATERING_PACKAGES } from '../../data/packagesData';

export interface BotResponse {
  text: string;
  quickChips?: string[];
  actionLink?: {
    label: string;
    action: string;
    payload?: any;
  };
}

export const INITIAL_CHAT_MESSAGE = {
  id: 'welcome-1',
  sender: 'bot' as const,
  text: 'Hello! I am Aura, your virtual Event Planning Concierge at Grand Royale Banquet Hall. How may I assist you with your dream event today?',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  quickChips: [
    'Recommend hall for 250 guests',
    'View Catering Menus & Pricing',
    'Calculate Event Cost',
    'Check Date Availability',
    'Venue FAQs & Policy'
  ]
};

export function getBotResponse(userQuery: string): BotResponse {
  const query = userQuery.toLowerCase().trim();

  // 1. Guest count & Hall recommendation query
  if (query.includes('guest') || query.includes('capacity') || query.includes('recommend') || query.includes('hall for')) {
    const numbers = query.match(/\d+/g);
    let count = numbers ? parseInt(numbers[0]) : 200;

    const matchedHalls = HALLS_DATA.filter(h => count >= h.capacityMin * 0.7 && count <= h.capacityMax * 1.1);

    if (matchedHalls.length > 0) {
      const topHall = matchedHalls[0];
      return {
        text: `For a guest count of **${count}**, I highly recommend **${topHall.name}**! It accommodates ${topHall.capacityMin}–${topHall.capacityMax} guests with ${topHall.areaSqFt.toLocaleString()} sq.ft of luxury space. Would you like to check availability or start a reservation?`,
        quickChips: [`Book ${topHall.name}`, 'Check Catering Packages', 'Ask another question'],
        actionLink: {
          label: `Book ${topHall.name}`,
          action: 'open_booking_hall',
          payload: { hallId: topHall.id, guestCount: count }
        }
      };
    } else {
      return {
        text: `For ${count} guests, **The Grand Imperial Ballroom** is our premier venue supporting up to 600 guests comfortably with custom seating configurations and dance floors.`,
        quickChips: ['Book Grand Imperial Ballroom', 'View All Halls', 'Calculate Cost'],
        actionLink: {
          label: 'Book Grand Imperial Ballroom',
          action: 'open_booking_hall',
          payload: { hallId: 'grand-imperial', guestCount: count }
        }
      };
    }
  }

  // 2. Catering & Food query
  if (query.includes('cater') || query.includes('food') || query.includes('menu') || query.includes('buffet') || query.includes('price')) {
    const gold = CATERING_PACKAGES[0];
    const plat = CATERING_PACKAGES[1];
    const imp = CATERING_PACKAGES[2];
    return {
      text: `We offer 3 gourmet chef-curated catering tiers:\n\n• **${gold.name}** (Rs. ${gold.pricePerGuest.toLocaleString()}/guest): Multi-cuisine Pakistani & International buffet.\n• **${plat.name}** (Rs. ${plat.pricePerGuest.toLocaleString()}/guest - Most Popular): 4-course white-glove plated dining.\n• **${imp.name}** (Rs. ${imp.pricePerGuest.toLocaleString()}/guest): Live seafood, roasted lamb carving & 5-course royal feast.\n\nAll packages include 100% Halal Certified dietary options.`,
      quickChips: ['Explore Catering Builder', 'Calculate Budget', 'Book Hall Now'],
      actionLink: {
        label: 'Open Booking Wizard',
        action: 'open_booking'
      }
    };
  }

  // 3. Availability query
  if (query.includes('availab') || query.includes('date') || query.includes('open') || query.includes('weekend') || query.includes('october') || query.includes('december')) {
    return {
      text: `Our peak weekend dates fill up quickly! You can select any date in our interactive availability calendar to reserve your preferred time slot (Morning 9am-3pm, Evening 5pm-midnight, or Full Day).`,
      quickChips: ['Open Interactive Calendar', 'Book A Date Now'],
      actionLink: {
        label: 'Open Booking Engine',
        action: 'open_booking'
      }
    };
  }

  // 4. Pricing / Cost calculation query
  if (query.includes('cost') || query.includes('price') || query.includes('rate') || query.includes('estimate') || query.includes('how much')) {
    return {
      text: `Hall pricing starts from **Rs. 100,000** (Executive Lounge) up to **Rs. 450,000** (Imperial Ballroom evening rate). Total cost is calculated as:\n\n**Total = Base Hall Rate + (Guest Count × Catering Rate) + Optional Addons + Service & Tax**\n\nWould you like to try our real-time interactive price calculator?`,
      quickChips: ['Launch Booking Calculator', 'View Hall Rates', 'Talk to Human Agent'],
      actionLink: {
        label: 'Calculate My Event Cost',
        action: 'open_booking'
      }
    };
  }

  // 5. Policies & FAQ
  if (query.includes('policy') || query.includes('cancel') || query.includes('deposit') || query.includes('parking') || query.includes('outside vendor')) {
    return {
      text: `**Frequently Asked Questions:**\n\n• **Deposit Policy**: 25% deposit secures your date upon reservation.\n• **Cancellation**: Full refund within 14 days of booking. 50% refund up to 30 days before event.\n• **Parking**: On-site VIP Valet and 300+ covered guest parking spaces.\n• **Outside Vendors**: Permitted with prior event management approval.`,
      quickChips: ['Book A Hall', 'Contact Venue Team', 'Ask another question']
    };
  }

  // Fallback default response
  return {
    text: `I'm happy to assist! You can explore our luxury halls, test our live availability calendar, customized menus, or start an online booking reservation instantly. What would you like to do next?`,
    quickChips: ['View Halls', 'Catering Packages', 'Check Availability', 'Contact Us'],
    actionLink: {
      label: 'Start Online Booking',
      action: 'open_booking'
    }
  };
}
