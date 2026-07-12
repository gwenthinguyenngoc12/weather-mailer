import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    timeout: 120000,
    use: {
        headless: false,

        // Tạo trace khi test
        trace: "on",

        // Optional: lưu screenshot khi fail
        screenshot: "only-on-failure",

        // Optional: lưu video khi fail
        video: "retain-on-failure",
    },
});