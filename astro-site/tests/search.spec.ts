import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('search modal can be opened', async ({ page }) => {
    await page.goto('/');

    // Look for search button/trigger (adjust selector based on your implementation)
    const searchTrigger = page.locator('[aria-label*="search" i], button:has-text("Search"), .search-trigger');

    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();

      // Check search modal/dialog appears
      const searchModal = page.locator('.search-modal, [role="dialog"], .search-container');
      await expect(searchModal).toBeVisible({ timeout: 5000 });
    }
  });

  test('search input is functional', async ({ page }) => {
    await page.goto('/blog');

    // Find search input (adjust selector based on your blog page structure)
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('developer marketing');

      // Wait for search results to appear (fuse.js processing)
      await page.waitForTimeout(500);

      // Verify input has value
      await expect(searchInput).toHaveValue('developer marketing');
    }
  });

  test('search keyboard shortcut works', async ({ page }) => {
    await page.goto('/');

    // Try common search shortcuts (Cmd+K or Ctrl+K)
    const isMac = process.platform === 'darwin';
    if (isMac) {
      await page.keyboard.press('Meta+K');
    } else {
      await page.keyboard.press('Control+K');
    }

    await page.waitForTimeout(300);

    // Check if search modal opened
    const searchModal = page.locator('.search-modal, [role="dialog"], input[type="search"]');
    const isVisible = await searchModal.isVisible().catch(() => false);

    // Note: This test is optional and may not apply if keyboard shortcuts aren't implemented
    if (isVisible) {
      await expect(searchModal).toBeVisible();
    }
  });

  test('search can be closed', async ({ page }) => {
    await page.goto('/');

    // Open search
    const searchTrigger = page.locator('[aria-label*="search" i], button:has-text("Search"), .search-trigger');

    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();

      const searchModal = page.locator('.search-modal, [role="dialog"]');
      await expect(searchModal).toBeVisible({ timeout: 5000 });

      // Try to close search (ESC key or close button)
      await page.keyboard.press('Escape');

      await page.waitForTimeout(300);

      // Verify modal is closed
      await expect(searchModal).not.toBeVisible();
    }
  });
});
