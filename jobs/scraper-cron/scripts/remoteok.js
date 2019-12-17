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

  try {
    const created = await Promise.all(
      existingGigsFiltered.map(gig =>
        prisma
          .createGig(gig)
          .then(console.log(`Created gig ${gig.title}`))
          .catch(e => console.log('Error: ', e)),
      ),
    );
    console.log('---------------------------------------------');
    console.log(`Created ${created.length} number of gigs`);
    console.log('---------------------------------------------');
  } catch (e) {
    console.log(e);
  }
}

module.exports = seedDataFromRemoteOk;
