import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { _electron as electron } from '@playwright/test';
import { expect, test } from './fixtures';

const currentFilePath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(currentFilePath), '..', '..');
const electronEntrypoint = path.join(repositoryRoot, 'dist-electron', 'electron', 'main.js');

test.beforeAll(() => {
  execSync('npm run build:electron', {
    cwd: repositoryRoot,
    stdio: 'inherit',
  });
});

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

test('preserves desktop best score across a full Electron relaunch', async ({ baseURL }) => {
  const userDataDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'tetris-desktop-e2e-'));

  const launchDesktopApplication = () => electron.launch({
    args: [electronEntrypoint],
    env: {
      ...process.env,
      TETRIS_USER_DATA_DIR: userDataDirectory,
      VITE_DEV_SERVER_URL: baseURL ?? 'http://127.0.0.1:4173',
    },
  });

  const firstRun = await launchDesktopApplication();
  let recordedBestScore = '0';

  try {
    const window = await firstRun.firstWindow();
    const scorePanel = window.getByRole('region', { name: 'Score panel' });

    await expect(window.getByLabel('Classic Browser Tetris board')).toBeVisible();

    for (let index = 0; index < 32; index += 1) {
      await window.keyboard.press('Space');
    }

    await expect(window.getByText(/game over/i)).toBeVisible();
    recordedBestScore = await scorePanel.locator('dd').nth(1).textContent() ?? '0';
    expect(recordedBestScore).not.toBe('0');
  } finally {
    await firstRun.close();
  }

  const secondRun = await launchDesktopApplication();

  try {
    const window = await secondRun.firstWindow();
    const scorePanel = window.getByRole('region', { name: 'Score panel' });

    await expect(window.getByLabel('Classic Browser Tetris board')).toBeVisible();
    await expect(scorePanel.locator('dd').nth(1)).toHaveText(recordedBestScore);
  } finally {
    await secondRun.close();
    fs.rmSync(userDataDirectory, { recursive: true, force: true });
  }
});