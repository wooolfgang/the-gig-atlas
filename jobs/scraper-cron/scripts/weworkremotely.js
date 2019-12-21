const prisma = require('@thegigatlas/prisma');
const scraper = require('../scraper');
const sendSlackMessage = require('../utils/sendSlackMessage');

const transformWeWorkRemotelyItem = item => ({
  title: item.title,
  description: item.description,
  paymentType: 'HOURLY',
  communicationType: 'WEBSITE',
  communicationWebsite: item.url,
  jobType: 'FULL_TIME',
  media: item.media
    && item.media.content
    item.media.content[0] && {
      create: {
        url: item.media.content[0].url[0],
      },
    },
});

const transformWeWorkRemotelyData = items =>
  items.map(item => transformWeWorkRemotelyItem(item));

async function seedDataFromWeWorkRemotely(threadTs) {
  const res = await scraper.scrape(['weworkremotely']);
  const dataFromScraper = res.weworkremotely.items;
  const dataFromScraperTransformed = transformWeWorkRemotelyData(
    dataFromScraper,
  );

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
      rejectedCount += 1;
      errors.push(result.value);
      console.log('On create error: ', JSON.stringify(result.reason));
    }
  });

  const createdMsg = `Created ${createdCount} from weworkremotely`;
  const rejectedMsg = `Rejected ${rejectedCount} from remoteok, ${JSON.stringify(
    errors,
  )}`;

  try {
    await sendSlackMessage(createdMsg, threadTs);
    await sendSlackMessage(rejectedMsg, threadTs);
  } catch (e) {
    console.log('Failed to send slack message');
  }
}

module.exports = seedDataFromWeWorkRemotely;
