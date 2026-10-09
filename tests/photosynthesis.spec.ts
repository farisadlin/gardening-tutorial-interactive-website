import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('photosynthesis guide plays, seeks, compares root environments and translates', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/how-it-works');
  await page.getByRole('link', { name: 'Explore photosynthesis', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'How a leaf makes food.' })).toBeVisible();
  const film = page.getByRole('region', { name: 'Photosynthesis motion graphic' });
  await expect(film.getByRole('img', { name: 'Light reaches the leaves' })).toBeVisible();
  await page.getByRole('button', { name: '04 Sugar is made; oxygen is released' }).click();
  await expect(film.getByRole('img', { name: 'Sugar is made; oxygen is released' })).toBeVisible();
  await page.getByRole('button', { name: '02 Water travels from the roots' }).click();
  await expect(film.getByRole('img', { name: 'Water travels from the roots' })).toBeVisible();
  await film.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(film.getByRole('img', { name: 'Carbon dioxide enters the leaves' })).toBeVisible({ timeout: 9000 });
  await film.getByRole('button', { name: 'Pause', exact: true }).click();
  await page.getByRole('button', { name: 'In hydroponics', exact: true }).click();
  await expect(page).toHaveURL(/method=hydro/);
  await expect(film.locator('svg[role=img]')).toContainText('HYDROPONICS');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Cara daun membuat makanan.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Di hidroponik', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('region', { name: 'Animasi fotosintesis' }).locator('svg[role=img]')).toContainText('HIDROPONIK');
  expect(errors).toEqual([]);
});

test('photosynthesis is accessible and fits mobile with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/photosynthesis?method=hydro');
  await expect(page.getByRole('heading', { name: 'How a leaf makes food.' })).toBeVisible();
  const film = page.getByRole('region', { name: 'Photosynthesis motion graphic' });
  await expect(film.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '04 Sugar is made; oxygen is released' }).click();
  await expect(film.getByRole('img', { name: 'Sugar is made; oxygen is released' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/photosynthesis-mobile.png', fullPage: false });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.screenshot({ path: 'artifacts/photosynthesis-desktop.png', fullPage: false });
});

test('24 hourly scenes show night respiration, daytime photosynthesis and both root environments', async ({ page }) => {
  await page.goto('/photosynthesis');
  const day = page.locator('.photo-day');
  await expect(day.getByRole('heading', { name: 'A plant’s life over 24 hours.' })).toBeVisible();
  await expect(day.getByRole('button', { name: 'Play full day', exact: true })).toBeVisible();
  for (let hour = 0; hour < 24; hour++) {
    const label = `${String(hour).padStart(2, '0')}:00`;
    await day.getByRole('button', { name: label, exact: true }).click();
    await expect(day.locator('.photo-day-clock')).toHaveText(label);
    await expect(day.getByRole('img')).toHaveAttribute('aria-label', new RegExp(`^${label}`));
    const description = day.locator('dl');
    await expect(description).toContainText(hour >= 6 && hour < 18 ? 'Light available' : 'Inactive in this unlit scenario');
    await expect(description).toContainText('Continues');
  }
  await expect(day.locator('.photo-day-root')).toContainText('Soil');
  await page.getByRole('button', { name: 'In hydroponics', exact: true }).click();
  await expect(day.locator('.photo-day-clock')).toHaveText('23:00');
  await expect(day.locator('.photo-day-root')).toContainText('Hydroponics');
  await day.getByRole('button', { name: '22:00', exact: true }).click();
  await day.getByRole('button', { name: 'Animate this hour', exact: true }).click();
  await expect(day.getByRole('button', { name: 'Pause day animation', exact: true })).toBeVisible();
  await expect(day.getByRole('button', { name: 'Play full day', exact: true })).toBeVisible({ timeout: 7000 });
  await expect(day.locator('.photo-day-clock')).toHaveText('22:00');
  await day.getByRole('button', { name: 'Play full day', exact: true }).click();
  await expect(day.locator('.photo-day-clock')).toHaveText('00:00');
  await expect(day.locator('.photo-day-clock')).toHaveText('01:00', { timeout: 7000 });
  await day.getByRole('button', { name: 'Pause day animation', exact: true }).click();
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(day.getByRole('heading', { name: 'Kehidupan tanaman selama 24 jam.' })).toBeVisible();
  await day.getByRole('button', { name: '12:00', exact: true }).click();
  await expect(day.locator('dl')).toContainText('Cahaya tersedia');
  await day.screenshot({ path: 'artifacts/photosynthesis-day-desktop.png' });
  await day.getByRole('button', { name: '00:00', exact: true }).click();
  await expect(day.locator('dl')).toContainText('Tidak aktif dalam contoh tanpa cahaya ini');
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await day.screenshot({ path: 'artifacts/photosynthesis-day-mobile.png' });
});
