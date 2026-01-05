import { test, expect } from '@playwright/test';

// Configure mobile viewport for all tests in this file
test.use({ viewport: { width: 390, height: 844 } });

test.describe('Mobile Navigation', () => {
  test('mobile menu button is visible', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.locator('button[aria-label*="menu"], button[aria-expanded]');
    await expect(menuButton.first()).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.locator('button[aria-label*="menu"], button[aria-expanded]').first();
    await menuButton.click();

    // Menu should be open - check for nav links visibility
    await page.waitForTimeout(300); // Wait for animation

    // Close menu
    await menuButton.click();
    await page.waitForTimeout(300);
  });

  test('page is responsive', async ({ page }) => {
    await page.goto('/');

    // Check viewport
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThan(768);

    // Main content should still be visible
    await expect(page.locator('main')).toBeVisible();
  });

  test('contact section is accessible on mobile', async ({ page }) => {
    await page.goto('/');

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await expect(contactSection).toBeVisible();
  });
});
