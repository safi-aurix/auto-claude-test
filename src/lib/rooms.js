// Demo room inventory for the travel agency app
// In production, this would connect to a real database
const ROOMS = [
  {
    id: 1,
    hotelName: 'Aegean Pearl Resort',
    location: 'Santorini, Greece',
    type: 'Standard',
    emoji: '🏛️',
    description: 'Comfortable room with a partial sea view and traditional Cycladic décor.',
    pricePerNight: 180,
    maxGuests: 2,
    amenities: ['Wi-Fi', 'Air conditioning', 'Breakfast included'],
  },
  {
    id: 2,
    hotelName: 'Aegean Pearl Resort',
    location: 'Santorini, Greece',
    type: 'Suite',
    emoji: '🏛️',
    description: 'Luxury cave suite with private infinity pool and panoramic caldera views.',
    pricePerNight: 420,
    maxGuests: 2,
    amenities: ['Wi-Fi', 'Private pool', 'Butler service', 'Breakfast included'],
  },
  {
    id: 3,
    hotelName: 'Kyoto Garden Inn',
    location: 'Kyoto, Japan',
    type: 'Standard',
    emoji: '⛩️',
    description: 'Traditional tatami room with garden view and futon bedding.',
    pricePerNight: 150,
    maxGuests: 2,
    amenities: ['Wi-Fi', 'Yukata robes', 'Tea ceremony access'],
  },
  {
    id: 4,
    hotelName: 'Kyoto Garden Inn',
    location: 'Kyoto, Japan',
    type: 'Deluxe',
    emoji: '⛩️',
    description: 'Spacious Japanese-style suite overlooking a private zen garden.',
    pricePerNight: 280,
    maxGuests: 4,
    amenities: ['Wi-Fi', 'Private garden', 'Yukata robes', 'Breakfast included'],
  },
  {
    id: 5,
    hotelName: 'Andean Heights Lodge',
    location: 'Cusco, Peru',
    type: 'Deluxe',
    emoji: '🏔️',
    description: 'Cozy lodge room with mountain views and altitude-acclimatisation support.',
    pricePerNight: 200,
    maxGuests: 3,
    amenities: ['Wi-Fi', 'Oxygen therapy', 'Guided trek included', 'Breakfast included'],
  },
  {
    id: 6,
    hotelName: 'Savanna Star Camp',
    location: 'Maasai Mara, Kenya',
    type: 'Suite',
    emoji: '🦁',
    description: 'Luxury tented suite with open-air shower and direct savanna views.',
    pricePerNight: 650,
    maxGuests: 2,
    amenities: ['Wi-Fi', 'Game drives included', 'All meals included', 'Spa access'],
  },
  {
    id: 7,
    hotelName: 'Amalfi Cliffside Boutique',
    location: 'Amalfi Coast, Italy',
    type: 'Standard',
    emoji: '🌊',
    description: 'Bright room with terrace overlooking the Tyrrhenian Sea.',
    pricePerNight: 160,
    maxGuests: 2,
    amenities: ['Wi-Fi', 'Sea-view terrace', 'Breakfast included'],
  },
  {
    id: 8,
    hotelName: 'Bali Treetop Villas',
    location: 'Ubud, Bali',
    type: 'Suite',
    emoji: '🌴',
    description: 'Private villa with plunge pool surrounded by tropical rice terraces.',
    pricePerNight: 320,
    maxGuests: 4,
    amenities: ['Wi-Fi', 'Private pool', 'Yoga classes', 'Breakfast included'],
  },
];

/**
 * Returns all available rooms.
 * @returns {Array}
 */
function getAllRooms() {
  return ROOMS;
}

/**
 * Finds a room by its ID.
 * @param {number} id
 * @returns {object|null}
 */
function getRoomById(id) {
  return ROOMS.find((r) => r.id === id) || null;
}

module.exports = { getAllRooms, getRoomById };
