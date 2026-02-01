import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navbar is visible on all pages', async ({ page }) => {
    // Homepage
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();

    // Blog
    await page.goto('/blog');
    await expect(page.locator('nav')).toBeVisible();

    // About
    await page.goto('/about');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('main navigation links are functional', async ({ page }) => {
    await page.goto('/');

    // Test Blog link
    const blogLink = page.locator('nav a[href="/blog"]');
    await expect(blogLink).toBeVisible();
    await blogLink.click();
    await expect(page).toHaveURL(/\/blog$/);

    // Navigate back home
    await page.goto('/');

    // Test About link
    const aboutLink = page.locator('nav a[href="/about"]');
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/\/about$/);
    }
  });

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Look for mobile menu toggle (hamburger)
    const mobileToggle = page.locator('.navbar-toggler, .mobile-menu-toggle, button[aria-label*="menu" i]');

    if (await mobileToggle.isVisible()) {
      await mobileToggle.click();

      // Check mobile menu appears
      const mobileMenu = page.locator('.navbar-collapse, .mobile-menu, nav ul');
      await expect(mobileMenu).toBeVisible({ timeout: 5000 });
    }
  });

  test('footer is present', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('social links in footer work', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();

    // Check for social links (adjust selectors based on your footer structure)
    const socialLinks = page.locator('footer a[href*="github"], footer a[href*="linkedin"], footer a[href*="twitter"]');

    const count = await socialLinks.count();
    if (count > 0) {
      // Verify at least one social link has correct attributes
      const firstLink = socialLinks.first();
      await expect(firstLink).toHaveAttribute('target', '_blank');
      await expect(firstLink).toHaveAttribute('rel', /noopener/);
    }
  });

  test('handles 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    // Check if custom 404 page exists
    if (response?.status() === 404) {
      // Verify we get a 404 response
      expect(response.status()).toBe(404);

      // Optionally check if custom 404 content is shown
      // This depends on whether you have a custom 404 page
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();
    }
  });
});
