const prisma = require('@thegigatlas/prisma');
const scraper = require('../scraper');
const sendSlackMessage = require('../utils/sendSlackMessage');

const transformRemoteOkItem = item => ({
  title: item.position,
  description: item.description,
  paymentType: 'HOURLY',
  communicationType: 'WEBSITE',
  communicationWebsite: item.url,
  jobType: 'FULL_TIME',
  media: {
    create: {
      url: item.company_logo,
    },
  },
});

const transformRemoteOkData = items =>
  items.map(item => transformRemoteOkItem(item));

async function seedDataFromRemoteOk(threadTs) {
  const res = await scraper.scrape(['remoteok']);
  const dataFromScraper = res.remoteok.items;
  const dataFromScraperTransformed = transformRemoteOkData(dataFromScraper);

  const existingGigs = await Promise.all(
    dataFromScraperTransformed.map(gig =>
      prisma.$exists.gig({ title: gig.title }),
    ),
  );

  const existingGigsFiltered = await Promise.all(
    dataFromScraperTransformed.filter((gig, index) => {
      if (existingGigs[index]) {
        return false;
      }
      return true;
    }),
  );

  const responses = await Promise.allSettled(
    existingGigsFiltered.map(gig => prisma.createGig(gig)),
  );

  let createdCount = 0;
  let rejectedCount = 0;
  const errors = [];

  responses.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log(`Created ${result.value.title}`);
      createdCount += 1;
    } else if (result.status === 'rejected') {
      console.log('On create error: ', JSON.stringify(result.reason));
      errors.push(result.value);
      rejectedCount += 1;
    }
  });

  const createdMsg = `Created ${createdCount} from remoteok`;
  const rejectedMsg = `Rejected ${rejectedCount} from remotok, ${JSON.stringify(
    errors,
  )}`;

  try {
    await sendSlackMessage(createdMsg, threadTs);
    await sendSlackMessage(rejectedMsg, threadTs);
  } catch (e) {
    console.log('Failed to send slack message');
  }
}

module.exports = seedDataFromRemoteOk;
