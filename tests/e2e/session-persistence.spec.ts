import { expect, test } from './fixtures';

test('pauses, restarts, reloads, and preserves the best score and local records', async ({ page, openApp }) => {
  await openApp();

  const scorePanel = page.getByRole('region', { name: 'Score panel' });

  await expect(page.getByLabel('Classic Browser Tetris board')).toBeVisible();

  await page.keyboard.press('Space');
  await page.keyboard.press('Space');
  await expect(scorePanel.locator('dd').nth(0)).not.toHaveText('0');

  await page.keyboard.press('KeyP');
  await expect(page.getByText(/Paused/i)).toBeVisible();

  await page.keyboard.press('KeyR');
  await expect(scorePanel.locator('dd').nth(0)).toHaveText('0');

  await page.reload();
  await expect(page.getByText(/best score/i)).toBeVisible();
});

test('continues local gameplay after browser networking is disabled post-load', async ({ page, openApp }) => {
  await openApp();

  const scorePanel = page.getByRole('region', { name: 'Score panel' });

  await expect(page.getByLabel('Classic Browser Tetris board')).toBeVisible();

  await page.context().setOffline(true);

  await page.keyboard.press('Space');
  await expect(scorePanel.locator('dd').nth(0)).not.toHaveText('0');

  await page.keyboard.press('KeyP');
  await expect(page.getByText(/Paused/i)).toBeVisible();

  await page.keyboard.press('KeyR');
  await expect(scorePanel.locator('dd').nth(0)).toHaveText('0');

  await expect(page.getByText(/best score/i)).toBeVisible();

  await page.context().setOffline(false);
});