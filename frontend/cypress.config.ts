import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/', // Change to your app's URL
    defaultCommandTimeout: 10000,     // Wait up to 10 seconds for commands to complete
    pageLoadTimeout: 60000,           // Wait up to 60 seconds for the page to load
    requestTimeout: 15000,            // Wait up to 15 seconds for API requests
    responseTimeout: 15000,           // Wait up to 15 seconds for API responses
  },
});
