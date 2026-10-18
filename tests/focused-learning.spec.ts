import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { crops, getTutorial } from '../src/data/garden';

for (const language of ['en', 'id'] as const) {
  test(`focused path preserves decisions, progress and reference access in ${language}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/plants/pak-choi?method=hydro');
    await page.getByRole('button', { name: language === 'en' ? 'English' : 'Bahasa Indonesia', exact: true }).click();
    const comparison = page.locator('.system-comparison');
    await expect(comparison).not.toHaveAttribute('open');
    await expect(page.locator('.system-card')).toHaveCount(7);
    await expect(page.locator('.system-card').first()).not.toBeVisible();
    await expect(page.locator('.selected-path')).toContainText(language === 'en' ? 'Wick' : 'Sumbu');
    await page.locator('.selected-path a').click();
    await expect(comparison).toHaveAttribute('open', '');
    await page.getByRole('button', { name: 'Choose NFT', exact: true }).or(page.getByRole('button', { name: 'Pilih NFT', exact: true })).click();
    const start = page.locator('.overview-copy .button.primary');
    await expect(start).toHaveAttribute('href', '/learn/pak-choi/hydro/prepare?system=nft');
    await page.locator('.overview-reference > details').first().locator('summary').first().click();
    await expect(page.getByTestId('target-ph')).toBeVisible();
    await page.locator('.growing-age > summary').click();
    await expect(page.locator('.age-example')).toBeVisible();
    await start.click();
    const tutorial = getTutorial(crops[0], 'hydro', 'nft');
    await expect(page.getByRole('radio')).toHaveCount(0);
    await expect(page.locator('.focused-task')).toHaveText(tutorial.steps[0].tasks[0][language]);
    await page.locator('.focused-task-actions input').check();
    await page.locator('.focused-task-actions button').click();
    await expect(page.locator('.focused-task')).toHaveText(tutorial.steps[0].tasks[1][language]);
    await page.reload();
    await expect(page.locator('.focused-task')).toHaveText(tutorial.steps[0].tasks[1][language]);
    await page.locator('.focused-task-actions input').check();
    await page.locator('.focused-task-actions button').click();
    await page.locator('.focused-task-actions input').check();
    await expect(page.getByRole('radio')).toHaveCount(2);
    await page.getByRole('radio').nth(tutorial.steps[0].quiz.correct).check();
    await page.locator('.lesson-actions .primary').click();
    await expect(page).toHaveURL(/hydro\/sow\?system=nft/);
    await expect(page.locator('.lesson-progress')).toContainText('1/6');
    await expect(page.locator('.focused-task')).toHaveText(tutorial.steps[1].tasks[0][language]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(audit.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))).toEqual([]);
    await page.screenshot({ path: `artifacts/focused-lesson-${language}.png`, fullPage: true });
  });
}
