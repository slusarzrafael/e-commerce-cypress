const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1365,
  viewportHeight: 900,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  screenshotOnRunFailure: true,
  video: true,
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    testIsolation: true,
    setupNodeEvents(on) {
      on("after:spec", (spec, results) => {
        const failed = results?.tests.some((test) =>
          test.attempts.some((attempt) => attempt.state === "failed")
        );
        if (results?.video && failed === false) {
          require("node:fs").unlinkSync(results.video);
        }
      });
    },
  },
});
