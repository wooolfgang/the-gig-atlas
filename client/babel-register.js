/**
 * This file runs es6+ js files on the fly with @babel/register
 * command: $ yarn run dev
 */

// eslint-disable-next-line
require('@babel/register')({
  // extends: './.babelrc',
  ignore: [/node_modules/],
  rootMode: 'upward',
});
