require('dotenv').config();

const seedDataFromWeWorkRemotely = require('./scripts/weworkremotely');
const seedDataFromRemoteOk = require('./scripts/remoteok');
const seedDataFromStackOverflow = require('./scripts/stackoverflow');

async function seedGigs(threadTs) {
  return Promise.all([
    seedDataFromWeWorkRemotely(threadTs),
    seedDataFromRemoteOk(threadTs),
    seedDataFromStackOverflow(threadTs),
  ]);
}

module.exports = seedGigs;
