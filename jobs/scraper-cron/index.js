const express = require('express');
const cron = require('node-cron');

const app = express();
require('dotenv').config();

const seedGigs = require('./seedGigs');
const sendSlackMessage = require('./utils/sendSlackMessage');

/* Run cron job every 2 hours */
cron.schedule('0 0 */2 * * *', async () => {
  const startMessage = `Running seed-gig cron task... ${new Date()}`;
  console.log(startMessage);

  let threadTs;

  try {
    const res = await sendSlackMessage(startMessage);
    const resJSON = await res.json();
    threadTs = resJSON.message.ts;
  } catch (e) {
    console.log('Failed to send message on slack');
  }

  await seedGigs(threadTs);

  const endMessage = `
  Ended seed-gig cron task... ${new Date()}`;
  console.log(endMessage);
  await sendSlackMessage(endMessage, threadTs);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Cron server is live at port ${port} 🚀`);
});
