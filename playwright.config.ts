import { defineConfig, devices } from "@playwright/test";
import { BASE_URL, PORT, serverEnv } from "./e2e/env";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: BASE_URL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Prepara la base, compila y arranca la app de producción en un puerto propio.
    command: `npx tsx e2e/setup.ts && npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    env: serverEnv,
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
