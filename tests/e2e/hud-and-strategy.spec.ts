import { expect, test } from './fixtures';

test('uses hold, observes preview changes, and preserves HUD updates during play', async ({ page, openApp }) => {
  await openApp();

  await expect(page.getByText(/Next piece/i)).toBeVisible();
  await expect(page.getByText(/Held piece/i)).toBeVisible();
  await expect(page.getByText(/Controls/i)).toBeVisible();

  await page.keyboard.press('KeyC');
  await expect(page.getByText(/Held piece/i)).toBeVisible();

  const previewBeforeDrop = await page.getByText(/Next piece/i).locator('..').textContent();

  await page.keyboard.press('Space');

  const previewAfterDrop = await page.getByText(/Next piece/i).locator('..').textContent();

  expect(previewBeforeDrop).not.toBe(previewAfterDrop);
  await expect(page.getByText(/Score\s*[1-9]\d*/i)).toBeVisible();
  await expect(page.getByText(/Input latency/i)).toBeVisible();
});