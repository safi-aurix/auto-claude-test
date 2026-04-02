import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import DashboardHeader from '@/components/DashboardHeader';

const destinations = [
  {
    id: 1,
    name: 'Santorini, Greece',
    emoji: '🏛️',
    description: 'Iconic white-washed villages, volcanic beaches, and breathtaking sunsets.',
    price: '$1,299',
    duration: '7 nights',
  },
  {
    id: 2,
    name: 'Kyoto, Japan',
    emoji: '⛩️',
    description: 'Ancient temples, cherry blossoms, and traditional Japanese culture await.',
    price: '$1,599',
    duration: '10 nights',
  },
  {
    id: 3,
    name: 'Machu Picchu, Peru',
    emoji: '🏔️',
    description: 'Explore the mystical Inca citadel set high in the Andes Mountains.',
    price: '$1,899',
    duration: '8 nights',
  },
  {
    id: 4,
    name: 'Safari, Kenya',
    emoji: '🦁',
    description: 'Witness the Great Migration and discover Africa\'s magnificent wildlife.',
    price: '$2,499',
    duration: '9 nights',
  },
  {
    id: 5,
    name: 'Amalfi Coast, Italy',
    emoji: '🌊',
    description: 'Dramatic cliffside villages, crystal waters, and world-class cuisine.',
    price: '$1,199',
    duration: '6 nights',
  },
  {
    id: 6,
    name: 'Bali, Indonesia',
    emoji: '🌴',
    description: 'Lush rice terraces, vibrant temples, and serene tropical paradise.',
    price: '$999',
    duration: '8 nights',
  },
];

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f9ff',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 32px',
  },
  welcome: {
    marginBottom: '32px',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0077b6',
    marginBottom: '8px',
  },
  welcomeSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
  },
  ctaBar: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '40px',
  },
  bookRoomBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#0077b6',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0, 119, 182, 0.3)',
  },
  myBookingsBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#fff',
    color: '#0077b6',
    textDecoration: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    border: '2px solid #0077b6',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #e5e7eb',
  },
  cardEmoji: {
    fontSize: '40px',
    marginBottom: '16px',
    display: 'block',
  },
  cardName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6',
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0077b6',
  },
  duration: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  bookBtn: {
    backgroundColor: '#f4a261',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export const metadata = {
  title: 'Dashboard – Wanderlust Travel',
};

export default function DashboardPage() {
  const session = getSession();
  if (!session) {
    redirect('/login');
  }

  return (
    <div style={styles.page}>
      <DashboardHeader userName={session.name} />

      <main style={styles.main}>
        <section style={styles.welcome} aria-labelledby="welcome-heading">
          <h1 id="welcome-heading" style={styles.welcomeTitle}>
            Welcome back,
            {' '}
            {session.name}
            !
          </h1>
          <p style={styles.welcomeSubtitle}>
            {session.role}
            {' '}
            · Ready to plan your next great adventure?
          </p>
        </section>

        <div style={styles.ctaBar}>
          <Link href="/bookings" style={styles.bookRoomBtn} aria-label="Book a room or hotel">
            🏨 Book a Room
          </Link>
          <Link href="/bookings" style={styles.myBookingsBtn} aria-label="View my bookings">
            📋 My Bookings
          </Link>
        </div>

        <section aria-labelledby="destinations-heading">
          <h2 id="destinations-heading" style={styles.sectionTitle}>
            Featured Destinations
          </h2>
          <ul style={styles.grid} role="list">
            {destinations.map((dest) => (
              <li key={dest.id} style={styles.card}>
                <span style={styles.cardEmoji} aria-hidden="true">{dest.emoji}</span>
                <h3 style={styles.cardName}>{dest.name}</h3>
                <p style={styles.cardDesc}>{dest.description}</p>
                <div style={styles.cardFooter}>
                  <div>
                    <div style={styles.price}>{dest.price}</div>
                    <div style={styles.duration}>{dest.duration}</div>
                  </div>
                  <button type="button" style={styles.bookBtn}>
                    Book Now
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
