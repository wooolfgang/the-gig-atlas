/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/**
 * @IMPORTANT
 *  import config before prisma in order to load variables
 */

import { formatError } from 'graphql';
import dotenv from 'dotenv';
// loads .env variables
dotenv.config();

/**
 * @todo set prisma binding after lib error is fixed
 */
// const prisma = Prisma({
//   typeDefs: `${__dirname}/graphql/main.graphql`,
//   endpoint: 'http://localhost:4466',
//   secret: SECRET_PRISMA,
// });
const {
  NODE_ENV,
  CLIENT_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  SECRET_PRISMA,
  SECRET_USER,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ID_CLIENT_OAUTH,
  SECRET_CLIENT_OAUTH,
  REDIRECT_OAUTH_URI,
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
  cloudinary: {
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  },
  oauth: {
    idClient: ID_CLIENT_OAUTH,
    secretClient: SECRET_CLIENT_OAUTH,
    redirectURI: REDIRECT_OAUTH_URI || 'http://localhost:8080/api/googleauth',
  },
};

/**
 * @DEVELOPMENT
 */
const dev = {
  app: {
    port: 8080,
    morgan: 'dev',
  },
  testUrl: 'http://localhost:8080/gql',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  hasGraphiQl: true,
  hasDebug: true,
  gqlDebugger: error => {
    console.error('\nGQL ERROR DEBUGGER: => => =>');
    console.log('Message: ', error.message);
    console.log('positions: ', error.positions);
    console.log('path: ', error.path);
    console.log(error.stack);

    return formatError(error);
  },
  errLogger: (err, req, res, next) => {
    console.log('express error >>>>>>');
    console.log(err);
    next(err);
  }
};

/**
 * @TESTING
 */
const test = {
  app: {
    port: 7070,
    morgan: 'dev',
  },
  testUrl: 'http://localhost:7070/gql',
  hasDebug: true,
};

/**
 * @STAGING
 */
const staging = {
  // to be filled
};

/**
 * @PRODUCTION
 */
const production = {
  cors: {
    origin: CLIENT_URL,
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
  throw new Error(`Config Error, NODE_ENV="${NODE_ENV}", dev|staging|production|test`);
  process.exit(1);
}

const allconfig = { ...config[NODE_ENV], ...fromEnv };

export default allconfig;

/**
 * @references
 * guide source: https://codingsans.com/blog/node-config-best-practices
 */
