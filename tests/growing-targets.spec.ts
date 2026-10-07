import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { crops } from '../src/data/garden';
import { growingTargets, ppmRange, rangeText } from '../src/data/growingTargets';
test('every crop has pH, PPM, EC and separate air and solution temperatures', async ({ page }) => {
  for (const crop of crops) {
    await page.goto(`/plants/${crop.id}?method=hydro`);
    const target = growingTargets[crop.id];
    await expect(page.getByTestId('target-ph')).toHaveText(rangeText(target.ph, 'en'));
    await expect(page.getByTestId('target-ppm')).toContainText(rangeText(ppmRange(target.ec, 500), 'en'));
    await expect(page.getByTestId('target-air')).toContainText(rangeText(target.air, 'en'));
    await expect(page.getByTestId('target-solution')).toContainText('22–24');
    await page.locator('.target-details summary').click();
    await expect(page.locator('.target-sources a')).toHaveCount(new Set([target.nutrientSource.url, target.temperatureSource.url, 'https://extension.okstate.edu/fact-sheets/electrical-conductivity-and-ph-guide-for-hydroponics', 'https://support.bluelab.com/hc/en-us/articles/205237090-What-are-the-different-conductivity-scales-What-do-they-mean-']).size);
  }
});
test('PPM scale persists through reload, translation and system changes without changing EC', async ({ page }) => {
  await page.goto('/learn/pak-choi/hydro/prepare');
  await expect(page.locator('.target-stage-note')).toBeVisible();
  await page.getByRole('button', { name: 'PPM 700', exact: true }).click();
  await expect(page.getByTestId('target-ppm')).toHaveText('1,050–1,400 PPM');
  await page.reload();
  await expect(page.getByRole('button', { name: 'PPM 700', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.getByTestId('target-ph')).toHaveText('5,5–6,5');
  await expect(page.getByTestId('target-ppm')).toHaveText('1.050–1.400 PPM');
  await page.getByLabel('Sistem hidroponik', { exact: true }).selectOption('nft');
  await expect(page).toHaveURL(/prepare\?system=nft/);
  await expect(page.getByTestId('target-ppm')).toHaveText('1.050–1.400 PPM');
  await expect(page.getByTestId('target-ec')).toContainText('1,5–2');
  await page.getByRole('button', { name: 'PPM 500', exact: true }).click();
  await expect(page.getByTestId('target-ppm')).toHaveText('750–1.000 PPM');
  await page.goto('/plants/pak-choi?method=soil');
  await expect(page.getByTestId('target-air')).toBeVisible();
  await expect(page.getByTestId('target-ppm')).toHaveCount(0);
  await expect(page.locator('.target-scope')).toContainText('tidak mengukur kesuburan tanah');
});
test('measurement panel is usable at 320px in both languages and without storage', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked'); }; });
  await page.setViewportSize({ width: 320, height: 740 });
  for (const language of ['EN', 'ID']) {
    await page.goto('/learn/pak-choi/hydro/care?system=wick');
    await page.getByRole('button', { name: language === 'EN' ? 'English' : 'Bahasa Indonesia', exact: true }).click();
    await page.locator('.target-details summary').click();
    await page.getByRole('button', { name: 'PPM 700', exact: true }).click();
    await expect(page.getByTestId('target-ppm')).toContainText(language === 'EN' ? '1,050–1,400' : '1.050–1.400');
    const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).map(e => ({ tag: e.tagName, class: String(e.className), right: Math.round(e.getBoundingClientRect().right) })));
    expect(overflow).toEqual([]);
    const result = await new AxeBuilder({ page }).include('.growing-targets').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  }
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto('/learn/pak-choi/hydro/prepare');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await page.screenshot({ path: 'artifacts/growing-targets.png', fullPage: true });
});
