import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);

    // H1 should have content
    const h1 = page.locator('h1');
    await expect(h1).not.toBeEmpty();
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('links have accessible text', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      // Link should have either text content or aria-label
      const hasAccessibleName = (text && text.trim().length > 0) || ariaLabel;
      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('#contact input, #contact textarea');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const labelExists = (await label.count()) > 0;
        const hasAccessibleName = labelExists || ariaLabel || placeholder;
        expect(hasAccessibleName).toBeTruthy();
      }
    }
  });

  test('page has lang attribute', async ({ page }) => {
    await page.goto('/');

    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang).toBe('fr');
  });

  test('page has meta viewport', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
  });

  test('skip link or main landmark exists', async ({ page }) => {
    await page.goto('/');

    const main = page.locator('main, [role="main"]');
    const mainExists = (await main.count()) > 0;

    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    const skipLinkExists = (await skipLink.count()) > 0;

    expect(mainExists || skipLinkExists).toBeTruthy();
  });
});
