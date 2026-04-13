import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { _electron as electron, expect, test } from '@playwright/test';

const currentFilePath = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(currentFilePath), '..', '..');
const electronEntrypoint = path.join(repositoryRoot, 'dist-electron', 'electron', 'main.js');

test.beforeAll(() => {
  execSync('npm run build:electron', {
    cwd: repositoryRoot,
    stdio: 'inherit',
  });
});

test('launches the desktop shell and remains playable offline after load', async ({ baseURL }) => {
  const application = await electron.launch({
    args: [electronEntrypoint],
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: baseURL ?? 'http://127.0.0.1:4173',
    },
  });

  try {
    const window = await application.firstWindow();
    const scorePanel = window.getByRole('region', { name: 'Score panel' });

    await expect(window.getByLabel('Classic Browser Tetris board')).toBeVisible();
    await expect(window.getByText(/Runtime desktop\/(win32|darwin|linux) v/i)).toBeVisible();

    await window.context().setOffline(true);
    await window.keyboard.press('Space');
    await expect(scorePanel.locator('dd').nth(0)).not.toHaveText('0');
  } finally {
    await application.close();
  }
});