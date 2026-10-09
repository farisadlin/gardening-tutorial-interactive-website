import { test, expect } from '@playwright/test';

test('overview preview supports camera controls, method changes and Indonesian', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/plants/water-spinach');
  const preview = page.getByRole('region', { name: 'Interactive plant preview' });
  await expect(preview.locator('canvas')).toBeVisible();
  await expect(preview.getByRole('button', { name: 'Cutaway', exact: true })).toHaveAttribute('aria-pressed', 'false');
  for (const name of ['Rotate left', 'Rotate right', 'Zoom in', 'Zoom out', 'Reset camera']) {
    await preview.getByRole('button', { name, exact: true }).click();
  }
  await preview.getByRole('button', { name: 'Diagram', exact: true }).click();
  await expect(preview.locator('.static-diagram')).toBeVisible();
  await preview.getByRole('button', { name: 'View in 3D' }).click();
  await expect(preview.locator('canvas')).toBeVisible();
  await page.getByRole('button', { name: /Hydroponics.*Compare/ }).click();
  await expect(preview.locator('.small-badge')).toContainText('DWC');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Pratinjau tanaman interaktif' }).locator('canvas')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Putar kiri', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('overview has a usable diagram without WebGL on a small screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type: string, ...args: unknown[]) {
      if (type === 'webgl' || type === 'webgl2') return null;
      return getContext.apply(this, [type, ...args] as Parameters<typeof getContext>);
    } as typeof getContext;
  });
  await page.goto('/plants/water-spinach');
  await expect(page.locator('.overview-preview .static-diagram')).toBeVisible();
  await expect(page.getByRole('button', { name: 'View in 3D' })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole('link', { name: 'Let’s start growing' })).toBeVisible();
});
