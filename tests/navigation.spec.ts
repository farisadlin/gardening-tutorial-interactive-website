import { test, expect } from '@playwright/test';

test('dedicated pages, active navigation, language and browser history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Grow a little.');
  await expect(page.locator('.crop-card')).toHaveCount(0);
  await expect(page.locator('.how-section')).toHaveCount(0);
  await page.getByRole('link', { name: 'Find your first plant' }).click();
  await expect(page).toHaveURL(/\/plants$/);
  await expect(page.locator('.crop-card')).toHaveCount(6);
  await expect(page.locator('.hero')).toHaveCount(0);
  await expect(page.locator('.site-header nav .explore-trigger')).toHaveClass(/active/);
  await page.getByRole('textbox', { name: 'Search plants' }).fill('chilli');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await page.locator('.site-header').getByRole('link', { name: 'Cara belajar' }).click();
  await expect(page).toHaveURL(/\/how-it-works$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tak perlu tahu semuanya.');
  await expect(page.locator('.crop-card')).toHaveCount(0);
  await expect(page.locator('.site-header nav a[aria-current="page"]')).toHaveText('Cara belajar');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await page.goBack();
  await expect(page).toHaveURL(/\/plants\?q=chilli$/);
  await expect(page.getByRole('textbox', { name: 'Cari tanaman' })).toHaveValue('chilli');
  await expect(page.locator('.crop-card')).toHaveCount(1);
  await page.locator('.site-header .brand').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mulai menanam.');
});

test('legacy section links and filters open dedicated pages', async ({ page }) => {
  await page.goto('/?method=hydro&q=lettuce#crop-library');
  await expect(page).toHaveURL(/\/plants\?method=hydro&q=lettuce$/);
  await expect(page.locator('.crop-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Hydroponics', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/#how-it-works');
  await expect(page).toHaveURL(/\/how-it-works$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('You don’t need to know it all.');
  await page.goto('/#crop-library');
  await expect(page).toHaveURL(/\/plants$/);
  await expect(page.locator('.crop-card')).toHaveCount(6);
});

test('all navigation destinations remain available on narrow screens', async ({ page }) => {
  for (const width of [320, 600, 800]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
    const nav = page.locator('.site-header nav');
    await expect(nav.getByRole('button', { name: 'Jelajahi tanaman' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Kebun saya' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Cara belajar' })).toBeVisible();
    await nav.getByRole('link', { name: 'Cara belajar' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await nav.getByRole('button', { name: 'Jelajahi tanaman' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('.drawer-plant')).toHaveCount(6);
    await page.getByRole('button', { name: 'Tutup jelajah tanaman' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});


test('plant drawer preserves the guide, supports keyboard dismissal and opens a chosen method', async ({ page }) => {
  await page.goto('/plants/pak-choi');
  await page.getByRole('link', { name: 'Let’s start growing' }).click();
  const guideUrl = page.url();
  await expect(page.locator('.lesson-instructions')).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
  const scrollBefore = await page.evaluate(() => window.scrollY);
  const trigger = page.locator('.site-header').getByRole('button', { name: 'Explore plants' });
  await trigger.evaluate(el => el.focus({ preventScroll: true }));
  await page.keyboard.press('Enter');
  const drawer = page.getByRole('dialog', { name: 'Explore plants' });
  await expect(drawer).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer.getByRole('textbox', { name: 'Search plants' })).toBeFocused();
  await expect(page).toHaveURL(guideUrl);
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.keyboard.press('Escape');
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  await trigger.click();
  await drawer.getByRole('textbox').fill('nothing-matches');
  await expect(drawer.getByRole('heading', { name: 'No plants found just yet.' })).toBeVisible();
  await drawer.getByRole('button', { name: 'Show all plants' }).click();
  await drawer.getByRole('textbox').fill('selada');
  await expect(drawer.locator('.drawer-plant')).toHaveCount(1);
  await drawer.getByRole('button', { name: 'Hydroponics', exact: true }).click();
  await drawer.locator('.drawer-plant').click();
  await expect(page).toHaveURL(/\/plants\/lettuce\?method=hydro$/);
  await expect(drawer).not.toBeVisible();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});
