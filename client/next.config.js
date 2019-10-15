const withImages = require('next-images');
// const globalConfig = require('./config');

require('dotenv').config();

const { NODE_ENV, SERVER_URI } = process.env;
const fromEnv = {
  env: NODE_ENV,
};

const URL_PAYPAL_CDN = 'https://www.paypal.com/sdk/js?currency=USD&client-id=';

const development = {
  public: {
    paypalCDN: `${URL_PAYPAL_CDN}sb`,
    uriServer: SERVER_URI,
    gqlServer: `${SERVER_URI}/gql`,
  },
};

const test = {
  // to be filled
};

const staging = {
  // to be filled
};

const production = {
  // to be filled
  public: {
    paypalCDN: `${URL_PAYPAL_CDN}AWkdLY5smSbtUFamC_cCzsZKU5pKn-4_oj8WEWYKnjyhf0deCrPuUW1Q7I_pstmew16xWrLd4rNVwzr2`,
  },
};

const allConfig = {
  development,
  staging,
  production,
  test,
};

if (!allConfig[NODE_ENV]) {
  throw new Error(
    `Config Error, NODE_ENV="${NODE_ENV}", development|staging|production|test`,
  );
  // eslint-disable-next-line no-unreachable
  process.exit(1);
}

const currentConfig = { ...allConfig[NODE_ENV], ...fromEnv };

module.exports = withImages({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  serverRuntimeConfig: {
    ...currentConfig.server,
  },
  publicRuntimeConfig: {
    staticFolder: '/static',
    ...currentConfig.public,
  },
});
