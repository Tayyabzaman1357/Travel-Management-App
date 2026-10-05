// Central image library. All images come from Unsplash (free to use).
// The <Img /> component falls back to a deterministic placeholder if any URL fails.

export const imgUrl = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const fallbackImg = (seed) => `https://picsum.photos/seed/${seed}/800/600`

export const AVATARS = (n) => `https://i.pravatar.cc/150?img=${n}`

export const IMG = {
  // Cities / landmarks
  eiffel: 'photo-1502602898657-3e91760cbb34',
  eiffelNight: 'photo-1543349689-9a4d426bee8e',
  louvre: 'photo-1565967511849-76a60a516170',
  parisStreet: 'photo-1499856871958-5b9627545d1a',
  tokyo: 'photo-1540959733332-eab4deabeeaf',
  tokyoTower: 'photo-1513407030348-c983a97b98d8',
  kyoto: 'photo-1493976040374-85c8e12f0c0e',
  kyotoTemple: 'photo-1492571350019-22de08371fd3',
  newyork: 'photo-1496442226666-8d4d0e62e6e9',
  nycStreet: 'photo-1485871981521-5b1fd3805eee',
  statueLiberty: 'photo-1503788311183-f8f5c73301cd',
  london: 'photo-1513635269975-59663e0ac1ad',
  westminster: 'photo-1529655683826-aba9b3e77383',
  santorini: 'photo-1613395877344-13d4a8e0d49e',
  santoriniSunset: 'photo-1570077188670-e3a8d69ac5ff',
  oia: 'photo-1533105079780-92b9be482077',
  bali: 'photo-1537996194471-e657df975ab4',
  baliTemple: 'photo-1555400038-63f5ba517a47',
  dubai: 'photo-1512453979798-5ea266f8880c',
  rome: 'photo-1552832230-c0197dd311b5',
  colosseum: 'photo-1555993539-1732b0258235',
  venice: 'photo-1514890547357-a9ee288728e0',
  amsterdam: 'photo-1534351590666-13e3e96b5017',
  singapore: 'photo-1525625293386-3f8f99389edd',
  hongkong: 'photo-1536599018102-9f803c140fc1',
  istanbul: 'photo-1541432901042-2d8bd64b4a9b',
  bangkok: 'photo-1508009603885-50cf7c579365',
  sydney: 'photo-1506973035872-a4ec16b8e8d9',
  machupicchu: 'photo-1526392060635-9d6019884377',
  pyramids: 'photo-1503177119275-0aa32b3a9368',
  tajmahal: 'photo-1564507592333-c60657eea523',
  greatwall: 'photo-1508804185872-d7badad00f7d',
  grandcanyon: 'photo-1474044159687-1ee9f3a51722',
  niagara: 'photo-1605721911519-3dfeb3be25e7',
  chicago: 'photo-1477959858617-67f85cf4f1df',
  citynight: 'photo-1519501025264-65ba15a82390',

  // Nature / landscapes
  maldives: 'photo-1514282401047-d79a71a590e8',
  maldivesOverwater: 'photo-1573843981267-be1999ff37cd',
  beach: 'photo-1507525428034-b723cf961d3e',
  beachSunset: 'photo-1506929562872-bb421503ef21',
  alps: 'photo-1531218150217-54595bc083df',
  mountain: 'photo-1464822759023-fed622ff2c3b',
  mountainSunset: 'photo-1506905925346-21bda4d32df4',
  forest: 'photo-1441974231531-c6227db76b6e',
  waterfall: 'photo-1432405972618-c60b0225b8f9',
  desert: 'photo-1509316785289-025f5b846b35',
  lake: 'photo-1506744038136-46273834b3fb',
  aurora: 'photo-1483347756197-71ef80e95f73',
  stars: 'photo-1419242902214-272b3f66ee7a',
  camping: 'photo-1504280390367-361c6d9f38f4',
  hotair: 'photo-1503614472-8c93d56e92ce',

  // Hotels / interiors
  hotelRoom: 'photo-1566073771259-6a8506099945',
  hotelResort: 'photo-1571896349842-33c89424de2d',
  hotelPool: 'photo-1582719478250-c89cae4dc85b',
  hotelLuxe: 'photo-1542314831-068cd1dbfeeb',
  hotelBuilding: 'photo-1564501049412-61c2a3083791',
  roomSuite: 'photo-1590490360182-c33d57733427',
  roomBath: 'photo-1584622650111-993a426fbf0a',
  spa: 'photo-1544161515-4ab6ce6db874',
  gym: 'photo-1534438327276-14e5300c3a48',
  restaurant: 'photo-1517248135467-4c7edcad34c4',
  dinner: 'photo-1414235077428-338989a2e8c0',
  cocktail: 'photo-1551024709-8f23befc6f87',

  // Transport
  plane: 'photo-1436491865332-7a61a109cc05',
  plane2: 'photo-1569154941061-e231b4725ef1',
  train: 'photo-1474487548417-781cb71495f3',
  car1: 'photo-1502877338535-766e1452684a',
  car2: 'photo-1541899481282-d53bffe3c35d',
  car3: 'photo-1494976388531-d1058494cdd8',
  car4: 'photo-1553440569-bcc63803a83d',
  tesla: 'photo-1560958089-b8a1929cea89',
  jeep: 'photo-1533473359331-0135ef1b58bf',
  cruise: 'photo-1548574505-5e239809ee19',
  cruise2: 'photo-1581962556995-1e6c4c6f1c31',
  yacht: 'photo-1544551763-46a013bb70d5',

  // Misc
  food: 'photo-1504674900247-0877df9cc836',
  pizza: 'photo-1565299624946-b28f40a0ae38',
  coffee: 'photo-1504639725590-34d0984388bd',
  team: 'photo-1522071820081-009f0129c71c',
  team2: 'photo-1531482615713-2afd69097998',
  passport: 'photo-1554224155-6726b3ff858f',
  travelFlatlay: 'photo-1488646953014-85cb44e25828',
  suitcase: 'photo-1565026057447-bc90a3dceb87',
}
