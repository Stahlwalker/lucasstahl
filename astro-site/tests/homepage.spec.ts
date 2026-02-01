import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and displays key content', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Luke Stahl/);

    // Check hero section with code greeting
    await expect(page.locator('.code-comment')).toContainText('Welcome to my digital space');
    await expect(page.locator('.code-var')).toContainText('developerMarketing');
    await expect(page.locator('.code-string').first()).toContainText('Luke Stahl');

    // Check CTA buttons
    await expect(page.getByRole('button', { name: /view resume/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /portfolio/i })).toBeVisible();

    // Check navigation is present
    await expect(page.locator('nav')).toBeVisible();
  });

  test('scroll indicator is visible on load', async ({ page }) => {
    await page.goto('/');

    const scrollIndicator = page.locator('#scrollIndicator');
    await expect(scrollIndicator).toBeVisible();
    await expect(scrollIndicator).toContainText('Scroll to explore');
  });

  test('featured content section loads', async ({ page }) => {
    await page.goto('/');

    const featuredSection = page.locator('#featuredContent');
    await expect(featuredSection).toBeVisible();
    await expect(page.locator('.section-title')).toContainText('Highlights');
  });

  test('filter buttons are functional', async ({ page }) => {
    await page.goto('/');

    // Check filter sidebar exists
    await expect(page.locator('#filterSidebar')).toBeVisible();

    // Check filter buttons
    const allButton = page.locator('[data-filter="all"]');
    const articleButton = page.locator('[data-filter="article"]');
    const projectButton = page.locator('[data-filter="project"]');

    await expect(allButton).toBeVisible();
    await expect(articleButton).toBeVisible();
    await expect(projectButton).toBeVisible();

    // Test filter interaction
    await articleButton.click();
    await expect(articleButton).toHaveClass(/active/);
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');

    // Find and click blog link
    const blogLink = page.locator('nav a[href="/blog"]');
    await expect(blogLink).toBeVisible();
    await blogLink.click();

    // Verify navigation to blog page
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('.blog-hero-title')).toBeVisible();
  });
});
