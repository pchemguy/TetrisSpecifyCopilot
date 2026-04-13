import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(currentDirectory, '..');
const electronCliPath = path.join(repositoryRoot, 'node_modules', 'electron', 'cli.js');
const electronEntryPath = path.join(repositoryRoot, 'dist-electron', 'electron', 'main.js');

const child = spawn(process.execPath, [electronCliPath, electronEntryPath], {
  cwd: repositoryRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_DEV_SERVER_URL: process.env.VITE_DEV_SERVER_URL ?? 'http://127.0.0.1:4173',
  },
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});