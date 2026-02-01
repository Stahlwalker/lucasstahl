import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('theme toggle button is visible', async ({ page }) => {
    await page.goto('/');

    // Check desktop theme toggle
    const themeToggle = page.locator('#themeToggle');
    await expect(themeToggle).toBeVisible();
  });

  test('theme toggle changes theme', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const themeToggle = page.locator('#themeToggle');

    // Get initial theme from localStorage or data attribute
    const initialTheme = await html.evaluate((el) => {
      return el.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    });

    // Click theme toggle
    await themeToggle.click();

    // Wait a moment for theme change to apply
    await page.waitForTimeout(300);

    // Get new theme
    const newTheme = await html.evaluate((el) => {
      return el.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    });

    // Verify theme changed
    expect(newTheme).not.toBe(initialTheme);
  });

  test('theme persists across page navigation', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('#themeToggle');
    const html = page.locator('html');

    // Set theme to dark
    await themeToggle.click();
    await page.waitForTimeout(300);

    const themeAfterToggle = await html.evaluate((el) => {
      return el.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    });

    // Navigate to blog
    await page.goto('/blog');

    // Check theme persisted
    const themeOnNewPage = await html.evaluate((el) => {
      return el.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    });

    expect(themeOnNewPage).toBe(themeAfterToggle);
  });

  test('theme icon updates on toggle', async ({ page }) => {
    await page.goto('/');

    const themeIcon = page.locator('#themeIcon');
    const themeToggle = page.locator('#themeToggle');

    // Get initial icon class
    const initialIcon = await themeIcon.getAttribute('class');

    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(300);

    // Get new icon class
    const newIcon = await themeIcon.getAttribute('class');

    // Verify icon changed (sun <-> moon)
    expect(newIcon).not.toBe(initialIcon);
  });
});
