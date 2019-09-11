/**
 * guide source: https://codingsans.com/blog/node-config-best-practices
 */

import dotenv from 'dotenv';

dotenv.config(); // loads secret .env variables

const env = process.env.NODE_ENV;

const dev = { };

const config = {
  dev,
};

export default config[env];
