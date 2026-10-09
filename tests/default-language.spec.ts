import { expect, test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });
test('new visitors start in Indonesian and a manual English choice survives reload', async ({ page }) => {
  await page.goto('/progress');
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
