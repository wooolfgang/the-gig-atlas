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
  },
  hasGraphiQl: true,
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
};

export default config[env];
