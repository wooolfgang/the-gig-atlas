/* eslint-disable import/no-extraneous-dependencies */
/**
 * Global setup before jest test is run
 * followed by global-teardown after test ends
 */

const { setup: setupDevServer } = require('jest-dev-server');

module.exports = async function globalSetup() {
  await setupDevServer({
    command: 'node -r dotenv/config babel-register.js',
    launchTimeout: 50000,
    debug: true,
    port: 7070,
  });
};
