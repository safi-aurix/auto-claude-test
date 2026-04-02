'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import BookingModal from '@/components/BookingModal';

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f9ff' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '40px 32px' },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0077b6',
    marginBottom: '8px',
  },
  subheading: { fontSize: '15px', color: '#6b7280', marginBottom: '28px' },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  bookBtn: {
    backgroundColor: '#f4a261',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#9ca3af',
    fontSize: '16px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    border: '1px solid #e5e7eb',
    marginBottom: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  hotelName: { fontSize: '17px', fontWeight: '700', color: '#111827' },
  location: { fontSize: '13px', color: '#6b7280', marginTop: '2px' },
  badge: (status) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: status === 'confirmed' ? '#dcfce7' : '#f3f4f6',
    color: status === 'confirmed' ? '#15803d' : '#6b7280',
  }),
  infoRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '12px',
  },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  infoLabel: { fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase' },
  infoValue: { fontWeight: '500', color: '#111827' },
  totalCost: { fontSize: '18px', fontWeight: '700', color: '#0077b6' },
  needs: {
    fontSize: '13px',
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    padding: '8px 12px',
    marginBottom: '12px',
  },
  cancelBtn: {
    background: 'none',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    color: '#6b7280',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    const res = await fetch('/api/bookings');
    if (res.status === 401) { router.push('/login'); return; }
    const data = await res.json();
    setBookings(data.bookings || []);
  }

  useEffect(() => {
    async function init() {
      // Fetch session info from dashboard redirect — read name from DOM if available
      const res = await fetch('/api/bookings');
      if (res.status === 401) { router.push('/login'); return; }
      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleCancel(id) {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    fetchBookings();
  }

  function handleModalClose() {
    setShowModal(false);
    fetchBookings();
  }

  return (
    <div style={styles.page}>
      <DashboardHeader userName={userName} />

      <main style={styles.main}>
        <h1 style={styles.heading}>My Bookings</h1>
        <p style={styles.subheading}>View and manage your room reservations.</p>

        <div style={styles.toolbar}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {bookings.length}
            {' '}
            booking
            {bookings.length !== 1 ? 's' : ''}
          </span>
          <button type="button" style={styles.bookBtn} onClick={() => setShowModal(true)}>
            + Book a Room
          </button>
        </div>

        {!loading && bookings.length === 0 && (
          <div style={styles.emptyState}>
            No bookings yet. Click &quot;Book a Room&quot; to get started!
          </div>
        )}

        {bookings.map((b) => (
          <article key={b.id} style={styles.card} aria-label={`Booking at ${b.roomSnapshot.hotelName}`}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.hotelName}>
                  {b.roomSnapshot.hotelName}
                  {' '}
                  –
                  {' '}
                  {b.roomSnapshot.type}
                </div>
                <div style={styles.location}>{b.roomSnapshot.location}</div>
              </div>
              <span style={styles.badge(b.status)}>{b.status}</span>
            </div>

            <div style={styles.infoRow}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Check-in</span>
                <span style={styles.infoValue}>{b.checkIn}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Check-out</span>
                <span style={styles.infoValue}>{b.checkOut}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Guests</span>
                <span style={styles.infoValue}>{b.guests}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Total Cost</span>
                <span style={styles.totalCost}>
                  $
                  {b.totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            {b.needs && (
              <div style={styles.needs}>
                <strong>Special requests:</strong>
                {' '}
                {b.needs}
              </div>
            )}

            {b.status === 'confirmed' && (
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => handleCancel(b.id)}
              >
                Cancel Booking
              </button>
            )}
          </article>
        ))}
      </main>

      {showModal && <BookingModal onClose={handleModalClose} />}
    </div>
  );
}
