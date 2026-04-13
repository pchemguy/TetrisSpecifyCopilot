import { describe, expect, it } from 'vitest';
import {
  createLoopbackOrigin,
  createWindowsArtifactPath,
  readWindowsWorkflowCommands,
} from '../../../src/platform/windowsRuntime';

describe('windows runtime helpers', () => {
  it('returns the documented Windows workflow commands', () => {
    expect(readWindowsWorkflowCommands()).toEqual({
      browserDev: 'npm run dev:web',
      desktopDev: 'npm run dev',
      build: 'npm run build',
      packageWin: 'npm run dist:win',
      browserRegression: 'npx playwright test tests/e2e/core-gameplay.spec.ts tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line',
    });
  });

  it('builds the Windows unpacked desktop artifact path with forward slashes', () => {
    expect(createWindowsArtifactPath('Tetris Specify Copilot')).toBe(
      'release/win-unpacked/Tetris Specify Copilot.exe',
    );
  });

  it('builds the loopback origin used by the supported Windows browser workflow', () => {
    expect(createLoopbackOrigin(4173)).toBe('http://127.0.0.1:4173');
  });
});