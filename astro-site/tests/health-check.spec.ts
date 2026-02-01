import { test, expect } from '@playwright/test';

/**
 * Cross-browser health checks
 *
 * These tests verify that critical pages load successfully across
 * Chromium, Firefox, and WebKit (Safari). They check HTTP status codes
 * only - no DOM inspection or interaction testing.
 *
 * This catches real issues (site down, pages broken, browser-specific errors)
 * without brittle selector dependencies.
 */

test.describe('Site Health Checks', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);

    // Basic sanity check - page has content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('blog page loads successfully', async ({ page }) => {
    const response = await page.goto('/blog', { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);

    // Basic sanity check - page has content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('about page loads successfully', async ({ page }) => {
    const response = await page.goto('/about', { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);

    // Basic sanity check - page has content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('builds page loads successfully', async ({ page }) => {
    const response = await page.goto('/builds', { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);

    // Basic sanity check - page has content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('gems page loads successfully', async ({ page }) => {
    const response = await page.goto('/gems', { waitUntil: 'domcontentloaded' });

    expect(response?.status()).toBe(200);

    // Basic sanity check - page has content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('site handles 404 gracefully', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-404-test', {
      waitUntil: 'domcontentloaded'
    });

    // Should return 404
    expect(response?.status()).toBe(404);

    // But page should still render (not crash)
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('site loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    // Capture console errors
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Should not have any uncaught JavaScript errors
    expect(errors).toHaveLength(0);
  });
});
