import { IMG } from './images'

export const tourTypes = ['adventure', 'family', 'luxury', 'beach', 'mountain', 'historical']

export const tourTypeLabels = {
  adventure: 'Adventure Tours',
  family: 'Family Tours',
  luxury: 'Luxury Tours',
  beach: 'Beach Tours',
  mountain: 'Mountain Tours',
  historical: 'Historical Tours',
}

export const tours = [
  // Adventure
  { id: 't1', name: 'Machu Picchu Trek', type: 'adventure', destination: 'Cusco, Peru', image: IMG.machupicchu, rating: 4.9, reviews: 480, price: 850, oldPrice: 990, duration: '5 Days', groupSize: 12, included: ['Professional guide', 'Camping gear', 'Meals & water', 'Train to Aguas Calientes', 'Entry permits'], description: 'Follow the Inca Trail through cloud forests and ancient ruins to the Lost City of the Incas, watching sunrise over Machu Picchu from the Sun Gate.' },
  { id: 't2', name: 'Sahara Desert Expedition', type: 'adventure', destination: 'Merzouga, Morocco', image: IMG.desert, rating: 4.7, reviews: 320, price: 420, oldPrice: 520, duration: '3 Days', groupSize: 8, included: ['4x4 transfers', 'Camel trek', 'Berber camp night', 'All meals', 'Sandboarding'], description: 'Dune-bash to the Erg Chebbi, ride camels at golden hour and sleep under a blanket of stars in a luxury Berber desert camp.' },
  // Family
  { id: 't3', name: 'Bali Family Explorer', type: 'family', destination: 'Bali, Indonesia', image: IMG.bali, rating: 4.8, reviews: 560, price: 640, oldPrice: 760, duration: '7 Days', groupSize: 20, included: ['Family villa stay', 'Temple visits', 'Waterfall picnics', 'Kids cooking class', 'Airport transfers'], description: 'Seven days of temples, rice terraces, waterfalls and water parks — carefully paced so every age has fun from sunrise to sunset.' },
  { id: 't4', name: 'London & Paris Family', type: 'family', destination: 'London & Paris', image: IMG.london, rating: 4.6, reviews: 390, price: 980, oldPrice: 1150, duration: '8 Days', groupSize: 25, included: ['Eurostar tickets', '4-star hotels', 'London Eye & Eiffel tours', 'Breakfast daily', 'Family guide'], description: 'Two capital cities by high-speed train — Harry Potter studio, Science Museum, Eiffel Tower and Seine cruise, all family friendly.' },
  // Luxury
  { id: 't5', name: 'Maldives Overwater Escape', type: 'luxury', destination: 'Malé, Maldives', image: IMG.maldivesOverwater, rating: 5.0, reviews: 210, price: 2400, oldPrice: 2900, duration: '6 Days', groupSize: 4, included: ['Overwater villa', 'Seaplane transfer', 'Private butler', 'Sunset cruise', 'All-inclusive dining'], description: 'The ultimate barefoot-luxury itinerary: glass-floor villas, private sandbank dinners and a dedicated butler for the entire stay.' },
  { id: 't6', name: 'Dubai Iconic Luxury', type: 'luxury', destination: 'Dubai, UAE', image: IMG.dubai, rating: 4.9, reviews: 340, price: 1650, oldPrice: 1990, duration: '5 Days', groupSize: 8, included: ['Burj Khalifa "At the Top"', 'Desert safari in style', 'Yacht cruise', '5-star hotels', 'Fine dining'], description: 'Live the high life: champagne at the Burj, a private yacht around the Palm, and an exclusive desert camp under the stars.' },
  // Beach
  { id: 't7', name: 'Santorini Island Hopper', type: 'beach', destination: 'Santorini & Paros', image: IMG.santorini, rating: 4.9, reviews: 430, price: 890, oldPrice: 1080, duration: '6 Days', groupSize: 14, included: ['Ferry transfers', 'Cliffside hotels', 'Catamaran cruise', 'Wine tasting', 'Breakfast daily'], description: 'Hop between the Cyclades — swim in volcanic bays, taste Assyrtiko at cliffside wineries and chase the famous Oia sunset.' },
  { id: 't8', name: 'Phuket Beach Paradise', type: 'beach', destination: 'Phuket, Thailand', image: IMG.beach, rating: 4.7, reviews: 510, price: 520, oldPrice: 640, duration: '5 Days', groupSize: 18, included: ['Beachfront resort', 'Phi Phi island tour', 'Snorkeling gear', 'Thai cooking class', 'Transfers'], description: 'Powder-white sands, limestone islands and turquoise water — a classic Thai island escape with full-day snorkeling adventures.' },
  // Mountain
  { id: 't9', name: 'Swiss Alps Grand Tour', type: 'mountain', destination: 'Interlaken, Switzerland', image: IMG.alps, rating: 4.9, reviews: 380, price: 1150, oldPrice: 1350, duration: '6 Days', groupSize: 12, included: ['Glacier Express', 'Jungfraujoch ticket', 'Mountain hotels', 'Paragliding option', 'Breakfast daily'], description: 'Ride the Glacier Express, stand on the Top of Europe, and paraglide over alpine valleys in the most spectacular rail country on earth.' },
  { id: 't10', name: 'Himalayan Base Camp Trek', type: 'mountain', destination: 'Nepal', image: IMG.mountain, rating: 4.8, reviews: 260, price: 780, oldPrice: 920, duration: '7 Days', groupSize: 10, included: ['Licensed guides', 'Teahouse lodges', 'Permits & fees', 'Porters', 'All meals on trek'], description: 'Trek through rhododendron forests to the foot of the world’s highest peaks — a life-changing journey with teahouse warmth at every stop.' },
  // Historical
  { id: 't11', name: 'Rome & Florence Heritage', type: 'historical', destination: 'Rome, Italy', image: IMG.colosseum, rating: 4.8, reviews: 610, price: 720, oldPrice: 860, duration: '5 Days', groupSize: 20, included: ['Skip-the-line Colosseum', 'Vatican museums', 'Uffizi Gallery', 'High-speed trains', 'Local guides'], description: 'Walk two millennia of history from the Colosseum to the Sistine Chapel, then roll into Renaissance Florence by high-speed rail.' },
  { id: 't12', name: 'Imperial India Golden Triangle', type: 'historical', destination: 'Delhi – Agra – Jaipur', image: IMG.tajmahal, rating: 4.8, reviews: 440, price: 690, oldPrice: 820, duration: '6 Days', groupSize: 16, included: ['Taj Mahal at sunrise', 'Amber Fort & palaces', 'Private driver', 'Heritage hotels', 'Local experiences'], description: 'Marvel at the Taj Mahal at dawn, ride elephants up Amber Fort and dive into the bazaars of Jaipur with expert storytellers.' },
]

export const getTour = (id) => tours.find((t) => t.id === id)
export const toursByType = (type) => tours.filter((t) => t.type === type)
