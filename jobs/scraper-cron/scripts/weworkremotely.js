const prisma = require('@thegigatlas/prisma');
const scraper = require('../scraper');

const transformWeWorkRemotelyItem = item => ({
  title: item.title,
  description: item.description,
  paymentType: 'HOURLY',
  communicationType: 'WEBSITE',
  communicationWebsite: item.url,
  jobType: 'FULL_TIME',
  media: {
    create: {
      url: item.media.content[0].url[0],
    },
  },
});

const transformWeWorkRemotelyData = items =>
  items.map(item => transformWeWorkRemotelyItem(item));

async function seedDataFromWeWorkRemotely() {
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

  responses.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log(`Created ${result.value.title}`);
      createdCount += 1;
    } else if (result.status === 'rejected') {
      console.log('On create error: ', JSON.stringify(result.reason));
    }
  });

  console.log(`Created ${createdCount} from weworkremotely`);
}

module.exports = seedDataFromWeWorkRemotely;
