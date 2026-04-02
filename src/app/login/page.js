import LoginForm from '@/components/LoginForm';

const pageStyles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)',
    padding: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    fontSize: '48px',
    marginBottom: '12px',
    display: 'block',
  },
  brandName: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#0077b6',
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '4px',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '24px',
    textAlign: 'center',
  },
};

export const metadata = {
  title: 'Sign In – Wanderlust Travel',
};

export default function LoginPage() {
  return (
    <main style={pageStyles.wrapper}>
      <div style={pageStyles.card}>
        <div style={pageStyles.logoArea}>
          <span style={pageStyles.logoIcon} aria-hidden="true">✈️</span>
          <div style={pageStyles.brandName}>Wanderlust Travel</div>
          <div style={pageStyles.tagline}>Explore the world with confidence</div>
        </div>

        <h1 style={pageStyles.heading}>Welcome back</h1>

        <LoginForm />
      </div>
    </main>
  );
}
