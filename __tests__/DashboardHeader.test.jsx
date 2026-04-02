import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardHeader from '@/components/DashboardHeader';

const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DashboardHeader', () => {
  it('renders the brand name', () => {
    render(<DashboardHeader />);
    expect(screen.getByText(/wanderlust travel/i)).toBeInTheDocument();
  });

  it('renders the sign out button', () => {
    render(<DashboardHeader />);
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('shows a greeting with the user name when provided', () => {
    render(<DashboardHeader userName="Alex Johnson" />);
    expect(screen.getByText(/alex johnson/i)).toBeInTheDocument();
  });

  it('does not show a greeting when userName is not provided', () => {
    render(<DashboardHeader />);
    expect(screen.queryByLabelText(/logged in as/i)).not.toBeInTheDocument();
  });

  it('calls logout API and redirects to /login when signing out', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });

    render(<DashboardHeader userName="Alex" />);
    await user.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
