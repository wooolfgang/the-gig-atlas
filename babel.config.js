const presets = [
  [
    '@babel/env',
    {
      targets: {
        edge: '17',
        firefox: '60',
        chrome: '67',
        safari: '11.1',
        node: 'current',
      },
    },
  ],
];

const plugins = ['@babel/plugin-transform-modules-commonjs'];

module.exports = { presets, plugins };
