'use client';

import { useState, useEffect } from 'react';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0077b6',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    lineHeight: 1,
    padding: '4px',
  },
  formGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f9fafb',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f9fafb',
    appearance: 'auto',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#f9fafb',
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  costBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '10px',
    padding: '14px 18px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: '14px',
    color: '#0369a1',
    fontWeight: '500',
  },
  costValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0077b6',
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '16px',
  },
  success: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '14px 18px',
    color: '#15803d',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#f4a261',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitBtnDisabled: {
    width: '100%',
    backgroundColor: '#d1d5db',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  roomInfo: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '14px 18px',
    marginBottom: '18px',
    fontSize: '13px',
    color: '#4b5563',
  },
  roomInfoName: {
    fontWeight: '700',
    color: '#111827',
    fontSize: '15px',
    marginBottom: '4px',
  },
};

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  const nights = Math.round(diff / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

export default function BookingModal({ onClose }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [needs, setNeeds] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data.rooms || []));
  }, []);

  const selectedRoom = rooms.find((r) => r.id === Number(selectedRoomId));
  const nights = calcNights(checkIn, checkOut);
  const totalCost = selectedRoom ? nights * selectedRoom.pricePerNight : 0;

  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!selectedRoomId) { setError('Please select a room.'); return; }
    if (!checkIn) { setError('Check-in date is required.'); return; }
    if (!checkOut) { setError('Check-out date is required.'); return; }
    if (nights < 1) { setError('Check-out must be after check-in.'); return; }
    if (!guests || guests < 1) { setError('At least 1 guest is required.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: Number(selectedRoomId),
          checkIn,
          checkOut,
          guests: Number(guests),
          needs,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Booking failed. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 id="booking-modal-title" style={styles.title}>Book a Room</h2>
          <button
            type="button"
            style={styles.closeBtn}
            onClick={onClose}
            aria-label="Close booking form"
          >
            ×
          </button>
        </div>

        {success ? (
          <div>
            <div style={styles.success}>
              <strong>Booking confirmed!</strong>
              <br />
              Your room has been reserved. Check &quot;My Bookings&quot; for details.
            </div>
            <button type="button" style={styles.submitBtn} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.formGroup}>
              <label htmlFor="room-select" style={styles.label}>
                Select Room / Hotel
              </label>
              <select
                id="room-select"
                style={styles.select}
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
              >
                <option value="">-- Choose a room --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.emoji}
                    {' '}
                    {room.hotelName}
                    {' '}
                    –
                    {' '}
                    {room.type}
                    {' '}
                    (
                    {room.location}
                    ) · $
                    {room.pricePerNight}
                    /night
                  </option>
                ))}
              </select>
            </div>

            {selectedRoom && (
              <div style={styles.roomInfo}>
                <div style={styles.roomInfoName}>
                  {selectedRoom.emoji}
                  {' '}
                  {selectedRoom.hotelName}
                  {' '}
                  –
                  {' '}
                  {selectedRoom.type}
                </div>
                <div>{selectedRoom.description}</div>
                <div style={{ marginTop: '6px' }}>
                  Max guests:
                  {' '}
                  {selectedRoom.maxGuests}
                  {' '}
                  · Amenities:
                  {' '}
                  {selectedRoom.amenities.join(', ')}
                </div>
              </div>
            )}

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label htmlFor="check-in" style={styles.label}>Check-in Date</label>
                <input
                  id="check-in"
                  type="date"
                  style={styles.input}
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="check-out" style={styles.label}>Check-out Date</label>
                <input
                  id="check-out"
                  type="date"
                  style={styles.input}
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="guests" style={styles.label}>Number of Guests</label>
              <input
                id="guests"
                type="number"
                style={styles.input}
                value={guests}
                min={1}
                max={selectedRoom ? selectedRoom.maxGuests : 10}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="needs" style={styles.label}>
                Special Needs / Requests
                {' '}
                <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
              </label>
              <textarea
                id="needs"
                style={styles.textarea}
                value={needs}
                placeholder="e.g. wheelchair access, early check-in, cot for infant…"
                onChange={(e) => setNeeds(e.target.value)}
              />
            </div>

            {totalCost > 0 && (
              <div style={styles.costBox} aria-live="polite">
                <span style={styles.costLabel}>
                  {nights}
                  {' '}
                  night
                  {nights !== 1 ? 's' : ''}
                  {' '}
                  × $
                  {selectedRoom.pricePerNight}
                </span>
                <span style={styles.costValue}>
                  Total: $
                  {totalCost.toLocaleString()}
                </span>
              </div>
            )}

            {error && <div style={styles.error} role="alert">{error}</div>}

            <button
              type="submit"
              style={loading ? styles.submitBtnDisabled : styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Booking…' : 'Confirm Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
