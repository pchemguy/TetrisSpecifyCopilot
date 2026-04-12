import { expect, test } from './fixtures';

test('pauses, restarts, reloads, and keeps the best score hidden until a record exists', async ({ page, openApp }) => {
  await openApp();

  const scorePanel = page.getByRole('region', { name: 'Score panel' });
  const bestScorePanel = page.getByLabel('Best score panel');

  await expect(page.getByLabel('Classic Browser Tetris board')).toBeVisible();

  await page.keyboard.press('Space');
  await page.keyboard.press('Space');
  await expect(scorePanel.locator('dd').nth(0)).not.toHaveText('0');

  await page.keyboard.press('KeyP');
  await expect(page.getByText(/Paused/i)).toBeVisible();

  await page.keyboard.press('KeyR');
  await expect(scorePanel.locator('dd').nth(0)).toHaveText('0');

  await page.reload();
  await expect(bestScorePanel).toHaveCount(0);
});

test('continues local gameplay after browser networking is disabled post-load without surfacing an unearned best score', async ({ page, openApp }) => {
  await openApp();

  const scorePanel = page.getByRole('region', { name: 'Score panel' });
  const bestScorePanel = page.getByLabel('Best score panel');

  await expect(page.getByLabel('Classic Browser Tetris board')).toBeVisible();

  await page.context().setOffline(true);

  await page.keyboard.press('Space');
  await expect(scorePanel.locator('dd').nth(0)).not.toHaveText('0');

  await page.keyboard.press('KeyP');
  await expect(page.getByText(/Paused/i)).toBeVisible();

  await page.keyboard.press('KeyR');
  await expect(scorePanel.locator('dd').nth(0)).toHaveText('0');

  await expect(bestScorePanel).toHaveCount(0);

  await page.context().setOffline(false);
});