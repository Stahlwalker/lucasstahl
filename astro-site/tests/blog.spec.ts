import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('blog page loads and displays posts', async ({ page }) => {
    await page.goto('/blog');

    // Check page title and hero
    await expect(page).toHaveTitle(/Blog.*Luke Stahl/);
    await expect(page.locator('.blog-hero-title')).toContainText('Blog');

    // Check subtitle
    await expect(page.locator('.blog-hero-subtitle')).toContainText('Insights on web development');

    // Check RSS link is present
    const rssLink = page.locator('a[href="/rss.xml"]');
    await expect(rssLink).toBeVisible();
  });

  test('blog posts are displayed', async ({ page }) => {
    await page.goto('/blog');

    // Wait for blog posts to load
    const blogPosts = page.locator('article, .blog-post, .post-card').first();

    // Check that at least one post is visible
    // Note: This may need adjustment based on your actual blog post structure
    await expect(blogPosts).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to a blog post', async ({ page }) => {
    await page.goto('/blog');

    // Find first blog post link and click it
    const firstPostLink = page.locator('article a, .blog-post a, .post-card a').first();
    await expect(firstPostLink).toBeVisible({ timeout: 10000 });

    await firstPostLink.click();

    // Verify we're on a blog post page
    await expect(page).toHaveURL(/\/blog\/.+/);

    // Check that article content exists
    await expect(page.locator('article')).toBeVisible();
  });

  test('RSS link is accessible', async ({ page }) => {
    await page.goto('/blog');

    const rssLink = page.locator('a[href="/rss.xml"]');
    await expect(rssLink).toBeVisible();
    await expect(rssLink).toHaveAttribute('target', '_blank');
  });
});
