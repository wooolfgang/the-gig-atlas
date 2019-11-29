/**
 * Injects the .env variables from where the prisma-client is run,
 * NOT the env variables in this repository
 * Ex: Run this on server, it will use the .env variables on server package
 */
require('dotenv').config();

const prismaClient = require('./prisma-client/index.js');

module.exports = prismaClient.prisma;
