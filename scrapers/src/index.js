/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable arrow-parens */
/* eslint-disable prettier/prettier */
import { argv } from 'yargs';
import fs from 'fs';
import ensureDirectoryExists from './utils/ensureDirectoryExists';
import getUrls from './utils/getWebsites';

const { limit = 5 } = argv;

(async () => {
  /* Check if data folder exists, else create it */
  await ensureDirectoryExists('/data');

  /* Get urls to scrape based on process args */
  const urls = await getUrls();

  let readFilesPromises = [];
  try {
    readFilesPromises = await Promise.all(
      urls.map((website) => {
        const path = `src/data/${website}.json`;
        if (fs.existsSync(path)) {
          return fs.promises.readFile(path);
        }
        return null;
      }),
    );
  } catch (e) {
    // fail gracefully
  }

  /* Read data from json store */
  const dataFromJsonStore = readFilesPromises
    .filter(file => file !== null)
    .map(file => JSON.parse(file));

  /* Data that is still valid, not exceeding the time limit */
  const data = dataFromJsonStore.filter(
    d => new Date(new Date(d.writtenAt) + parseInt(limit, 10) * 60 * 1000) < new Date(),
  );

  /* Data that is not valid, scraped directly from the website */
  const urlsToScrape = urls.filter(url => {
    const fromStoreIndex = dataFromJsonStore.findIndex(d => d.website === url);
    if (fromStoreIndex === -1) {
      return true;
    }

    const d = dataFromJsonStore[fromStoreIndex];
    if (new Date(new Date(d.writtenAt)
    + parseInt(limit, 10) * 60 * 1000) >= new Date()) {
      return true;
    }

    return false;
  });

  const scrapingPromises = urlsToScrape.map(website => {
    const scraper = require(`./websites/${website}`).default;
    return scraper();
  });

  /* Store the results scraped as json value */
  const scrapeResults = await Promise.all(scrapingPromises);
  const writeDataPromises = scrapeResults.reduce((acc, val) => {
    const file = `src/data/${val.website}.json`;
    const fileData = JSON.stringify(val);
    return [...acc, fs.promises.writeFile(file, fileData)];
  }, []);

  try {
    await Promise.all(writeDataPromises);
    console.log('Sucessfully written files');
  } catch (e) {
    console.log('Error writing file', e);
    process.exit(1);
  }

  return [...data, ...scrapeResults];
})();
