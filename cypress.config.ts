import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents: (
      on: Cypress.PluginEvents,
      config: Cypress.PluginConfigOptions,
    ): Cypress.PluginConfigOptions => {
      // load env from json
      const version: string = config.env['version'] || 'dev';
      config.env = require(`./cypress/config/${version}.json`);

      // change baseUrl
      config.baseUrl = config.env['baseUrl'];
      return config;
    },
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/tests/**/*.cy.ts',
    viewportHeight: 1080,
    viewportWidth: 1920,
  },
  fixturesFolder: 'cypress/fixtures',
});
