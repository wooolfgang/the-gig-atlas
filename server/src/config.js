/**
 * guide source: https://codingsans.com/blog/node-config-best-practices
 */

import dotenv from 'dotenv';

// loads secret .env variables
dotenv.config();

const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: 8080,
    morgan: 'dev',
  },
  hasGraphiQl: true,
  gqlDebugger: error => {
    console.log(error);

    return {
      message: error.message,
      locations: error.locations,
      stack: error.stack ? error.stack.split('\n') : [],
      path: error.path,
    };
  },
};

const test = {
  app: {
    port: 7070,
    morgan: 'dev',
  },
  testUrl: 'http://localhost:8080/gql',
  isConnectionJump: true,
};

const staging = {
  // to be filled
};

const production = {
  // to be filled
};

const config = {
  dev,
  staging,
  production,
  test,
};

if (!config[env]) {
  throw new Error('Invalid NODE_ENV value');
}

export default config[env];
