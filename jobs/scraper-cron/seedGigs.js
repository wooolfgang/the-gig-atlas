require('dotenv').config();

const seedDataFromWeWorkRemotely = require('./scripts/weworkremotely');
const seedDataFromRemoteOk = require('./scripts/remoteok');

async function seedGigs(threadTs) {
  return Promise.all([
    seedDataFromWeWorkRemotely(threadTs),
    seedDataFromRemoteOk(threadTs),
  ]);
}

module.exports = seedGigs;
