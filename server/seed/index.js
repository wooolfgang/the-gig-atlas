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

const { NODE_ENV } = process.env;

/**
 * modules for production seeds should be put here
 */
const prod = {};

/**
 * modules for development seeds should be put here
 */
const dev = {
  'test-plan': planModule.dailyTestPlan,
  gig: require('./dev/gig').default,
  tag: require('./dev/tag').default,
  plan: planModule.default,
  thread: require('./dev/thread').default,
  threadTag: require('./dev/threadTag').default,
  technologyTag: require('./dev/technologyTag').default,
};

const envSeeds = {
  dev,
  production: prod,
};

/**
 * modules for both produciton and development seeds should be put here
 */
const seeds = {
  admin: require('./admin').default,
  'db-config': require('./db_config').default,
};

const toSeeds = [];

const [_0, _1, ...seedArgs] = process.argv;
seedArgs.forEach(arg => {
  let seed = seeds[arg];

  if (!seed) {
    try {
      seed = envSeeds[NODE_ENV][arg];
    } catch (e) {
      throw new Error(`Invalid NODE_ENV=${NODE_ENV}`);
    }
  }

  if (!seed) {
    throw new Error(`No seed found: ${arg}`);
    process.exit(1);
  } else {
    toSeeds.push({
      seed,
      name: arg,
    });
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
