'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import styles from './page.module.css';

const STATS = [
  { icon: '🧳', value: 142, label: 'Active Bookings' },
  { icon: '✈️', value: 28, label: 'Departures This Month' },
  { icon: '👥', value: 96, label: 'Clients Served' },
  { icon: '💰', value: '$48.2k', label: 'Revenue (MTD)' },
];

const BOOKINGS = [
  {
    id: 'BK-1001',
    client: 'Sarah Johnson',
    destination: 'Paris, France',
    departure: '2026-04-10',
    status: 'Confirmed',
  },
  {
    id: 'BK-1002',
    client: 'Michael Lee',
    destination: 'Bali, Indonesia',
    departure: '2026-04-15',
    status: 'Pending',
  },
  {
    id: 'BK-1003',
    client: 'Emma Wilson',
    destination: 'Santorini, Greece',
    departure: '2026-04-22',
    status: 'Confirmed',
  },
  {
    id: 'BK-1004',
    client: 'James Martinez',
    destination: 'Tokyo, Japan',
    departure: '2026-05-01',
    status: 'Pending',
  },
  {
    id: 'BK-1005',
    client: 'Olivia Brown',
    destination: 'New York, USA',
    departure: '2026-04-08',
    status: 'Cancelled',
  },
];

const DESTINATIONS = [
  { name: 'Paris', country: 'France', emoji: '🗼', packages: 12 },
  { name: 'Bali', country: 'Indonesia', emoji: '🌴', packages: 8 },
  { name: 'Tokyo', country: 'Japan', emoji: '⛩️', packages: 10 },
  { name: 'Santorini', country: 'Greece', emoji: '🏛️', packages: 7 },
];

function statusBadgeClass(status) {
  const map = {
    Confirmed: styles.badgeConfirmed,
    Pending: styles.badgePending,
    Cancelled: styles.badgeCancelled,
  };
  return map[status] || '';
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <span className={styles.navBrandIcon} role="img" aria-label="plane">✈️</span>
          TravelCo
        </div>
        <div className={styles.navRight}>
          <span className={styles.navUser}>
            {user.name}
          </span>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeText}>
            <h2>
              Welcome back,
              {' '}
              {user.name}
              !
            </h2>
            <p>Here&apos;s your agency overview for today.</p>
          </div>
          <span className={styles.date}>{today}</span>
        </div>

        <div className={styles.statsGrid}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <span className={styles.statIcon} role="img" aria-hidden="true">
                {stat.icon}
              </span>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.tableCard}>
          <h3 className={styles.sectionTitle}>Recent Bookings</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client</th>
                <th>Destination</th>
                <th>Departure</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.client}</td>
                  <td>{booking.destination}</td>
                  <td>{booking.departure}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${statusBadgeClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className={styles.sectionTitle}>Popular Destinations</h3>
        <div className={styles.destinationsGrid}>
          {DESTINATIONS.map((dest) => (
            <div key={dest.name} className={styles.destinationCard}>
              <div className={styles.destinationEmoji}>
                <span role="img" aria-label={dest.name}>{dest.emoji}</span>
              </div>
              <div className={styles.destinationInfo}>
                <div className={styles.destinationName}>{dest.name}</div>
                <div className={styles.destinationMeta}>
                  {dest.country}
                  {' · '}
                  {dest.packages}
                  {' packages'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
