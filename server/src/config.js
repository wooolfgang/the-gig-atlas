/**
 * guide source: https://codingsans.com/blog/node-config-best-practices
 * /
 * IMPORTANT: import config before prisma in order to load variables
 */

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
};

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
    // eslint-disable-next-line no-console
    console.log('\n----------------------------->');
    console.log(error);
    console.log('------------------------------->');

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
  testUrl: 'http://localhost:7070/gql',
  hasDebug: true,
};

const staging = {
  // to be filled
};

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
  // eslint-disable-next-line prettier/prettier
  throw new Error(`Config Error, NODE_ENV="${NODE_ENV}", dev|staging|production|test`);
  // eslint-disable-next-line no-unreachable
  process.exit(1);
}

export default { ...config[NODE_ENV], ...fromEnv };
