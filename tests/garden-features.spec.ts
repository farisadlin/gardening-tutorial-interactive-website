import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('illustrated learning paths keep four links in one row across languages and widths', async ({ page }) => {
  for (const width of [320, 390, 768, 1440, 2133]) {
    await page.setViewportSize({ width, height: 1200 });
    await page.goto('/');
    for (const language of ['English', 'Bahasa Indonesia']) {
      await page.getByRole('button', { name: language, exact: true }).click();
      const links = page.locator('.garden-feature');
      await expect(links).toHaveCount(4);
      const positions = await links.evaluateAll(items => items.map(item => item.getBoundingClientRect().top));
      expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).include('.garden-features').analyze()).violations).toEqual([]);
    }
  }
  await page.locator('.garden-features').screenshot({ path: 'artifacts/garden-features-desktop.png' });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.locator('.garden-features').screenshot({ path: 'artifacts/garden-features-mobile.png' });
  await page.locator('.garden-feature').nth(1).click();
  await expect(page).toHaveURL(/plants\/pak-choi\?method=hydro#hydro-systems$/);
});
