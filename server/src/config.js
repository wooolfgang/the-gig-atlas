/**
 * guide source: https://codingsans.com/blog/node-config-best-practices
 */

import dotenv from 'dotenv';

// loads secret .env variables
dotenv.config();

const { NODE_ENV, ADMIN_SECRET, EMPLOYER_SECRET } = process.env;

const fromEnv = {
  env: NODE_ENV,
  adminSecret: ADMIN_SECRET,
  employerSecret: EMPLOYER_SECRET,
};

const dev = {
  app: {
    port: 8080,
    morgan: 'dev',
  },
  hasGraphiQl: true,
  hasDebug: true,
  gqlDebugger: error => {
    // eslint-disable-next-line no-console
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
    // temporary not being used as it does not countain server debug
    port: 7070,
    morgan: 'dev',
  },
  testUrl: 'http://localhost:8080/gql',
  isConnectionJump: true,
  hasDebug: true,
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

if (!config[NODE_ENV]) {
  // eslint-disable-next-line prettier/prettier
  throw new Error(`Config Error, NODE_ENV="${NODE_ENV}", [dev|staging|production|test]`);
  // eslint-disable-next-line no-unreachable
  process.exit(1);
}

export default { ...config[NODE_ENV], ...fromEnv };
