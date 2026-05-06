import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3300";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure"
  },
  webServer: {
    command: "pnpm dev --hostname 127.0.0.1 --port 3300",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 960 }
      }
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"]
      }
    }
  ]
});
