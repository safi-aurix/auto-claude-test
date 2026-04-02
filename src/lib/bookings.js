const { getRoomById } = require('./rooms');

// In-memory store — resets on server restart.
// In production, replace with a proper database.
let bookings = [];
let nextId = 1;

/**
 * Calculates the total cost for a booking.
 * @param {number} pricePerNight
 * @param {string} checkIn  – ISO date string (YYYY-MM-DD)
 * @param {string} checkOut – ISO date string (YYYY-MM-DD)
 * @returns {number}
 */
function calculateTotalCost(pricePerNight, checkIn, checkOut) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.round(
    (new Date(checkOut) - new Date(checkIn)) / msPerDay,
  );
  return nights * pricePerNight;
}

/**
 * Creates a new booking.
 * @param {{ userId: number, roomId: number, checkIn: string, checkOut: string, guests: number, needs: string }} data
 * @returns {{ ok: true, booking: object } | { ok: false, error: string }}
 */
function createBooking(data) {
  const {
    userId, roomId, checkIn, checkOut, guests, needs = '',
  } = data;

  const room = getRoomById(Number(roomId));
  if (!room) return { ok: false, error: 'Room not found.' };

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return { ok: false, error: 'Invalid dates.' };
  }
  if (checkOutDate <= checkInDate) {
    return { ok: false, error: 'Check-out must be after check-in.' };
  }
  if (!guests || guests < 1) {
    return { ok: false, error: 'At least 1 guest is required.' };
  }
  if (guests > room.maxGuests) {
    return { ok: false, error: `This room accommodates at most ${room.maxGuests} guests.` };
  }

  const totalCost = calculateTotalCost(room.pricePerNight, checkIn, checkOut);

  const booking = {
    id: nextId,
    userId,
    roomId: room.id,
    roomSnapshot: {
      hotelName: room.hotelName,
      location: room.location,
      type: room.type,
      pricePerNight: room.pricePerNight,
    },
    checkIn,
    checkOut,
    guests: Number(guests),
    needs,
    totalCost,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  nextId += 1;
  bookings.push(booking);
  return { ok: true, booking };
}

/**
 * Returns all bookings for a given user.
 * @param {number} userId
 * @returns {Array}
 */
function getBookingsByUser(userId) {
  return bookings.filter((b) => b.userId === userId);
}

/**
 * Cancels a booking by ID for a given user.
 * @param {number} id
 * @param {number} userId
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
function cancelBooking(id, userId) {
  const index = bookings.findIndex(
    (b) => b.id === Number(id) && b.userId === userId,
  );
  if (index === -1) return { ok: false, error: 'Booking not found.' };
  bookings[index] = { ...bookings[index], status: 'cancelled' };
  return { ok: true };
}

/**
 * Resets the store (used in tests only).
 */
function _resetStore() {
  bookings = [];
  nextId = 1;
}

module.exports = {
  createBooking,
  getBookingsByUser,
  cancelBooking,
  calculateTotalCost,
  _resetStore,
};
