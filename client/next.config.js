const withImages = require('next-images');

require('dotenv').config();

module.exports = withImages({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  serverRuntimeConfig: {},
  publicRuntimeConfig: {
    staticFolder: '/static',
    serverUri: process.env.SERVER_URI,
  },
});
