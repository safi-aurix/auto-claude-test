'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '12px 14px',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    backgroundColor: '#fff',
    width: '100%',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '2px',
  },
  errorBanner: {
    padding: '12px 14px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '14px',
  },
  button: {
    marginTop: '8px',
    padding: '13px',
    backgroundColor: '#0077b6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    transition: 'background-color 0.2s, transform 0.1s',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  hint: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#9ca3af',
    marginTop: '8px',
  },
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Login failed. Please try again.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setServerError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Login form" style={styles.container}>
      {serverError && (
        <div role="alert" style={styles.errorBanner}>
          {serverError}
        </div>
      )}

      <div style={styles.field}>
        <label htmlFor="email" style={styles.label}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
        />
        {errors.email && (
          <span id="email-error" role="alert" style={styles.errorText}>
            {errors.email}
          </span>
        )}
      </div>

      <div style={styles.field}>
        <label htmlFor="password" style={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
        />
        {errors.password && (
          <span id="password-error" role="alert" style={styles.errorText}>
            {errors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p style={styles.hint}>Demo: demo@travel.com / password123</p>
    </form>
  );
}
