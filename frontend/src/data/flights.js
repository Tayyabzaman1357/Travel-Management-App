import { IMG } from './images'

export const airlines = [
  { code: 'QR', name: 'Qatar Airways', logo: 'qr', rating: 4.9 },
  { code: 'EK', name: 'Emirates', logo: 'ek', rating: 4.9 },
  { code: 'TK', name: 'Turkish Airlines', logo: 'tk', rating: 4.6 },
  { code: 'BA', name: 'British Airways', logo: 'ba', rating: 4.4 },
  { code: 'AF', name: 'Air France', logo: 'af', rating: 4.4 },
  { code: 'LH', name: 'Lufthansa', logo: 'lh', rating: 4.5 },
  { code: 'SQ', name: 'Singapore Airlines', logo: 'sq', rating: 4.9 },
  { code: 'ET', name: 'Ethiopian Airlines', logo: 'et', rating: 4.2 },
  { code: 'AA', name: 'American Airlines', logo: 'aa', rating: 4.1 },
  { code: 'DL', name: 'Delta Air Lines', logo: 'dl', rating: 4.3 },
]

export const airports = [
  { code: 'CDG', city: 'Paris', country: 'France', name: 'Charles de Gaulle' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan', name: 'Narita International' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International' },
  { code: 'DPS', city: 'Bali', country: 'Indonesia', name: 'Ngurah Rai International' },
  { code: 'JTR', city: 'Santorini', country: 'Greece', name: 'Santorini International' },
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy' },
  { code: 'FCO', city: 'Rome', country: 'Italy', name: 'Leonardo da Vinci' },
  { code: 'MLE', city: 'Malé', country: 'Maldives', name: 'Velana International' },
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'Heathrow' },
  { code: 'IST', city: 'Istanbul', country: 'Türkiye', name: 'Istanbul Airport' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', name: 'Los Angeles International' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', name: 'Kingsford Smith' },
]

export const flights = [
  { id: 'f1', airline: 'QR', flightNo: 'QR 831', from: 'New York', fromCode: 'JFK', to: 'Paris', toCode: 'CDG', departTime: '07:30', arriveTime: '20:45', duration: 475, stops: 0, price: 512, class: 'Economy', seatsLeft: 8, date: '2026-08-14', baggage: '23kg' },
  { id: 'f2', airline: 'AF', flightNo: 'AF 22', from: 'New York', fromCode: 'JFK', to: 'Paris', toCode: 'CDG', departTime: '17:45', arriveTime: '07:10', duration: 445, stops: 0, price: 468, class: 'Economy', seatsLeft: 14, date: '2026-08-14', baggage: '23kg' },
  { id: 'f3', airline: 'BA', flightNo: 'BA 176', from: 'New York', fromCode: 'JFK', to: 'Paris', toCode: 'CDG', departTime: '19:20', arriveTime: '09:35', duration: 495, stops: 1, price: 399, class: 'Economy', seatsLeft: 22, date: '2026-08-14', baggage: '23kg' },
  { id: 'f4', airline: 'EK', flightNo: 'EK 202', from: 'New York', fromCode: 'JFK', to: 'Dubai', toCode: 'DXB', departTime: '11:00', arriveTime: '08:15', duration: 780, stops: 0, price: 689, class: 'Economy', seatsLeft: 6, date: '2026-08-14', baggage: '30kg' },
  { id: 'f5', airline: 'TK', flightNo: 'TK 12', from: 'New York', fromCode: 'JFK', to: 'Istanbul', toCode: 'IST', departTime: '22:30', arriveTime: '15:05', duration: 605, stops: 0, price: 455, class: 'Economy', seatsLeft: 18, date: '2026-08-14', baggage: '25kg' },
  { id: 'f6', airline: 'SQ', flightNo: 'SQ 25', from: 'London', fromCode: 'LHR', to: 'Tokyo', toCode: 'NRT', departTime: '21:15', arriveTime: '18:40', duration: 825, stops: 0, price: 742, class: 'Economy', seatsLeft: 9, date: '2026-08-14', baggage: '30kg' },
  { id: 'f7', airline: 'LH', flightNo: 'LH 716', from: 'London', fromCode: 'LHR', to: 'Tokyo', toCode: 'NRT', departTime: '13:40', arriveTime: '14:55', duration: 855, stops: 1, price: 618, class: 'Economy', seatsLeft: 15, date: '2026-08-14', baggage: '23kg' },
  { id: 'f8', airline: 'ET', flightNo: 'ET 41', from: 'London', fromCode: 'LHR', to: 'Bali', toCode: 'DPS', departTime: '10:05', arriveTime: '23:50', duration: 1115, stops: 1, price: 799, class: 'Economy', seatsLeft: 11, date: '2026-08-14', baggage: '30kg' },
  { id: 'f9', airline: 'AA', flightNo: 'AA 118', from: 'London', fromCode: 'LHR', to: 'New York', toCode: 'JFK', departTime: '09:30', arriveTime: '12:45', duration: 495, stops: 0, price: 430, class: 'Economy', seatsLeft: 20, date: '2026-08-14', baggage: '23kg' },
  { id: 'f10', airline: 'DL', flightNo: 'DL 462', from: 'Los Angeles', fromCode: 'LAX', to: 'Sydney', toCode: 'SYD', departTime: '21:55', arriveTime: '06:10', duration: 910, stops: 0, price: 890, class: 'Economy', seatsLeft: 7, date: '2026-08-14', baggage: '30kg' },
  { id: 'f11', airline: 'QR', flightNo: 'QR 920', from: 'New York', fromCode: 'JFK', to: 'Rome', toCode: 'FCO', departTime: '18:10', arriveTime: '09:00', duration: 530, stops: 0, price: 555, class: 'Economy', seatsLeft: 12, date: '2026-08-14', baggage: '23kg' },
  { id: 'f12', airline: 'EK', flightNo: 'EK 130', from: 'Rome', fromCode: 'FCO', to: 'Malé', toCode: 'MLE', departTime: '15:20', arriveTime: '00:10', duration: 550, stops: 0, price: 610, class: 'Economy', seatsLeft: 5, date: '2026-08-14', baggage: '30kg' },
  { id: 'f13', airline: 'BA', flightNo: 'BA 320', from: 'London', fromCode: 'LHR', to: 'Santorini', toCode: 'JTR', departTime: '08:40', arriveTime: '14:25', duration: 225, stops: 0, price: 189, class: 'Economy', seatsLeft: 25, date: '2026-08-14', baggage: '23kg' },
  { id: 'f14', airline: 'AF', flightNo: 'AF 1184', from: 'Paris', fromCode: 'CDG', to: 'Santorini', toCode: 'JTR', departTime: '11:55', arriveTime: '16:05', duration: 190, stops: 0, price: 145, class: 'Economy', seatsLeft: 30, date: '2026-08-14', baggage: '23kg' },
]

export const getFlight = (id) => flights.find((f) => f.id === id)
export const getAirline = (code) => airlines.find((a) => a.code === code)
export const getAirport = (code) => airports.find((a) => a.code === code)
export const findAirport = (query) =>
  airports.filter(
    (a) =>
      a.city.toLowerCase().includes(query.toLowerCase()) ||
      a.code.toLowerCase().includes(query.toLowerCase()) ||
      a.country.toLowerCase().includes(query.toLowerCase())
  )

export const flightImage = (code) => {
  const map = { QR: IMG.plane2, EK: IMG.plane2, TK: IMG.plane2, BA: IMG.plane, AF: IMG.plane, LH: IMG.plane, SQ: IMG.plane, ET: IMG.plane, AA: IMG.plane, DL: IMG.plane }
  return map[code] || IMG.plane
}
