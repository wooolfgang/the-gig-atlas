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
 * the order of the seeds matter, when running
 * yarn run seed:dev, the script is run
 * synchronously according to its order
 */
const dev = {
  'test-plan': planModule.dailyTestPlan,
  tag: require('./dev/tag').default,
  gig: require('./dev/gig').default,
  gig2: require('./dev/gig2').default,
  plan: planModule.default,
  threadTag: require('./dev/threadTag').default,
  thread: require('./dev/thread').default,
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
};

const toSeeds = [];

const [_0, _1, ...seedArgs] = process.argv;

if (seedArgs && seedArgs.length > 0) {
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
} else {
  // Run all seed scripts sequentially if no argument is found
  const seedsFromEnv = Object.keys(envSeeds[NODE_ENV]);
  const seedsFromDefault = Object.keys(seeds);

  for (let i = 0; i < seedsFromDefault.length; i += 1) {
    const name = seedsFromDefault[i];
    const seed = seeds[name];
    toSeeds.push({
      seed,
      name,
    });
  }

  for (let i = 0; i < seedsFromEnv.length; i += 1) {
    const name = seedsFromEnv[i];
    const seed = envSeeds[NODE_ENV][name];
    toSeeds.push({
      seed,
      name,
    });
  }
}

if (toSeeds.length === 0) {
  console.log('\n No seeds founds');
  process.exit(0);
} else {
  (async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const seed of toSeeds) {
      console.log(`\nSeeding on ${seed.name}...`);
      // eslint-disable-next-line no-await-in-loop
      await seed.seed();
    }
    console.log(' \n Successfully run seed scripts');
  })();
}
