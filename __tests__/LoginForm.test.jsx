import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/components/LoginForm';

// Mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LoginForm', () => {
  describe('rendering', () => {
    it('renders the email and password fields', () => {
      render(<LoginForm />);
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders the sign in button', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows demo credentials hint', () => {
      render(<LoginForm />);
      expect(screen.getByText(/demo@travel\.com/i)).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('shows an error when submitting with empty fields', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('shows an error for an invalid email format', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    });

    it('shows an error for a password that is too short', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
      await user.type(screen.getByLabelText(/password/i), 'abc');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  describe('submission', () => {
    it('calls the login API with email and password on valid submission', async () => {
      const user = userEvent.setup();
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, user: { name: 'Alex' } }),
      });

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/email address/i), 'demo@travel.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'demo@travel.com', password: 'password123' }),
        }));
      });
    });

    it('redirects to /dashboard after successful login', async () => {
      const user = userEvent.setup();
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, user: { name: 'Alex' } }),
      });

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/email address/i), 'demo@travel.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('shows a server error message on failed login', async () => {
      const user = userEvent.setup();
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid email or password.' }),
      });

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/email address/i), 'wrong@email.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    });

    it('shows a network error message when fetch throws', async () => {
      const user = userEvent.setup();
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/email address/i), 'demo@travel.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    });

    it('disables the submit button while loading', async () => {
      const user = userEvent.setup();
      // Keep fetch pending
      fetch.mockReturnValueOnce(new Promise(() => {}));

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/email address/i), 'demo@travel.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByRole('button', { name: /signing in/i })).toBeDisabled();
    });
  });
});
