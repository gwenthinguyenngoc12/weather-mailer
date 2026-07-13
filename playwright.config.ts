import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    timeout: 120000,
    use: {
        headless: false,

        // Tạo trace khi test
        trace: "on",

        // Optional: lưu screenshot khi fail
        screenshot: "on",

        // Optional: lưu video khi fail
        video: "on",
    },
     projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});