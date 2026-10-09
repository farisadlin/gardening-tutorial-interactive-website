import { test, expect } from '@playwright/test';

test('editorial notes and scroll motion preserve navigation and respect reduced motion', async ({ page }) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  const notes = page.getByRole('region', {name:'Growing notes carousel'});
  await expect(notes.getByRole('heading', {name:'Let your space lead.'})).toBeVisible();
  await page.getByRole('button', {name:'Next growing note'}).click();
  await expect(page.getByRole('heading', {name:'Look below the leaves.'})).toBeVisible();
  await page.getByRole('button', {name:'Previous growing note'}).click();
  await expect(page.getByRole('heading', {name:'Let your space lead.'})).toBeVisible();
  await page.locator('.site-header').getByRole('link', {name:'Plant science',exact:true}).click();
  await expect(page).toHaveURL(/photosynthesis$/);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.goto('/');
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.marquee-track')).toHaveCSS('animation-duration','48s');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

 test('learning cards share one row without page overflow in both languages', async ({ page }) => {
  for (const width of [2133, 900, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    for (const language of ['English', 'Bahasa Indonesia']) {
      await page.getByRole('button', { name: language, exact: true }).click();
      const cards = page.locator('.garden-story-card');
      await expect(cards).toHaveCount(3);
      const bounds = await cards.evaluateAll(elements => elements.map(el => ({ top: el.getBoundingClientRect().top, width: el.getBoundingClientRect().width })));
      expect(Math.max(...bounds.map(b => b.top)) - Math.min(...bounds.map(b => b.top))).toBeLessThan(1);
      expect(bounds.every(b => b.width > 200)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (width < 900) {
        await cards.last().getByRole('link').focus();
        await expect(cards.last().getByRole('link')).toBeInViewport();
      }
    }
  }
 });
