/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  // extends: './.babelrc',
  ignore: [/node_modules/],
  rootMode: 'upward',
});

const seeds = {
  // eslint-disable-next-line global-require
  admin: require('./admin').default,
};

process.argv.forEach((arg, i) => {
  if (i > 1) {
    console.log('Seed on: ', arg);
    seeds[arg]();
  }
});
