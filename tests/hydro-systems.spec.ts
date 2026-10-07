import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { hydroSystems } from '../src/data/hydroSystems';

test('system comparison, lesson selection and independent persisted progress', async ({ page }) => {
  await page.goto('/plants/pak-choi?method=hydro');
  await expect(page.locator('.system-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Choose NFT', exact: true }).click();
  await expect(page).toHaveURL(/system=nft/);
  await page.locator('.system-start').getByRole('link').click();
  await expect(page).toHaveURL(/hydro\/prepare\?system=nft/);
  await page.getByRole('checkbox').first().check();
  await page.getByRole('radio').first().check();
  await page.getByLabel('Hydroponic system', { exact: true }).selectOption('dft');
  await expect(page).toHaveURL(/prepare\?system=dft/);
  await expect(page.getByRole('checkbox').first()).not.toBeChecked();
  await expect(page.getByRole('radio').first()).not.toBeChecked();
  await page.getByLabel('Hydroponic system', { exact: true }).selectOption('nft');
  await page.reload();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await expect(page.getByRole('radio').first()).toBeChecked();
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.getByLabel('Sistem hidroponik', { exact: true })).toHaveValue('nft');
  await page.getByLabel('Sistem hidroponik', { exact: true }).selectOption('wick');
  await expect(page).toHaveURL(/prepare\?system=wick/);
  await expect(page.getByRole('checkbox').first()).not.toBeChecked();
});

test('six different WebGL setups, diagrams, hotspots and controls', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  for (const system of hydroSystems) {
    await page.goto(`/learn/pak-choi/hydro/care?system=${system.id}`);
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('.small-badge')).toContainText(system.name.en);
    await page.getByRole('button', { name: 'Reset camera', exact: true }).click();
    await page.getByRole('button', { name: 'Cutaway', exact: true }).click();
    await page.locator('.part-buttons').getByRole('button', { name: 'Root zone' }).click();
    await expect(page.locator('.hotspot-explanation')).toHaveText(system.rootExplanation.en);
    await page.getByRole('button', { name: 'Diagram', exact: true }).click();
    await expect(page.locator('.static-diagram')).toBeVisible();
    await page.getByRole('button', { name: 'View in 3D', exact: true }).click();
    await expect(page.locator('canvas')).toBeVisible();
  }
  expect(errors).toEqual([]);
  await page.goto('/learn/pak-choi/hydro/care?system=nft');
  await expect(page.locator('canvas')).toBeVisible();
  await page.screenshot({ path: 'artifacts/nft-lesson.png', fullPage: true });
});

test('crop suitability and unsupported system URLs', async ({ page }) => {
  await page.goto('/plants/chilli?method=hydro');
  await expect(page.getByRole('button', { name: 'Choose NFT', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Choose Wick', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Choose DWC', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Choose Drip', exact: true })).toBeEnabled();
  await page.goto('/learn/chilli/hydro/care?system=nft');
  await expect(page.locator('.lesson-system')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Compare hydroponic systems/ })).toBeVisible();
  await page.goto('/learn/pak-choi/hydro/care?system=unknown');
  await expect(page.getByRole('link', { name: /Compare hydroponic systems/ })).toBeVisible();
});

test('bilingual system pages are accessible and fit narrow screens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const language of ['EN', 'ID']) {
    await page.goto('/'); await page.getByRole('button', { name: language === 'EN' ? 'English' : 'Bahasa Indonesia', exact: true }).click();
    await page.setViewportSize({ width: 320, height: 740 });
    for (const path of ['/plants/pak-choi?method=hydro', '/learn/pak-choi/hydro/care?system=wick']) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto('/plants/pak-choi?method=hydro#hydro-systems');
  await page.screenshot({ path: 'artifacts/hydro-systems.png', fullPage: true });
});
