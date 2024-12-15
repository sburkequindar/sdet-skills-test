// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    headless: false,  // Run in non-headless mode
    browserName: 'chromium',  // Default browser
    viewport: { width: 1280, height: 720 },  // Set browser window size
  },
});