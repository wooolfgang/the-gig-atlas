/* eslint-disable no-console */
/**
 * This file runs es6+ js files on the fly with @babel/register
 * command: $ yarn run dev
 */
console.log('Running Server on:', process.env.NODE_ENV);
// eslint-disable-next-line
require('@babel/register')({
  // extends: './.babelrc',
  ignore: [/node_modules/],
  rootMode: 'upward',
});

require('./src/index');
