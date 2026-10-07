import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('tools follow soil, each hydroponic system and crop requirements', async ({ page }) => {
  await page.goto('/plants/pak-choi');
  await expect(page.locator('[data-equipment="soil-pot"]')).toContainText('20 cm');
  await expect(page.locator('[data-equipment="ec-meter"]')).toHaveCount(0);
  await expect(page.locator('[data-equipment="gloves"]')).toContainText('Optional');
  await page.getByRole('button', { name: /^Hydroponics/ }).click();
  await expect(page.locator('[data-equipment="ph-meter"]')).toBeVisible();
  for (const [name, item] of [['NFT', 'water-pump'], ['DFT', 'overflow'], ['Wick', 'wick'], ['DWC', 'air-kit'], ['Drip', 'controller'], ['Kratky', 'net-pots']]) {
    await page.getByRole('button', { name: `Choose ${name}`, exact: true }).click();
    await expect(page.locator(`[data-equipment="${item}"]`)).toBeVisible();
  }
  await expect(page.locator('[data-equipment="water-pump"]')).toHaveCount(0);
  await page.goto('/plants/chilli?method=hydro&system=drip');
  await expect(page.locator('[data-equipment="stake"]')).toBeVisible();
});
test('preparation tool list is bilingual, keyboard accessible and fits mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/learn/pak-choi/hydro/prepare?system=wick');
  await expect(page.locator('.compact-equipment')).toHaveAttribute('open', '');
  await expect(page.locator('[data-equipment="wick"]')).toBeVisible();
  await expect(page.getByRole('checkbox')).toHaveCount(3);
  for (const language of ['EN', 'ID']) {
    await page.getByRole('button', { name: language === 'EN' ? 'English' : 'Bahasa Indonesia', exact: true }).click();
    await expect(page.locator('[data-equipment="ph-meter"]')).toContainText(language === 'ID' ? 'Kalibrasi' : 'Calibrate');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const audit = await new AxeBuilder({ page }).include('.equipment-guide').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(audit.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  }
  const summary = page.locator('.compact-equipment summary');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('[data-equipment="wick"]')).not.toBeVisible();
  await page.keyboard.press('Enter'); await expect(page.locator('[data-equipment="wick"]')).toBeVisible();
  await page.goto('/learn/pak-choi/hydro/care?system=wick');
  await expect(page.locator('.compact-equipment')).not.toHaveAttribute('open');
});
