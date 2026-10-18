import { test, expect } from '@playwright/test';

test('native 3D HyperFrames scene seeks, animates and retains its hour across method and language changes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/photosynthesis');
  const day = page.locator('.photo-day');
  await expect(day.locator('[data-renderer="hyperframes"]')).toHaveAttribute('data-ready', 'true');
  const scene = page.frameLocator('hyperframes-player iframe');
  await expect(scene.locator('#stage')).toHaveAttribute('data-duration', '96');
  await expect(scene.locator('#stage')).toHaveAttribute('data-dimension', '3');
  await expect(scene.locator('#day3d-canvas')).toBeVisible();
  await day.getByRole('button', { name: '03:00', exact: true }).click();
  await expect(scene.locator('svg[role=img]')).toHaveAttribute('aria-label', /^03:00/);
  await expect(scene.locator('#day3d-overlay')).toContainText('Inactive without light');
  await day.getByRole('button', { name: '12:00', exact: true }).click();
  await expect(scene.locator('svg[role=img]')).toHaveAttribute('aria-label', /^12:00/);
  await expect(scene.locator('#day3d-overlay')).toContainText('Light available');
  await day.getByRole('button', { name: 'Animate this hour', exact: true }).click();
  await expect(day.getByRole('button', { name: 'Pause day animation', exact: true })).toBeVisible();
  await expect.poll(async () => Number(await scene.locator('#day3d-canvas').getAttribute('data-frame'))).toBeGreaterThan(1440);
  await day.getByRole('button', { name: 'Pause day animation', exact: true }).click();
  const paused = await scene.locator('#day3d-canvas').getAttribute('data-frame');
  await page.waitForTimeout(250);
  await expect(scene.locator('#day3d-canvas')).toHaveAttribute('data-frame', paused!);
  await page.getByRole('button', { name: 'In hydroponics', exact: true }).click();
  await expect(day.locator('[data-renderer="hyperframes"]')).toHaveAttribute('data-ready', 'true');
  await expect(scene.locator('#stage')).toHaveAttribute('data-method', 'hydro');
  await expect(scene.locator('svg[role=img]')).toHaveAttribute('aria-label', /^12:00/);
  await expect(scene.locator('#day3d-overlay')).toContainText('HYDROPONICS · ROOT CUTAWAY');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(day.locator('[data-renderer="hyperframes"]')).toHaveAttribute('data-ready', 'true');
  await expect(scene.locator('#stage')).toHaveAttribute('data-language', 'id');
  await expect(scene.locator('#day3d-overlay')).toContainText('HIDROPONIK · PENAMPANG AKAR');
  await expect(scene.locator('svg[role=img]')).toHaveAttribute('aria-label', /^12:00/);
  expect(errors).toEqual([]);
});


test('day cycle retains a seekable diagram when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(kind: string, ...args: unknown[]) {
      if (kind === 'webgl' || kind === 'webgl2' || kind === 'experimental-webgl') return null;
      return (original as Function).call(this, kind, ...args);
    } as typeof original;
  });
  await page.goto('/photosynthesis');
  const day = page.locator('.photo-day');
  await expect(day.locator('[data-renderer="hyperframes"]')).toHaveAttribute('data-ready', 'true');
  const scene = page.frameLocator('hyperframes-player iframe');
  await expect(scene.locator('#stage')).toHaveAttribute('data-dimension', '2');
  await day.getByRole('button', { name: '03:00', exact: true }).click();
  await expect(scene.locator('svg[role=img]')).toBeVisible();
  await expect(scene.locator('svg[role=img]')).toHaveAttribute('aria-label', /^03:00/);
  await day.getByRole('button', { name: '12:00', exact: true }).click();
  await expect(scene.locator('#day-artwork')).toContainText('Light available');
  await day.getByRole('button', { name: 'Animate this hour', exact: true }).click();
  await expect(day.getByRole('button', { name: 'Pause day animation', exact: true })).toBeVisible();
});
