import { test as base, expect } from '@playwright/test';

type AppFixtures = {
  openApp: () => Promise<void>;
};

export const test = base.extend<AppFixtures>({
  openApp: async ({ page, baseURL }, use) => {
    await use(async () => {
      await page.goto(baseURL ?? '/');
    });
  },
});

export { expect };