import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const cropIds = ['pak-choi', 'water-spinach', 'amaranth', 'lettuce', 'chilli', 'chives'];
test('each crop supports all growth stages and controlled playback', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const cropId of cropIds) {
    await page.goto(`/plants/${cropId}?method=soil`);
    const simulation = page.locator('.growth-simulation');
    await expect(simulation).toBeVisible();
    await expect(simulation.getByRole('button', { name: 'Play simulation', exact: true })).toBeVisible();
    for (const title of ['Pre-sowing', 'Sowing', 'Planting', 'Growing', 'Harvest']) {
      const button = simulation.getByRole('button', { name: new RegExp(title.replace('&', '\\&')) });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(simulation.getByRole('img')).toHaveAttribute('aria-label', new RegExp(title));
    }
    await simulation.getByRole('button', { name: 'Reset simulation' }).click();
    await expect(simulation.getByRole('slider')).toHaveValue('0');
    await simulation.getByRole('button', { name: 'Play simulation', exact: true }).click();
    await expect(simulation.getByRole('button', { name: 'Pause simulation' })).toBeVisible();
    await expect.poll(async () => Number(await simulation.getByRole('slider').inputValue())).toBeGreaterThan(10);
    await simulation.getByRole('button', { name: 'Pause simulation' }).click();
    const paused = await simulation.getByRole('slider').inputValue();
    await page.waitForTimeout(250);
    await expect(simulation.getByRole('slider')).toHaveValue(paused);
  }
  expect(errors).toEqual([]);
});

test('simulation follows lesson and system, fits mobile and supports reduced motion in both languages', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/learn/chilli/hydro/transplant?system=dutch-bucket');
  const simulation = page.locator('.growth-simulation');
  await expect(simulation.getByRole('button', { name: '03 Planting' })).toHaveAttribute('aria-pressed', 'true');
  await expect(simulation.getByRole('button', { name: 'Play simulation', exact: true })).toBeDisabled();
  await expect(simulation).toContainText('Reduced motion is on');
  await expect(simulation.getByRole('img')).toContainText('Dutch Bucket');
  await simulation.getByRole('button', { name: '05 Harvest' }).click();
  await expect(simulation).toContainText('clip mature fruit');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).include('.growth-simulation').analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(simulation).toContainText('Gunakan gunting bersih');
  await expect(simulation.getByRole('button', { name: '05 Panen' })).toHaveAttribute('aria-pressed', 'true');
  await simulation.screenshot({ path: 'artifacts/growth-simulation-mobile.png' });
  await simulation.getByRole('button', { name: 'Layar penuh', exact: true }).click();
  await expect(simulation.getByRole('button', { name: 'Keluar layar penuh' })).toBeVisible();
  await simulation.getByRole('button', { name: 'Keluar layar penuh' }).click();
  await expect(simulation.getByRole('button', { name: '05 Panen' })).toHaveAttribute('aria-pressed', 'true');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/plants/chilli?method=hydro&system=dutch-bucket');
  await simulation.getByRole('button', { name: '05 Panen' }).click();
  await simulation.screenshot({ path: 'artifacts/growth-simulation-desktop.png' });
});
