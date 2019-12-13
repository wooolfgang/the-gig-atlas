/* eslint-disable no-unreachable */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/**
 * @IMPORTANT
 *  import config before prisma in order to load variables
 */

import { formatError } from 'graphql';
// import dotenv from 'dotenv';
// loads .env variables
// dotenv.config();

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
  ID_GOOGLE_OAUTH,
  SECRET_GOOGLE_OAUTH,
  ID_GITHUB_OAUTH,
  SECRET_GITHUB_OAUTH,
  PG_USER,
  PG_PASSWORD,
  PG_HOST,
  PG_DATABASE,
  PG_PORT,
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
  googleOauth: {
    id: ID_GOOGLE_OAUTH,
    secret: SECRET_GOOGLE_OAUTH,
    redirectURI: 'http://localhost:3000/auth/google',
  },
  githubOauth: {
    id: ID_GITHUB_OAUTH,
    secret: SECRET_GITHUB_OAUTH,
    redirectURI: 'http://localhost:3000/auth/github',
  },
  pg: {
    user: PG_USER,
    password: PG_PASSWORD,
    host: PG_HOST,
    database: PG_DATABASE,
    port: parseInt(PG_PORT, 10),
  }
};

/**
 * @DEVELOPMENT
 */
function gqlDebugger(error) {
  console.error('\nGQL ERROR DEBUGGER: => => =>');
  console.log('Message: ', error.message);
  console.log('positions: ', error.positions);
  console.log('path: ', error.path);
  console.log(error.stack);

  return formatError(error);
}

const dev = {
  app: {
    port: 8080,
    morgan: 'dev',
  },
  testUrl: 'http://localhost:8080/gql',
  cors: {
    origin: [
      'http://localhost:3000',
      'http://staging.thegigatlas.com',
      'https://staging.thegigatlas.com',
    ],
    credentials: true,
  },
  hasGraphiQl: true,
  hasDebug: true,
  gqlDebugger,
  payment: {
    paypal: {
      id: 'AWkdLY5smSbtUFamC_cCzsZKU5pKn-4_oj8WEWYKnjyhf0deCrPuUW1Q7I_pstmew16xWrLd4rNVwzr2',
      secret: 'EEsal9cGGZ10uCKRqUS_W096gnMjq-E-y7Au-RZeE7HtAD6vNYsC4Y-hkVlJG1YOUBa7nX-ihm2i7dYQ',
      uri: 'https://api.sandbox.paypal.com', // set dev to -> [https://api.paypal.com]
    },
  },
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
  payment: dev.payment,
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
  payment: {
    paypal: {
      /**
       * @todo: set id, secret soon
       */
      id: '',
      secret: '',
      uri: 'https://api.paypal.com',
    }
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

module.exports = allconfig;
export default allconfig;

/**
 * @references
 * guide source: https://codingsans.com/blog/node-config-best-practices
 */
