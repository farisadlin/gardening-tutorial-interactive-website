import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home system explorer updates diagrams and opens the selected system guide', async ({ page }) => {
  await page.goto('/');
  const explorer = page.locator('.insights-explorer');
  for (const name of ['NFT', 'DFT', 'Wick', 'Kratky', 'DWC', 'Drip', 'Dutch Bucket']) {
    await explorer.getByRole('button', { name, exact: true }).click();
    await expect(explorer.getByRole('button', { name, exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(explorer.getByRole('img')).toHaveAttribute('aria-label', new RegExp(`^${name}`));
  }
  await expect(explorer.locator('.climate-observations li')).toHaveCount(3);
  await explorer.getByRole('button', { name: 'DWC', exact: true }).click();
  await explorer.getByRole('link', { name: 'Explore this system' }).click();
  await expect(page).toHaveURL(/method=hydro&system=dwc#hydro-systems$/);
  await expect(page.locator('.system-card.selected')).toContainText('DWC');
});

test('illustrated insights fit mobile and tablet in both languages and respect reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    for (const language of ['English', 'Bahasa Indonesia']) {
      await page.getByRole('button', { name: language, exact: true }).click();
      const explorer = page.locator('.insights-explorer');
      await explorer.getByRole('button', { name: 'NFT', exact: true }).click();
      await expect(explorer.locator('.insight-system-art')).toHaveCSS('animation-name', 'none');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect((await new AxeBuilder({ page }).include('.insights-explorer').analyze()).violations).toEqual([]);
    }
  }
  await page.locator('.insights-explorer').screenshot({ path: 'artifacts/home-insights-desktop.png' });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.locator('.insights-explorer').screenshot({ path: 'artifacts/home-insights-mobile.png' });
});
