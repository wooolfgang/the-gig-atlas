// eslint-disable-next-line
require('@babel/register')({
  ignore: [/node_modules/],
  rootMode: 'upward',
});

require('./src/test');
