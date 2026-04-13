export interface WindowsWorkflowCommands {
  browserDev: string;
  desktopDev: string;
  build: string;
  packageWin: string;
  browserRegression: string;
}

const WINDOWS_WORKFLOW_COMMANDS: WindowsWorkflowCommands = {
  browserDev: 'npm run dev:web',
  desktopDev: 'npm run dev',
  build: 'npm run build',
  packageWin: 'npm run dist:win',
  browserRegression: 'npx playwright test tests/e2e/core-gameplay.spec.ts tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line',
};

export function readWindowsWorkflowCommands(): WindowsWorkflowCommands {
  return WINDOWS_WORKFLOW_COMMANDS;
}

export function createWindowsArtifactPath(productName: string): string {
  return `release/win-unpacked/${productName}.exe`;
}

export function createLoopbackOrigin(port: number): string {
  return `http://127.0.0.1:${port}`;
}