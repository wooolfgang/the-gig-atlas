/**
 * guide source: https://codingsans.com/blog/node-config-best-practices
 */

import dotenv from 'dotenv';

dotenv.config(); // loads secret .env variables

const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: parseInt(process.env.SECRET_DEV_PORT, 10) || 8080,
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
