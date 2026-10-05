import { IMG } from './images'

export const offers = [
  { id: 'o1', title: 'Summer Escape Sale', code: 'SUMMER25', discount: 25, type: 'Seasonal', category: 'Hotels & Resorts', image: IMG.beach, expiry: '2026-09-30', description: 'Flat 25% off on beachfront resorts worldwide. Perfect for a sun-soaked getaway before summer ends.', terms: ['Valid on stays of 3+ nights', 'Cannot be combined with other offers', 'Applies to selected properties'] },
  { id: 'o2', title: 'First Booking Bonus', code: 'WELCOME10', discount: 10, type: 'Coupon', category: 'All Bookings', image: IMG.hotair, expiry: '2026-12-31', description: 'New to Wanderlust? Enjoy 10% off your very first booking — flights, hotels, tours and more.', terms: ['One-time use per account', 'Valid on first completed booking', 'Minimum order $100'] },
  { id: 'o3', title: 'Business Class Upgrade', code: 'FLYFIRST', discount: 20, type: 'Promo', category: 'Flights', image: IMG.plane, expiry: '2026-11-30', description: 'Fly in style — 20% off business class fares on all long-haul international routes.', terms: ['Selected airlines only', 'Advance purchase required', 'Blackout dates apply'] },
  { id: 'o4', title: 'Family Fun Bundle', code: 'FAMILY15', discount: 15, type: 'Seasonal', category: 'Tours & Cruises', image: IMG.cruise, expiry: '2026-10-15', description: '15% off family tours and cruises when booking for 4 or more travelers. Memories included.', terms: ['Minimum 4 travelers', 'Applies to family category tours', 'Kids under 12 travel free on select sailings'] },
  { id: 'o5', title: 'Weekend Road Trip', code: 'ROADTRIP', discount: 18, type: 'Promo', category: 'Car Rentals', image: IMG.car1, expiry: '2026-12-31', description: 'Hit the open road — 18% off weekend car rentals (pickup Friday–Sunday) with unlimited mileage.', terms: ['Weekend pickups only', 'Unlimited mileage included', 'Subject to vehicle availability'] },
  { id: 'o6', title: 'Honeymoon Special', code: 'HONEY30', discount: 30, type: 'Coupon', category: 'Romantic Getaways', image: IMG.santorini, expiry: '2026-08-31', description: 'Newlyweds get 30% off romantic destinations — Maldives, Santorini, Bali and more, with a complimentary breakfast.', terms: ['Valid with wedding date within 12 months', 'Complimentary breakfast included', 'Proof required at check-in'] },
]

export const getOffer = (id) => offers.find((o) => o.id === id)
