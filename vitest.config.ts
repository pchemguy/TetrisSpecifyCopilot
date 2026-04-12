import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.spec.{ts,tsx}'],
    exclude: ['tests/e2e/**'],
    css: true,
    setupFiles: ['./tests/setup/vitest.setup.ts'],
  },
});