module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
    devtools: true,
  },
  server: {
    command: 'NODE_ENV=test node babel-register.js',
  },
};
