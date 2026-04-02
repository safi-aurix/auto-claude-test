const {
  createBooking,
  getBookingsByUser,
  cancelBooking,
  calculateTotalCost,
  _resetStore,
} = require('@/lib/bookings');

beforeEach(() => {
  _resetStore();
});

describe('calculateTotalCost', () => {
  it('returns 0 for same-day dates', () => {
    expect(calculateTotalCost(100, '2026-05-01', '2026-05-01')).toBe(0);
  });

  it('calculates cost for a single night', () => {
    expect(calculateTotalCost(150, '2026-05-01', '2026-05-02')).toBe(150);
  });

  it('calculates cost for multiple nights', () => {
    expect(calculateTotalCost(200, '2026-06-01', '2026-06-05')).toBe(800);
  });
});

describe('createBooking', () => {
  const valid = {
    userId: 1,
    roomId: 1,
    checkIn: '2026-07-01',
    checkOut: '2026-07-05',
    guests: 2,
    needs: 'Late check-in',
  };

  it('creates a booking successfully with valid data', () => {
    const result = createBooking(valid);
    expect(result.ok).toBe(true);
    expect(result.booking).toMatchObject({
      userId: 1,
      roomId: 1,
      checkIn: '2026-07-01',
      checkOut: '2026-07-05',
      guests: 2,
      needs: 'Late check-in',
      status: 'confirmed',
      totalCost: 720, // 4 nights × $180
    });
    expect(result.booking.id).toBe(1);
    expect(result.booking.roomSnapshot).toMatchObject({
      hotelName: 'Aegean Pearl Resort',
      location: 'Santorini, Greece',
    });
  });

  it('assigns incrementing IDs to consecutive bookings', () => {
    const r1 = createBooking(valid);
    const r2 = createBooking({ ...valid, userId: 2 });
    expect(r1.booking.id).toBe(1);
    expect(r2.booking.id).toBe(2);
  });

  it('returns an error for a non-existent room', () => {
    const result = createBooking({ ...valid, roomId: 999 });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/room not found/i);
  });

  it('returns an error when check-out is before check-in', () => {
    const result = createBooking({ ...valid, checkIn: '2026-07-10', checkOut: '2026-07-05' });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/check-out must be after/i);
  });

  it('returns an error when check-in and check-out are the same', () => {
    const result = createBooking({ ...valid, checkIn: '2026-07-01', checkOut: '2026-07-01' });
    expect(result.ok).toBe(false);
  });

  it('returns an error for 0 guests', () => {
    const result = createBooking({ ...valid, guests: 0 });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/at least 1 guest/i);
  });

  it('returns an error when guests exceed room capacity', () => {
    // Room 1 (Aegean Pearl Standard) has maxGuests: 2
    const result = createBooking({ ...valid, guests: 5 });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/at most 2 guests/i);
  });

  it('defaults needs to empty string when not provided', () => {
    const { needs: _, ...noNeeds } = valid;
    const result = createBooking(noNeeds);
    expect(result.ok).toBe(true);
    expect(result.booking.needs).toBe('');
  });
});

describe('getBookingsByUser', () => {
  it('returns empty array when user has no bookings', () => {
    expect(getBookingsByUser(1)).toEqual([]);
  });

  it('returns only bookings belonging to the given user', () => {
    createBooking({
      userId: 1, roomId: 1, checkIn: '2026-07-01', checkOut: '2026-07-03', guests: 1,
    });
    createBooking({
      userId: 2, roomId: 2, checkIn: '2026-08-01', checkOut: '2026-08-04', guests: 1,
    });
    createBooking({
      userId: 1, roomId: 3, checkIn: '2026-09-01', checkOut: '2026-09-05', guests: 2,
    });

    const user1Bookings = getBookingsByUser(1);
    expect(user1Bookings).toHaveLength(2);
    expect(user1Bookings.every((b) => b.userId === 1)).toBe(true);
  });
});

describe('cancelBooking', () => {
  it('cancels a confirmed booking', () => {
    createBooking({
      userId: 1, roomId: 1, checkIn: '2026-07-01', checkOut: '2026-07-03', guests: 1,
    });
    const result = cancelBooking(1, 1);
    expect(result.ok).toBe(true);

    const bookings = getBookingsByUser(1);
    expect(bookings[0].status).toBe('cancelled');
  });

  it('returns an error for a non-existent booking', () => {
    const result = cancelBooking(999, 1);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/booking not found/i);
  });

  it('returns an error when the booking belongs to a different user', () => {
    createBooking({
      userId: 1, roomId: 1, checkIn: '2026-07-01', checkOut: '2026-07-03', guests: 1,
    });
    const result = cancelBooking(1, 2);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/booking not found/i);
  });
});
