import { IMG } from './images'

export const visaCountries = [
  { id: 'v1', name: 'United Kingdom', code: 'UK', flag: '🇬🇧', image: IMG.london, visaType: 'Standard Visitor Visa', processingTime: '15 Business Days', fee: 115, validity: '6 Months', requirements: ['Valid passport (6+ months)', 'Bank statements (last 6 months)', 'Employment/income proof', 'Travel itinerary', 'Accommodation booking', 'Biometric appointment'], description: 'Visit the UK for tourism, business or study visits up to 6 months with the Standard Visitor Visa.' },
  { id: 'v2', name: 'United States', code: 'US', flag: '🇺🇸', image: IMG.newyork, visaType: 'B1/B2 Visitor Visa', processingTime: '30–45 Days', fee: 185, validity: '10 Years', requirements: ['Valid passport', 'DS-160 confirmation', 'Visa interview', 'Financial documents', 'Travel history', 'Photographs'], description: 'The B1/B2 visa covers business and tourism stays in the United States for up to 6 months per entry.' },
  { id: 'v3', name: 'Schengen Area', code: 'EU', flag: '🇪🇺', image: IMG.rome, visaType: 'Schengen Visa (Type C)', processingTime: '15 Business Days', fee: 90, validity: '90 Days', requirements: ['Valid passport', 'Travel insurance €30k+', 'Flight reservations', 'Accommodation proof', 'Bank statements', 'Cover letter'], description: 'One visa for 27 European countries — perfect for multi-country tours across France, Italy, Spain and beyond.' },
  { id: 'v4', name: 'Japan', code: 'JP', flag: '🇯🇵', image: IMG.tokyo, visaType: 'Tourist Visa', processingTime: '5–7 Business Days', fee: 30, validity: '90 Days', requirements: ['Valid passport', 'Application form', 'Invitation/hotel booking', 'Financial proof', 'Itinerary'], description: 'Japan welcomes tourists with a straightforward short-stay visa — often processed in under a week.' },
  { id: 'v5', name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', image: IMG.dubai, visaType: 'Tourist Visa (30 Days)', processingTime: '3–5 Business Days', fee: 85, validity: '30 Days', requirements: ['Valid passport (6+ months)', 'Passport photo', 'Confirmed return ticket', 'Hotel booking', 'Insurance'], description: 'Dubai’s 30-day tourist visa is issued on arrival for many nationalities and processed online in days.' },
  { id: 'v6', name: 'Australia', code: 'AU', flag: '🇦🇺', image: IMG.sydney, visaType: 'Visitor Visa (Subclass 600)', processingTime: '20–30 Days', fee: 190, validity: '12 Months', requirements: ['Valid passport', 'Financial capacity', 'Employment evidence', 'Health requirements', 'Genuine visitor statement'], description: 'The Visitor Visa 600 covers tourism and visiting family — multiple entries valid up to 12 months.' },
  { id: 'v7', name: 'Canada', code: 'CA', flag: '🇨🇦', image: IMG.waterfall, visaType: 'Visitor Visa (TRV)', processingTime: '25–35 Days', fee: 100, validity: 'Up to 10 Years', requirements: ['Valid passport', 'Financial documents', 'Purpose of visit letter', 'Family ties evidence', 'Biometrics'], description: 'Canada’s Temporary Resident Visa grants visits of up to 6 months, often issued for multiple entries.' },
  { id: 'v8', name: 'Turkey', code: 'TR', flag: '🇹🇷', image: IMG.istanbul, visaType: 'e-Visa', processingTime: '1–2 Days', fee: 45, validity: '90 Days', requirements: ['Valid passport', 'Online application', 'Payment (card)', 'Return ticket'], description: 'Turkey’s lightning-fast e-visa is issued online in under 48 hours for most nationalities.' },
]

export const visaProcessSteps = [
  { step: '01', title: 'Choose Your Visa', text: 'Select your destination country and visa type from our guided checklist. We tell you exactly what you need.' },
  { step: '02', title: 'Upload Documents', text: 'Upload scanned copies securely. Our AI checks for completeness and flags missing documents instantly.' },
  { step: '03', title: 'Expert Review', text: 'A licensed visa expert reviews your application, prepares the cover letter and corrects any errors.' },
  { step: '04', title: 'Submit & Track', text: 'We submit on your behalf and track the status in real time — with email alerts at every milestone.' },
]

export const visaFaqs = [
  { q: 'How early should I apply for a visa?', a: 'We recommend applying 4–6 weeks before departure. Some countries like the USA require interviews that need extra lead time.' },
  { q: 'Do you guarantee visa approval?', a: 'No reputable agency can guarantee approval — decisions rest with embassies. We guarantee a flawless application that maximises your chances.' },
  { q: 'Can I get a refund if my visa is rejected?', a: 'Embassy fees are non-refundable, but our service fee is fully refunded if your application is rejected due to an error on our side.' },
  { q: 'Is my passport kept during processing?', a: 'Yes, for most countries. We arrange secure courier pickup and delivery so you never lose sight of your documents.' },
]
