import { expect, test } from './fixtures';

test('plays a keyboard-driven run from fresh start to game over', async ({ page, openApp }) => {
  await openApp();

  const scorePanel = page.getByRole('region', { name: 'Score panel' });

  await expect(page.getByLabel('Classic Browser Tetris board')).toBeVisible();
  await expect(scorePanel.locator('dd').nth(0)).toHaveText('0');
  await expect(scorePanel.locator('dd').nth(2)).toHaveText('1');
  await expect(scorePanel.locator('dd').nth(3)).toHaveText('0');

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Space');

  await expect(scorePanel.locator('dd').nth(0)).not.toHaveText('0');

  await page.keyboard.press('KeyP');
  await expect(page.getByText(/paused/i)).toBeVisible();
  await page.keyboard.press('KeyP');

  for (let index = 0; index < 32; index += 1) {
    await page.keyboard.press('Space');
  }

  await expect(page.getByText(/game over/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Restart' })).toBeVisible();
});