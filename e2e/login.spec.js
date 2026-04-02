const { test, expect } = require('@playwright/test');

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test to start logged out
    await page.context().clearCookies();
  });

  test('redirects unauthenticated users from / to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects unauthenticated users from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('displays the Wanderlust Travel login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Wanderlust Travel')).toBeVisible();
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows validation errors when submitting an empty form', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email address/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('logs in successfully with valid credentials and reaches dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email address/i).fill('demo@travel.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByText(/Alex Johnson/i)).toBeVisible();
  });

  test('dashboard shows featured destinations', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email address/i).fill('demo@travel.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/featured destinations/i)).toBeVisible();
    await expect(page.getByText(/Santorini/i)).toBeVisible();
    await expect(page.getByText(/Kyoto/i)).toBeVisible();
  });

  test('redirects back to /login after sign out', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByLabel(/email address/i).fill('demo@travel.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // Sign out
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated users are redirected from /login to /dashboard', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByLabel(/email address/i).fill('demo@travel.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigating to /login while authenticated should redirect to dashboard
    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
