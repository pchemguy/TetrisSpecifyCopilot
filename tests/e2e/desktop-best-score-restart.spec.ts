import { expect, test } from './fixtures';

test('persists a newly saved best score across a desktop-style restart', async ({ page, openApp }) => {
  await page.addInitScript(() => {
    const storageKey = 'desktop-best-score-state';
    const loadState = () => {
      const serialized = window.localStorage.getItem(storageKey);

      if (!serialized) {
        return { bestScore: 0, hasCompletedGame: false };
      }

      return JSON.parse(serialized) as { bestScore: number; hasCompletedGame: boolean };
    };

    const saveState = (state: { bestScore: number; hasCompletedGame: boolean }) => {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    };

    window.__TAURI_INTERNALS__ = {
      invoke: async (command: string, payload?: Record<string, unknown>) => {
        const currentState = loadState();

        if (command === 'load_best_score_state') {
          return {
            bestScore: currentState.bestScore,
            hasCompletedGame: currentState.hasCompletedGame,
            showBestScore: currentState.hasCompletedGame,
            storageMode: 'portable_adjacent',
            notice: null,
          };
        }

        if (command === 'submit_game_over_score') {
          const finalScore = Number(payload?.finalScore ?? 0);
          const isNewBest = finalScore > currentState.bestScore;
          const nextState = {
            bestScore: isNewBest ? finalScore : currentState.bestScore,
            hasCompletedGame: true,
          };

          saveState(nextState);

          return {
            bestScore: nextState.bestScore,
            hasCompletedGame: true,
            isNewBest,
            showCongratulations: isNewBest,
            showBestScore: true,
          };
        }

        throw new Error(`Unexpected Tauri command: ${command}`);
      },
      transformCallback: () => 0,
      unregisterCallback: () => undefined,
      convertFileSrc: (filePath: string) => filePath,
    };
  });

  await openApp();

  const scorePanel = page.getByRole('region', { name: 'Score panel' });

  await expect(page.getByLabel('Classic Browser Tetris board')).toBeVisible();
  await expect(page.getByLabel('Best score panel')).toBeHidden();

  for (let index = 0; index < 32; index += 1) {
    await page.keyboard.press('Space');
  }

  await expect(page.getByText(/congratulations/i)).toBeVisible();
  await expect(scorePanel.locator('dd').nth(1)).not.toHaveText('0');

  await page.reload();

  await expect(page.getByLabel('Best score panel')).toBeVisible();
  await expect(page.getByLabel('Best score panel')).not.toHaveText('0');
});