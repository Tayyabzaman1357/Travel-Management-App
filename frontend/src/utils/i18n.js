// Lightweight translation dictionary used by the language switcher.
// Keys are lowercase English tokens; fallback is the key itself.

export const translations = {
  en: {
    home: 'Home', flights: 'Flights', hotels: 'Hotels', destinations: 'Destinations', tours: 'Tours',
    cars: 'Car Rentals', cruises: 'Cruises', more: 'More', bookNow: 'Book Now', explore: 'Explore',
    search: 'Search', signIn: 'Sign In', signUp: 'Sign Up', logout: 'Logout', deals: 'Deals & Offers',
    blog: 'Blog', about: 'About Us', contact: 'Contact', faq: 'FAQ', wishlist: 'Wishlist',
    dashboard: 'Dashboard', admin: 'Admin', login: 'Login', email: 'Email', password: 'Password',
    from: 'From', to: 'To', departure: 'Departure', return: 'Return', guests: 'Guests',
    trending: 'Trending Now', popular: 'Most Popular', viewAll: 'View All', loading: 'Loading…',
    travelMore: 'Travel more, worry less', language: 'Language', currency: 'Currency',
    subscribeText: 'Subscribe for exclusive deals, flight alerts and travel inspiration — straight to your inbox.',
    enterEmail: 'Enter your email', subscribe: 'Subscribe',
  },
  es: {
    home: 'Inicio', flights: 'Vuelos', hotels: 'Hoteles', destinations: 'Destinos', tours: 'Tours',
    cars: 'Alquiler de Autos', cruises: 'Cruceros', more: 'Más', bookNow: 'Reservar', explore: 'Explorar',
    search: 'Buscar', signIn: 'Iniciar Sesión', signUp: 'Registrarse', logout: 'Cerrar Sesión',
    deals: 'Ofertas', blog: 'Blog', about: 'Nosotros', contact: 'Contacto', faq: 'FAQ',
    wishlist: 'Favoritos', dashboard: 'Panel', admin: 'Admin', login: 'Iniciar Sesión',
    email: 'Correo', password: 'Contraseña', from: 'Desde', to: 'Hacia', departure: 'Salida',
    return: 'Regreso', guests: 'Huéspedes', trending: 'Tendencias', popular: 'Más Popular',
    viewAll: 'Ver Todo', loading: 'Cargando…', travelMore: 'Viaja más, preocúpate menos',
    language: 'Idioma', currency: 'Moneda',
    subscribeText: 'Suscríbete para recibir ofertas exclusivas, alertas de vuelos e inspiración para viajar — directo a tu bandeja de entrada.',
    enterEmail: 'Introduce tu correo', subscribe: 'Suscribirse',
  },
  fr: {
    home: 'Accueil', flights: 'Vols', hotels: 'Hôtels', destinations: 'Destinations', tours: 'Circuits',
    cars: 'Location de Voitures', cruises: 'Croisières', more: 'Plus', bookNow: 'Réserver',
    explore: 'Explorer', search: 'Rechercher', signIn: 'Connexion', signUp: "S'inscrire",
    logout: 'Déconnexion', deals: 'Offres', blog: 'Blog', about: 'À Propos', contact: 'Contact',
    faq: 'FAQ', wishlist: 'Favoris', dashboard: 'Tableau de bord', admin: 'Admin', login: 'Connexion',
    email: 'E-mail', password: 'Mot de passe', from: 'De', to: 'Vers', departure: 'Départ',
    return: 'Retour', guests: 'Voyageurs', trending: 'Tendances', popular: 'Populaire',
    viewAll: 'Voir Tout', loading: 'Chargement…', travelMore: 'Voyagez plus, inquiétez-vous moins',
    language: 'Langue', currency: 'Devise',
    subscribeText: 'Inscrivez-vous pour recevoir des offres exclusives, des alertes de vols et de l\'inspiration voyage — directement dans votre boîte mail.',
    enterEmail: 'Entrez votre e-mail', subscribe: 'S\'abonner',
  },
  ur: {
    home: 'ہوم', flights: 'پروازیں', hotels: 'ہوٹل', destinations: 'مقامات', tours: 'ٹورز',
    cars: 'کار کرایہ', cruises: 'کروز', more: 'مزید', bookNow: 'ابھی بک کریں', explore: 'دریافت',
    search: 'تلاش', signIn: 'سائن ان', signUp: 'سائن اپ', logout: 'لاگ آؤٹ', deals: 'ڈیلز',
    blog: 'بلاگ', about: 'ہمارے بارے میں', contact: 'رابطہ', faq: 'سوالات', wishlist: 'پسندیدہ',
    dashboard: 'ڈیش بورڈ', admin: 'ایڈمن', login: 'لاگ ان', email: 'ای میل', password: 'پاس ورڈ',
    from: 'سے', to: 'تک', departure: 'روانگی', return: 'واپسی', guests: 'مہمان',
    trending: 'مقبول', popular: 'سب سے مشہور', viewAll: 'سب دیکھیں', loading: 'لوڈ ہو رہا ہے…',
    travelMore: 'زیادہ سفر، کم پریشانی', language: 'زبان', currency: 'کرنسی',
    subscribeText: 'خصوصی پیشکشوں، فلائٹ الرٹس اور سفری آئیڈیاز کے لیے سبسکرائب کریں — براہ راست آپ کے ان باکس میں۔',
    enterEmail: 'اپنا ای میل درج کریں', subscribe: 'سبسکرائب کریں',
  },
}

export const translate = (key, lang) => {
  const dict = translations[lang] || translations.en
  return dict[key] || translations.en[key] || key
}
