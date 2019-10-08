/* eslint-disable no-unreachable */
require('dotenv').config();

const { NODE_ENV, SERVER_URI } = process.env;

const fromEnv = {
  env: NODE_ENV,
};

const development = {
  public: {
    uriServer: SERVER_URI,
    uriServerGql: `${SERVER_URI}/gql`,
  },
};

const test = {
  // to be filled
};

const staging = {
  // to be filled
};

const production = {
  public: {
    uriServer: SERVER_URI,
    uriServerGql: `${SERVER_URI}/gql`,
  },
};

const config = {
  development,
  staging,
  production,
  test,
};

if (!config[NODE_ENV]) {
  throw new Error(
    `Config Error, NODE_ENV="${NODE_ENV}", development|staging|production|test`,
  );
  process.exit(1);
}

const allconfig = { ...config[NODE_ENV], ...fromEnv };

module.exports = allconfig;
