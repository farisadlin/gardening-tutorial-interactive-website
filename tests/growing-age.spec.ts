import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('harvest labels and age explanation distinguish sowing from transplanting', async ({ page }) => {
  await page.goto('/plants');
  await expect(page.locator('.crop-category').first()).toContainText('30–50 DAS');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.locator('.crop-category').first()).toContainText('30–50 HSS');
  await page.goto('/plants/pak-choi?method=hydro');
  await expect(page.locator('.overview-facts')).toContainText('Hari Setelah Semai');
  await expect(page.locator('.growing-age')).toContainText('HST · Hari Setelah Tanam');
  await expect(page.locator('.age-example')).toContainText('14 HSS = 0 HST');
  await expect(page.locator('.age-example')).toContainText('21 HSS = 7 HST');
  await expect(page.locator('.age-convention')).toContainText('hari 0');
  await page.goto('/learn/pak-choi/hydro/transplant?system=nft');
  await expect(page.locator('.compact-age')).toHaveAttribute('open', '');
  await expect(page.getByRole('checkbox')).toHaveCount(3);
  await expect(page.locator('.grow-tip')).toContainText('0 HST');
  await page.goto('/learn/pak-choi/hydro/harvest?system=nft');
  await expect(page.locator('.grow-tip')).toContainText('30–50 HSS');
  await expect(page.locator('.grow-tip')).toContainText('bukan HST');
});
test('age guide translates and remains accessible on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/learn/pak-choi/soil/sow');
  for (const language of ['EN', 'ID']) {
    await page.getByRole('button', { name: language === 'EN' ? 'English' : 'Bahasa Indonesia', exact: true }).click();
    await expect(page.locator('.compact-age')).toContainText(language === 'EN' ? 'Days After Sowing' : 'Hari Setelah Semai');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).include('.growing-age').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
  }
  const summary = page.locator('.compact-age summary');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.age-example')).not.toBeVisible();
  await page.keyboard.press('Enter'); await expect(page.locator('.age-example')).toBeVisible();
});
