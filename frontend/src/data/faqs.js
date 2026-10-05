export const faqs = [
  {
    category: 'Bookings',
    items: [
      { q: 'How do I book a flight or hotel?', a: 'Use the search box on the home page, filter results to your liking, then click Book. You’ll confirm traveler details, choose a seat (for flights) and pay securely. Your booking is confirmed instantly.' },
      { q: 'Can I modify or cancel my booking?', a: 'Yes. Head to your Dashboard → Bookings and choose Modify or Cancel. Cancellation policies vary by provider — always check the policy shown at checkout.' },
      { q: 'How do I get my booking confirmation?', a: 'You’ll receive an email and an in-app notification immediately after payment. Your e-ticket is also available in your dashboard anytime.' },
      { q: 'Can I book for someone else?', a: 'Absolutely. Add traveler details at checkout — you can book trips for family, friends or corporate travel.' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { q: 'Which payment methods do you accept?', a: 'We accept all major credit/debit cards, PayPal, JazzCash and EasyPaisa. All payments are encrypted and PCI-DSS compliant.' },
      { q: 'Is it safe to pay on your website?', a: 'Yes. Payments are processed over 256-bit SSL encryption and we never store your full card details on our servers.' },
      { q: 'When will I be charged?', a: 'At the moment of booking. For some flexi-fare options you may pay a deposit now and the balance later — the option is always shown clearly.' },
      { q: 'Do you offer refunds?', a: 'Refunds follow each provider’s cancellation policy. Once processed, funds return to your original payment method within 5–10 business days.' },
    ],
  },
  {
    category: 'Flights',
    items: [
      { q: 'What is included in the flight price?', a: 'Fares include taxes, one carry-on and checked baggage as indicated on each flight card. Seat selection and meals may be added at checkout.' },
      { q: 'Can I choose my seat?', a: 'Yes — on the seat selection step of booking you can pick from available seats on a live aircraft map.' },
      { q: 'What is a stop vs a layover?', a: 'A stop means the flight lands and continues on the same aircraft. A layover (1+ stops) means changing planes — shown in the duration and stops info.' },
    ],
  },
  {
    category: 'Hotels',
    items: [
      { q: 'Are hotel photos real?', a: 'All photos are provided by the properties. We also show verified guest reviews and ratings to give you an honest picture.' },
      { q: 'Is breakfast included?', a: 'It varies by room type — look for the “Breakfast Included” amenity badge on each hotel card.' },
      { q: 'Can I check in early?', a: 'Early check-in depends on availability. Add a note in your booking and we’ll request it with the hotel.' },
    ],
  },
  {
    category: 'Visa & Insurance',
    items: [
      { q: 'Can you help with my visa?', a: 'Yes — visit the Visa Assistance page. We guide you through documents, review your application and track it to approval.' },
      { q: 'Is travel insurance mandatory?', a: 'Not mandatory, but strongly recommended — and required for Schengen visas. Compare plans on the Insurance page and add coverage at checkout.' },
    ],
  },
  {
    category: 'Account',
    items: [
      { q: 'How do I create an account?', a: 'Click “Sign Up” in the top navigation. You can register with email/password or one-click Google sign-in.' },
      { q: 'I forgot my password. What do I do?', a: 'Click “Forgot Password” on the login page — we’ll email you a secure reset link within minutes.' },
      { q: 'How is my data protected?', a: 'We use industry-standard encryption, and your personal data is never sold. Review our privacy policy for full details.' },
    ],
  },
]

export const allFaqs = faqs.flatMap((f) => f.items.map((i) => ({ ...i, category: f.category })))
