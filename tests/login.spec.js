// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test('renders the TravelCo branding', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'TravelCo' })).toBeVisible();
    await expect(page.getByText('Agent Portal Sign In')).toBeVisible();
  });

  test('renders email and password fields', async ({ page }) => {
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('shows validation error when fields are empty', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('[role="alert"].error, div[role="alert"]:not([aria-live])'))
      .toContainText('Please fill in all fields');
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.getByLabel('Email Address').fill('wrong@example.com');
    await page.getByLabel('Password').fill('badpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('div[role="alert"]:not([aria-live])'))
      .toContainText('Invalid email or password');
  });

  test('redirects to dashboard on valid credentials', async ({ page }) => {
    await page.getByLabel('Email Address').fill('agent@travelco.com');
    await page.getByLabel('Password').fill('travel123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
  });
});

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    // Log in first
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel('Email Address').fill('agent@travelco.com');
    await page.getByLabel('Password').fill('travel123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(`${BASE_URL}/dashboard`);
  });

  test('shows welcome message with agent name', async ({ page }) => {
    await expect(page.getByText(/Welcome back, Travel Agent/)).toBeVisible();
  });

  test('shows stats cards', async ({ page }) => {
    await expect(page.getByText('Active Bookings')).toBeVisible();
    await expect(page.getByText('Departures This Month')).toBeVisible();
    await expect(page.getByText('Clients Served')).toBeVisible();
    await expect(page.getByText('Revenue (MTD)')).toBeVisible();
  });

  test('shows recent bookings table', async ({ page }) => {
    await expect(page.getByText('Recent Bookings')).toBeVisible();
    await expect(page.getByText('BK-1001')).toBeVisible();
    await expect(page.getByText('Paris, France')).toBeVisible();
  });

  test('shows popular destinations', async ({ page }) => {
    await expect(page.getByText('Popular Destinations')).toBeVisible();
    await expect(page.getByText('Paris', { exact: true })).toBeVisible();
    await expect(page.getByText('Bali', { exact: true })).toBeVisible();
  });

  test('sign out redirects to login', async ({ page }) => {
    await page.getByRole('button', { name: /sign out/i }).click();
    await page.waitForURL(`${BASE_URL}/login`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});

test.describe('Auth guard', () => {
  test('unauthenticated user is redirected from dashboard to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForURL(`${BASE_URL}/login`);
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});
