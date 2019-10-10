const withImages = require('next-images');
const withCSS = require('@zeit/next-css');
const globalConfig = require('./config');

const nextConfig = {
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
};

module.exports = withCSS(withImages(nextConfig));
