/**
 * guide source: https://codingsans.com/blog/node-config-best-practices
 */

 import dotenv from 'dotenv';

 dotenv.config(); // loads secret .env variables 

const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: parseInt(process.env.SECRET_DEV_PORT) || 8080,
  },
}

const config = {
  dev,
};

export default config[env];
