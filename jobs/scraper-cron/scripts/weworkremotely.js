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

module.exports = seedDataFromWeWorkRemotely;
