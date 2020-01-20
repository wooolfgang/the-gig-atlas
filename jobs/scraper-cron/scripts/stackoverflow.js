/* eslint-disable prettier/prettier */
const prisma = require('@thegigatlas/prisma');
const scraper = require('../scraper');
const sendSlackMessage = require('../utils/sendSlackMessage');

const WEBSITE_FROM = 'STACKOVERFLOW';

const transformStackOverflowItem = item => ({
  title: item.title,
  description: item.description || '',
  paymentType: 'HOURLY',
  communicationType: 'WEBSITE',
  communicationWebsite: item.url,
  jobType: 'FULL_TIME',
  media: {
    create: {
      url: item.image,
    },
  },
  status: 'POSTED',
  from: WEBSITE_FROM,
  fromId: item.guid,
  tags: {
    connect: item.categories && item.categories.map(tag => ({
      name: tag,
    })),
  },
});

const transformStackOverflowData = items =>
  items.map(item => transformStackOverflowItem(item));

async function seedDataFromStackOverflow(threadTs) {
  const res = await scraper.scrape(['stackoverflow']);
  const dataFromScraper = res.stackoverflow.items;
  const dataFromScraperTransformed = transformStackOverflowData(
    dataFromScraper,
  );

  const existingGigs = await Promise.all(
    dataFromScraperTransformed.map(gig =>
      prisma.$exists.gig({
        title: gig.title,
        fromId: gig.fromId,
        from: WEBSITE_FROM,
      }),
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

  // Create tags that don't exist
  const flattenedTags = {};

  for (let i = 0; i < existingGigsFiltered.length; i += 1) {
    const gig = existingGigsFiltered[i];
    for (let j = 0; j < gig.tags.connect.length; j += 1) {
      const tag = gig.tags.connect[j].name;
      flattenedTags[tag] = true;
    }
  }

  const tags = Object.keys(flattenedTags);
  const existingTags = await Promise.all(
    tags.map(tag =>
      prisma.$exists.tag({
        name: tag,
      }),
    ),
  );

  await Promise.all(
    tags
      .filter((tag, index) => !existingTags[index])
      .map(tag =>
        prisma.createTag({
          name: tag,
          categories: {
            connect: {
              name: 'technologies',
            },
          },
        }),
      ),
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
      errors.push(result.reason);
      rejectedCount += 1;
    }
  });

  const createdMsg = `Created ${createdCount} from ${WEBSITE_FROM}`;
  const rejectedMsg = `Rejected ${rejectedCount} from ${WEBSITE_FROM}, ${JSON.stringify(
    errors,
  )}`;

  console.log(createdMsg);
  console.log(rejectedMsg);

  try {
    await sendSlackMessage(`${createdMsg} \n ${rejectedMsg}`, threadTs);
  } catch (e) {
    console.log('Failed to send slack message');
  }
}

module.exports = seedDataFromStackOverflow;
