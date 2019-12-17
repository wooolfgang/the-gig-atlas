const seedDataFromWeWorkRemotely = require('./scripts/weworkremotely');
const seedDataFromRemoteOk = require('./scripts/remoteok');

async function seedGigs() {
  return Promise.all([seedDataFromWeWorkRemotely(), seedDataFromRemoteOk()]);
}

module.exports = seedGigs;
