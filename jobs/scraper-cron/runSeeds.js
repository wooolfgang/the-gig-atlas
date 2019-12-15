const seedFromScrapedData = require('./seedGigs');

(async () => {
  await seedFromScrapedData();
})();
