import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { crops, stages, tutorials } from '../src/data/garden';
test('crop search, difficulty, method routing and bilingual library', async ({ page }) => {
  await page.goto('/plants');
  await expect(page.locator('.crop-card')).toHaveCount(6);
  await page.getByRole('combobox', { name: 'Filter difficulty' }).selectOption('moderate');
  await expect(page.locator('.crop-card')).toHaveCount(2);
  await page.getByRole('combobox', { name: 'Filter difficulty' }).selectOption('all');
  await page.getByRole('textbox', { name: 'Search plants' }).fill('kangkung');
  await expect(page.locator('.crop-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Hydroponics', exact: true }).click();
  await page.getByRole('link', { name: 'View Water spinach growing guide' }).click();
  await expect(page.locator('.method-choice-buttons button.selected')).toContainText('Hydroponics');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kangkung');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
});
test('checklists and quizzes persist, separate growing methods, reset requires confirmation', async ({ page }) => {
  await page.goto('/learn/pak-choi/soil/prepare');
  const next = page.getByRole('button', { name: 'Complete & continue' });
  await expect(next).toBeDisabled();
  for (const input of await page.getByRole('checkbox').all()) await input.check();
  await page.getByRole('radio').nth(1).check();
  await expect(page.getByText('Take another look.')).toBeVisible();
  await expect(next).toBeDisabled();
  await page.getByRole('radio').nth(0).check();
  await next.click();
  await expect(page).toHaveURL(/soil\/sow$/);
  await page.reload();
  await expect(page.getByText('1/6 steps complete', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page).toHaveURL(/soil\/sow$/);
  await expect(page.getByText('1/6 langkah selesai', { exact: true })).toBeVisible();
  await page.goto('/learn/pak-choi/hydro/prepare');
  await expect(page.getByText('0/6 langkah selesai', { exact: true })).toBeVisible();
  for (const input of await page.getByRole('checkbox').all()) await expect(input).not.toBeChecked();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.goto('/progress');
  await expect(page.locator('.progress-row')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset learning progress', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Confirm progress reset' })).toBeVisible();
  await page.getByRole('button', { name: 'Keep my progress' }).click();
  await expect(page.locator('.progress-row')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset learning progress', exact: true }).click();
  await page.getByRole('button', { name: 'Yes, reset progress' }).click();
  await expect(page.locator('.progress-row')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('There’s room for something good.')).toBeVisible();
});
test('complete all six hydroponic steps and retain achievement after reload', async ({ page }) => {
  const tutorial = tutorials.find(t => t.id === 'lettuce:hydro')!;
  await page.goto('/learn/lettuce/hydro/prepare');
  for (const step of tutorial.steps) {
    await expect(page).toHaveURL(new RegExp(`hydro/${step.id}$`));
    await expect(page.getByRole('heading', { name: step.title.en, exact: true })).toBeVisible();
    for (const input of await page.getByRole('checkbox').all()) await input.check();
    await page.getByRole('radio').nth(step.quiz.correct).check();
    await page.getByRole('button', { name: step.id === 'harvest' ? 'Finish this guide' : 'Complete & continue' }).click();
  }
  await expect(page).toHaveURL(/progress$/);
  await page.reload();
  await expect(page.locator('.progress-row')).toContainText('6/6 steps complete');
  await expect(page.locator('.garden-stats')).toContainText('1guides finished');
});
test('real WebGL model, camera controls, cutaway, hotspots and diagram switch', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.stack || e.message));
  await page.goto('/learn/chilli/hydro/care');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reset camera' })).toBeVisible();
  for (const label of ['Rotate left', 'Rotate right', 'Zoom in', 'Zoom out', 'Reset camera']) await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('button', { name: 'Cutaway', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cutaway', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await page.locator('.part-buttons').getByRole('button', { name: 'Root zone' }).click();
  await expect(page.locator('.hotspot-explanation')).toContainText('air stone');
  await page.getByRole('button', { name: 'Diagram', exact: true }).click();
  await expect(page.locator('.static-diagram')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'View in 3D', exact: true }).click();
  await expect(page.locator('canvas')).toBeVisible();
  expect(errors).toEqual([]);
});
test('WebGL unavailable: diagram remains usable and instructions translate', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(context: string, ...args: unknown[]) {
      if (context === 'webgl' || context === 'webgl2') return null;
      return (original as Function).call(this, context, ...args);
    } as typeof original;
  });
  await page.goto('/learn/amaranth/hydro/transplant');
  await expect(page.locator('.static-diagram')).toBeVisible();
  await expect(page.getByRole('button', { name: 'View in 3D' })).toBeDisabled();
  await page.locator('.part-buttons').getByRole('button', { name: 'Root zone' }).click();
  await expect(page.locator('.hotspot-explanation')).toContainText('air gap');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Pindahkan ke rumah baru' })).toBeVisible();
  await expect(page.locator('.hotspot-explanation')).toContainText('celah udara');
});
test('all crop paths and step scenes exist in both languages', async ({ page }) => {
  await page.goto('/plants');
  for (const language of ['en', 'id'] as const) {
    await page.getByRole('button', { name: language === 'en' ? 'English' : 'Bahasa Indonesia', exact: true }).click();
    for (const crop of crops) for (const method of ['soil', 'hydro']) {
      await page.goto(`/learn/${crop.id}/${method}/harvest`);
      await expect(page.getByRole('heading', { name: language === 'en' ? 'Enjoy your first harvest' : 'Nikmati panen pertama' })).toBeVisible();
      await expect(page.getByRole('checkbox')).toHaveCount(3);
      await expect(page.getByRole('radio')).toHaveCount(2);
      await expect(page.locator('.step-nav a')).toHaveCount(6);
    }
  }
  for (const stage of stages) {
    await page.goto(`/learn/chives/hydro/${stage}`);
    await expect(page.locator('.step-nav .current')).toHaveAttribute('href', `/learn/chives/hydro/${stage}`);
    await expect(page.locator('.scene-caption')).toBeVisible();
  }
});
test('mobile layouts have no overflow, keyboard access, reduced motion and accessible pages', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/', '/plants', '/how-it-works', '/plants/pak-choi', '/learn/pak-choi/soil/sow', '/progress']) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
  }
  await page.goto('/plants');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.screenshot({ path: 'artifacts/mobile-library.png', fullPage: true });
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await page.setViewportSize({ width: 320, height: 740 });
  const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > window.innerWidth + 1).map(e => ({ tag: e.tagName, class: e.className, right: Math.round(e.getBoundingClientRect().right) })));
  expect(overflow).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await page.screenshot({ path: 'artifacts/desktop-library.png', fullPage: false });
});
test('unknown routes and storage denial fail gracefully', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('blocked'); }; });
  await page.goto('/learn/unknown/soil/prepare');
  await expect(page.getByRole('heading', { name: 'A path not planted yet.' })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('cannot save progress');
  await page.getByRole('link', { name: 'Explore plants', exact: true }).nth(1).click();
  await expect(page.locator('.crop-card')).toHaveCount(6);
});
