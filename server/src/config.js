/**
 * guide source: https://codingsans.com/blog/node-config-best-practices
 * /
 * IMPORTANT: import config before prisma in order to load variables
 */

import dotenv from 'dotenv';

// loads secret .env variables
dotenv.config();

const {
  NODE_ENV,
  SECRET_PRISMA,
  SECRET_USER,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  CLIENT_URL,
} = process.env;

const fromEnv = {
  env: NODE_ENV,
  secretPrisma: SECRET_PRISMA,
  secretUser: SECRET_USER,
  admin: {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  },
  clientUrl: CLIENT_URL,
};

const dev = {
  app: {
    port: 8080,
    morgan: 'dev',
  },
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
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
  cors: {
    origin: [CLIENT_URL],
    credentials: true,
  },
};

const config = {
  dev,
  staging,
  production,
  test,
};

if (!config[NODE_ENV]) {
  // eslint-disable-next-line prettier/prettier
  throw new Error(`Config Error, NODE_ENV="${NODE_ENV}", dev|staging|production|test`);
  // eslint-disable-next-line no-unreachable
  process.exit(1);
}

export default { ...config[NODE_ENV], ...fromEnv };
