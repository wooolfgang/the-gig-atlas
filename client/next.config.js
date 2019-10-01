const withImages = require('next-images');
const globalConfig = require('./config');

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
    ...globalConfig.public,
  },
});
