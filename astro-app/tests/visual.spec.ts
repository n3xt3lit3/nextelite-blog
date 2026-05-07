import { test, expect } from '@playwright/test';

test('homepage snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
});

test('post: forste-kamp', async ({ page }) => {
  await page.goto('/blog/forste-kamp');
  await expect(page).toHaveScreenshot('forste-kamp.png', { fullPage: true });
});

test('post: pakken-kom', async ({ page }) => {
  await page.goto('/blog/pakken-kom');
  await expect(page).toHaveScreenshot('pakken-kom.png', { fullPage: true });
});
