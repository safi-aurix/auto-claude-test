const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:3000';
const CREDENTIALS = { email: 'demo@travel.com', password: 'password123' };

async function login(page) {
  await page.goto(`${BASE}/login`);
  await page.getByLabel(/email address/i).fill(CREDENTIALS.email);
  await page.getByLabel(/password/i).fill(CREDENTIALS.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(`${BASE}/dashboard`);
}

test.describe('Room Booking Service', () => {
  test('dashboard shows Book a Room and My Bookings buttons', async ({ page }) => {
    await login(page);
    await expect(page.getByRole('link', { name: /book a room/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /my bookings/i })).toBeVisible();
  });

  test('Book a Room button navigates to /bookings', async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: /book a room/i }).click();
    await expect(page).toHaveURL(`${BASE}/bookings`);
  });

  test('bookings page shows empty state when no bookings exist', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/bookings`);
    await expect(page.getByText(/no bookings yet/i)).toBeVisible();
  });

  test('bookings page has a Book a Room button that opens the booking modal', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/bookings`);
    await page.getByRole('button', { name: /\+ book a room/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /book a room/i })).toBeVisible();
  });

  test('booking modal displays room options', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/bookings`);
    await page.getByRole('button', { name: /\+ book a room/i }).click();

    const select = page.getByLabel(/select room/i);
    await expect(select).toBeVisible();
    await expect(select.locator('option')).toHaveCount({ minimum: 2 });
  });

  test('booking modal shows total cost preview after selecting room and dates', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/bookings`);
    await page.getByRole('button', { name: /\+ book a room/i }).click();

    await page.getByLabel(/select room/i).selectOption({ index: 1 });
    await page.getByLabel(/check-in date/i).fill('2026-10-01');
    await page.getByLabel(/check-out date/i).fill('2026-10-05');

    await expect(page.getByText(/total:/i)).toBeVisible();
  });

  test('can complete a room booking successfully', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/bookings`);
    await page.getByRole('button', { name: /\+ book a room/i }).click();

    await page.getByLabel(/select room/i).selectOption({ index: 1 });
    await page.getByLabel(/check-in date/i).fill('2026-10-01');
    await page.getByLabel(/check-out date/i).fill('2026-10-04');
    await page.getByLabel(/number of guests/i).fill('1');
    await page.getByLabel(/special needs/i).fill('Ground floor room');

    await page.getByRole('button', { name: /confirm booking/i }).click();
    await expect(page.getByText(/booking confirmed/i)).toBeVisible();
  });

  test('completed booking appears in the bookings list', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/bookings`);
    await page.getByRole('button', { name: /\+ book a room/i }).click();

    await page.getByLabel(/select room/i).selectOption({ index: 1 });
    await page.getByLabel(/check-in date/i).fill('2026-11-10');
    await page.getByLabel(/check-out date/i).fill('2026-11-13');
    await page.getByLabel(/number of guests/i).fill('1');

    await page.getByRole('button', { name: /confirm booking/i }).click();
    await expect(page.getByText(/booking confirmed/i)).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: /done/i }).click();

    // Booking should now appear in the list
    await expect(page.getByRole('article').first()).toBeVisible();
    await expect(page.getByText(/confirmed/i).first()).toBeVisible();
  });

  test('can cancel a booking', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/bookings`);

    // Create a booking first
    await page.getByRole('button', { name: /\+ book a room/i }).click();
    await page.getByLabel(/select room/i).selectOption({ index: 1 });
    await page.getByLabel(/check-in date/i).fill('2026-12-01');
    await page.getByLabel(/check-out date/i).fill('2026-12-03');
    await page.getByLabel(/number of guests/i).fill('1');
    await page.getByRole('button', { name: /confirm booking/i }).click();
    await page.getByRole('button', { name: /done/i }).click();

    // Cancel the booking
    await page.getByRole('button', { name: /cancel booking/i }).first().click();

    // Status should update to cancelled
    await expect(page.getByText(/cancelled/i)).toBeVisible();
  });

  test('booking modal closes when the close button is clicked', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE}/bookings`);
    await page.getByRole('button', { name: /\+ book a room/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('button', { name: /close booking form/i }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('unauthenticated users are redirected from /bookings to /login', async ({ page }) => {
    await page.goto(`${BASE}/bookings`);
    await expect(page).toHaveURL(`${BASE}/login`);
  });
});
