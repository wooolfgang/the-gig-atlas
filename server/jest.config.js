// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  // extends: './.babelrc',
  ignore: [/node_modules/],
  rootMode: 'upward',
});

const config = require('./jest-config/jest.config');

module.exports = config;

/**
 * cumbersome workaround source: https://github.com/facebook/jest/issues/5164#issuecomment-366139663
 */
