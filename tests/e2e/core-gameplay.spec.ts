import { expect, test } from './fixtures';

test('plays a keyboard-driven run from fresh start to game over', async ({ page, openApp }) => {
  await openApp();

  await expect(page.getByLabel('Classic Browser Tetris board')).toBeVisible();
  await expect(page.getByText(/Score\s*0/i)).toBeVisible();
  await expect(page.getByText(/Level\s*1/i)).toBeVisible();
  await expect(page.getByText(/Lines\s*0/i)).toBeVisible();

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Space');

  await expect(page.getByText(/Score\s*[1-9]\d*/i)).toBeVisible();

  await page.keyboard.press('KeyP');
  await expect(page.getByText(/paused/i)).toBeVisible();
  await page.keyboard.press('KeyP');

  for (let index = 0; index < 32; index += 1) {
    await page.keyboard.press('Space');
  }

  await expect(page.getByText(/game over/i)).toBeVisible();
  await expect(page.getByText(/restart/i)).toBeVisible();
});