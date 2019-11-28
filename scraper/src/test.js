import Scraper from './index';

const scraper = Scraper({ limit: 2 });

(async () => {
  const available = await scraper.getValidWebsites();
  const res = await scraper.scrape(available);
  console.log(available);
  console.log(res);
})();
