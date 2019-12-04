/* eslint-disable no-unreachable */
/* eslint-disable global-require */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  // extends: './.babelrc',
  ignore: [/node_modules/],
  rootMode: 'upward',
});

const planModule = require('./plan');

const seeds = {
  admin: require('./admin').default,
  plan: planModule.default,
  'test-plan': planModule.dailyTestPlan,
  thread: require('./thread').default,
  threadTag: require('./threadTag').default,
  'db-config': require('./db_config').default,
  gig: require('./gig').default,
  tag: require('./tag').default,
};

const toSeeds = [];

process.argv.forEach((arg, i) => {
  if (i > 1) {
    const seed = seeds[arg];
    if (!seed) {
      throw new Error(`No seed found: ${arg}`);
      process.exit(1);
    } else {
      toSeeds.push({
        seed,
        name: arg,
      });
    }
  }
});

if (toSeeds.length === 0) {
  throw new Error('No provided seed arguments');
} else {
  toSeeds.forEach(({ seed, name }) => {
    console.log(`\nSeeding on ${name}...`);
    seed();
  });
}
