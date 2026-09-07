import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 2,
  timeout: 20_000,
  reporter: [
    ["list"],
    ["json", { outputFile: "output/playwright/results.json" }],
  ],
  outputDir: "output/playwright/results",
  use: {
    baseURL: "http://127.0.0.1:4319",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4319",
    url: "http://127.0.0.1:4319",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
