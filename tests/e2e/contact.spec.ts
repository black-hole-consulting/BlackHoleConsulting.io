import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('contact form is visible', async ({ page }) => {
    await page.goto('/');

    const form = page.locator('#contact form');
    await expect(form).toBeVisible();
  });

  test('contact form has required fields', async ({ page }) => {
    await page.goto('/');

    // Check for name field
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute('required', '');

    // Check for email field
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(emailInput).toHaveAttribute('type', 'email');

    // Check for message field
    const messageInput = page.locator('textarea[name="message"]');
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toHaveAttribute('required', '');
  });

  test('contact form validates email format', async ({ page }) => {
    await page.goto('/');

    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill('invalid-email');

    const submitButton = page.locator('#contact form button[type="submit"]');
    await submitButton.click();

    // Browser validation should prevent submission
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBe(false);
  });

  test('Calendly link is present', async ({ page }) => {
    await page.goto('/');

    const calendlyLink = page.locator('a[href*="calendly"]').first();
    await expect(calendlyLink).toBeVisible();
  });
});
