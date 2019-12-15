const prisma = require('@thegigatlas/prisma');
const scraper = require('../scraper');

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

async function seedDataFromRemoteOk() {
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

  responses.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log(`Created ${result.title}`);
      createdCount += 1;
    } else if (result.status === 'rejected') {
      console.log('On create error: ', JSON.stringify(result.reason));
    }
  });

  console.log(`Created ${createdCount} from remoteok`);
}

module.exports = seedDataFromRemoteOk;
