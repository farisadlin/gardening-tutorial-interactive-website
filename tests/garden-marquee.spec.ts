import { test, expect } from '@playwright/test';

test('plant names autoplay without controls and cover the wide-screen loop boundary', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 2133, height: 1200 });
  await page.goto('/');
  const offset = () => page.locator('.marquee-track').evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41);
  const before = await offset();
  await expect.poll(offset).toBeLessThan(before - 2);
  await expect(page.locator('.garden-marquee button')).toHaveCount(0);
  expect(await page.locator('.marquee-track').evaluate(track => {
    const animation = track.getAnimations()[0];
    animation.pause(); animation.currentTime = 23999;
    const rect = track.getBoundingClientRect();
    return rect.left <= 0 && rect.right >= innerWidth;
  })).toBe(true);
});

test('plant ribbon autoplays at a gentler pace with reduced motion and no controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.marquee-track')).toHaveCSS('animation-name', 'garden-drift');
  await expect(page.locator('.marquee-track')).toHaveCSS('animation-duration', '48s');
  await expect(page.locator('.garden-marquee button')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
