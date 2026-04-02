import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingModal from '@/components/BookingModal';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

const MOCK_ROOMS = [
  {
    id: 1,
    hotelName: 'Aegean Pearl Resort',
    location: 'Santorini, Greece',
    type: 'Standard',
    emoji: '🏛️',
    description: 'A lovely room.',
    pricePerNight: 180,
    maxGuests: 2,
    amenities: ['Wi-Fi', 'Breakfast included'],
  },
  {
    id: 2,
    hotelName: 'Kyoto Garden Inn',
    location: 'Kyoto, Japan',
    type: 'Deluxe',
    emoji: '⛩️',
    description: 'Traditional room.',
    pricePerNight: 280,
    maxGuests: 4,
    amenities: ['Wi-Fi'],
  },
];

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  // Default: rooms endpoint resolves successfully
  fetch.mockImplementation((url) => {
    if (url === '/api/rooms') {
      return Promise.resolve({
        ok: true,
        json: async () => ({ rooms: MOCK_ROOMS }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: async () => ({ booking: { id: 1 } }),
    });
  });
});

describe('BookingModal', () => {
  describe('rendering', () => {
    it('renders the modal title', async () => {
      render(<BookingModal onClose={jest.fn()} />);
      expect(screen.getByRole('heading', { name: /book a room/i })).toBeInTheDocument();
    });

    it('renders the close button', () => {
      render(<BookingModal onClose={jest.fn()} />);
      expect(screen.getByRole('button', { name: /close booking form/i })).toBeInTheDocument();
    });

    it('renders the room select, date, guests, and needs fields', async () => {
      render(<BookingModal onClose={jest.fn()} />);
      expect(screen.getByLabelText(/select room/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/check-in date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/check-out date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/special needs/i)).toBeInTheDocument();
    });

    it('loads and displays rooms in the select dropdown', async () => {
      render(<BookingModal onClose={jest.fn()} />);
      await waitFor(() => {
        expect(screen.getByText(/Aegean Pearl Resort/i)).toBeInTheDocument();
        expect(screen.getByText(/Kyoto Garden Inn/i)).toBeInTheDocument();
      });
    });

    it('renders the confirm booking button', () => {
      render(<BookingModal onClose={jest.fn()} />);
      expect(screen.getByRole('button', { name: /confirm booking/i })).toBeInTheDocument();
    });
  });

  describe('close behaviour', () => {
    it('calls onClose when the close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      render(<BookingModal onClose={onClose} />);
      await user.click(screen.getByRole('button', { name: /close booking form/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('validation', () => {
    it('shows an error when no room is selected', async () => {
      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);
      await user.click(screen.getByRole('button', { name: /confirm booking/i }));
      expect(await screen.findByText(/please select a room/i)).toBeInTheDocument();
    });

    it('shows an error when check-in date is missing', async () => {
      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);
      await waitFor(() => screen.getByText(/Aegean Pearl Resort/i));
      await user.selectOptions(screen.getByLabelText(/select room/i), '1');
      await user.click(screen.getByRole('button', { name: /confirm booking/i }));
      expect(await screen.findByText(/check-in date is required/i)).toBeInTheDocument();
    });

    it('shows an error when check-out is before check-in', async () => {
      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);
      await waitFor(() => screen.getByText(/Aegean Pearl Resort/i));
      await user.selectOptions(screen.getByLabelText(/select room/i), '1');

      await user.type(screen.getByLabelText(/check-in date/i), '2026-08-10');
      await user.type(screen.getByLabelText(/check-out date/i), '2026-08-05');
      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      expect(await screen.findByText(/check-out must be after check-in/i)).toBeInTheDocument();
    });
  });

  describe('submission', () => {
    it('calls the bookings API with correct payload on valid submission', async () => {
      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);

      await waitFor(() => screen.getByText(/Aegean Pearl Resort/i));
      await user.selectOptions(screen.getByLabelText(/select room/i), '1');
      await user.type(screen.getByLabelText(/check-in date/i), '2026-09-01');
      await user.type(screen.getByLabelText(/check-out date/i), '2026-09-05');

      const guestsInput = screen.getByLabelText(/number of guests/i);
      await user.clear(guestsInput);
      await user.type(guestsInput, '2');

      await user.type(screen.getByLabelText(/special needs/i), 'Vegetarian meals');
      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/bookings', expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"roomId":1'),
        }));
      });
    });

    it('shows a success message after a successful booking', async () => {
      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);

      await waitFor(() => screen.getByText(/Aegean Pearl Resort/i));
      await user.selectOptions(screen.getByLabelText(/select room/i), '1');
      await user.type(screen.getByLabelText(/check-in date/i), '2026-09-01');
      await user.type(screen.getByLabelText(/check-out date/i), '2026-09-05');

      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      expect(await screen.findByText(/booking confirmed/i)).toBeInTheDocument();
    });

    it('shows an error message when the API returns an error', async () => {
      fetch.mockImplementation((url) => {
        if (url === '/api/rooms') {
          return Promise.resolve({ ok: true, json: async () => ({ rooms: MOCK_ROOMS }) });
        }
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: 'Room not found.' }),
        });
      });

      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);

      await waitFor(() => screen.getByText(/Aegean Pearl Resort/i));
      await user.selectOptions(screen.getByLabelText(/select room/i), '1');
      await user.type(screen.getByLabelText(/check-in date/i), '2026-09-01');
      await user.type(screen.getByLabelText(/check-out date/i), '2026-09-05');

      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      expect(await screen.findByText(/room not found/i)).toBeInTheDocument();
    });

    it('shows a network error when fetch throws', async () => {
      fetch.mockImplementation((url) => {
        if (url === '/api/rooms') {
          return Promise.resolve({ ok: true, json: async () => ({ rooms: MOCK_ROOMS }) });
        }
        return Promise.reject(new Error('Network error'));
      });

      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);

      await waitFor(() => screen.getByText(/Aegean Pearl Resort/i));
      await user.selectOptions(screen.getByLabelText(/select room/i), '1');
      await user.type(screen.getByLabelText(/check-in date/i), '2026-09-01');
      await user.type(screen.getByLabelText(/check-out date/i), '2026-09-05');

      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    });

    it('disables the submit button while loading', async () => {
      fetch.mockImplementation((url) => {
        if (url === '/api/rooms') {
          return Promise.resolve({ ok: true, json: async () => ({ rooms: MOCK_ROOMS }) });
        }
        return new Promise(() => {}); // Never resolves
      });

      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);

      await waitFor(() => screen.getByText(/Aegean Pearl Resort/i));
      await user.selectOptions(screen.getByLabelText(/select room/i), '1');
      await user.type(screen.getByLabelText(/check-in date/i), '2026-09-01');
      await user.type(screen.getByLabelText(/check-out date/i), '2026-09-05');

      await user.click(screen.getByRole('button', { name: /confirm booking/i }));

      expect(await screen.findByRole('button', { name: /booking…/i })).toBeDisabled();
    });
  });

  describe('cost preview', () => {
    it('shows the total cost when room, check-in, and check-out are filled', async () => {
      const user = userEvent.setup();
      render(<BookingModal onClose={jest.fn()} />);

      await waitFor(() => screen.getByText(/Aegean Pearl Resort/i));
      await user.selectOptions(screen.getByLabelText(/select room/i), '1');
      await user.type(screen.getByLabelText(/check-in date/i), '2026-09-01');
      await user.type(screen.getByLabelText(/check-out date/i), '2026-09-05');

      // 4 nights × $180 = $720
      expect(await screen.findByText(/total: \$720/i)).toBeInTheDocument();
    });
  });
});
