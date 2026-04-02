'use client';

import { useRouter } from 'next/navigation';

const styles = {
  header: {
    backgroundColor: '#0077b6',
    color: '#fff',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0, 119, 182, 0.3)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  greeting: {
    fontSize: '14px',
    opacity: 0.9,
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '8px',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default function DashboardHeader({ userName }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <span aria-hidden="true">✈️</span>
        Wanderlust Travel
      </div>
      <nav style={styles.nav}>
        {userName && (
          <span style={styles.greeting} aria-label={`Logged in as ${userName}`}>
            Hello,
            {' '}
            <strong>{userName}</strong>
          </span>
        )}
        <button type="button" onClick={handleLogout} style={styles.logoutBtn}>
          Sign Out
        </button>
      </nav>
    </header>
  );
}
