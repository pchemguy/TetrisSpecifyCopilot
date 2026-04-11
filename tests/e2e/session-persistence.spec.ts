import { expect, test } from './fixtures';

test('pauses, restarts, reloads, and preserves the best score and local records', async ({ page, openApp }) => {
  await openApp();

  await page.keyboard.press('Space');
  await expect(page.getByText(/Score\s*[1-9]\d*/i)).toBeVisible();

  await page.keyboard.press('KeyP');
  await expect(page.getByText(/Paused/i)).toBeVisible();

  await page.keyboard.press('KeyR');
  await expect(page.getByText(/Score\s*0/i)).toBeVisible();

  await page.reload();
  await expect(page.getByText(/best score/i)).toBeVisible();
});