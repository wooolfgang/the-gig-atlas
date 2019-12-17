const express = require('express');
const cron = require('node-cron');

const app = express();
const seedGigs = require('./seedGigs');

/* Run cron job every 2 hours */
cron.schedule('* * */2 * *', async () => {
  console.log('Running seed-gig cron task...');
  await seedGigs();
  console.log('Ended seed-gig cron task...');
});

const port = 5000;
app.listen(port, () => {
  console.log(`Cron server is live at port ${port} 🚀`);
});
