const express = require('express');
const cron = require('node-cron');

const app = express();

const seedDataFromWeWorkRemotely = require('./seeds/weworkremotely');
const seedDataFromRemoteOk = require('./seeds/remoteok');

/* Run cron job every 12 hours */
cron.schedule('0 0 */12 * * *', async () => {
  console.log('Running seed-gig cron task...');
  await Promise.all([seedDataFromWeWorkRemotely(), seedDataFromRemoteOk()]);
  console.log('Ended seed-gig cron task...');
});

app.listen(5000);
