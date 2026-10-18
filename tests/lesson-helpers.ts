import type { Page } from '@playwright/test';

export async function completeActions(page: Page) {
  for (let i = 0; i < 3; i++) {
    await page.locator('.task-dots button').nth(i).click();
    await page.locator('.focused-task-actions input').check();
  }
}
