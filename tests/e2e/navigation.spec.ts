import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Black Hole Consulting/);
  });

  test('main sections are visible', async ({ page }) => {
    await page.goto('/');

    // Hero section - check for the h1 title
    await expect(page.locator('h1')).toBeVisible();

    // Services section
    await expect(page.locator('#services')).toBeVisible();

    // Contact section
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');

    // Click on Services link
    await page.click('a[href="#services"]');
    await expect(page.locator('#services')).toBeInViewport();

    // Click on Contact link
    await page.click('a[href="#contact"]');
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('legal pages are accessible', async ({ page }) => {
    await page.goto('/mentions-legales');
    await expect(page.locator('h1')).toContainText('Mentions Légales');

    await page.goto('/cgv');
    await expect(page.locator('h1')).toContainText('Conditions Générales');

    await page.goto('/politique-confidentialite');
    await expect(page.locator('h1')).toContainText('Politique de Confidentialité');
  });

  test('footer links to legal pages', async ({ page }) => {
    await page.goto('/');

    const mentionsLink = page.locator('footer a[href="/mentions-legales"]');
    await expect(mentionsLink).toBeVisible();

    const cgvLink = page.locator('footer a[href="/cgv"]');
    await expect(cgvLink).toBeVisible();
  });
});
