require('dotenv').config();

module.exports = {
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    staticFolder: '/static',
    serverUri: process.env.SERVER_URI,
  },
};
