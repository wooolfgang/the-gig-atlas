import fs from 'fs';
import ensureDirectoryExists from './utils/ensureDirectoryExists';
import getFilenamesFromDirectory from './utils/getFilenamesFromDirectory';

const DATA_RELATIVE_PATH = '/data';
const SCRAPERS_RELATIVE_PATH = '/scrapers';

const Scraper = ({ limit = 5 } = {}) => {
  const timeLimitInMs = parseInt(limit, 10) * 60 * 1000;
  let _dataDirectoryExists = false;
  let _urls = null;

  const setUrls = urls => {
    _urls = urls;
  };
  const getUrls = () => _urls;
  const isSubset = (superarray, innerarray) =>
    innerarray.every(val => superarray.includes(val));

  async function ensureDataDirectoryExists() {
    if (_dataDirectoryExists) {
      return;
    }

    await ensureDirectoryExists(DATA_RELATIVE_PATH);
    _dataDirectoryExists = true;
  }

  async function getUrlsFromScrapersDirectory() {
    const filenames = await getFilenamesFromDirectory(SCRAPERS_RELATIVE_PATH);
    return filenames
      .filter(filename => filename.includes('.js'))
      .map(filename => filename.replace('.js', ''));
  }

  async function getDataFromJSONStore() {
    if (!getUrls()) {
      setUrls(await getUrlsFromScrapersDirectory());
    }

    const data = await Promise.all(
      getUrls().map(website => {
        const path = `src${DATA_RELATIVE_PATH}/${website}.json`;
        if (fs.existsSync(path)) {
          return fs.promises.readFile(path);
        }
        return null;
      }),
    );

    return data
      .filter(file => file !== null)
      .map(file => JSON.parse(file))
      .reduce((acc, val) => ({ ...acc, [val.website]: val }), {});
  }

  async function getValidDataFromJSONStore() {
    const dataFromJSON = await getDataFromJSONStore();
    return Object.keys(dataFromJSON).reduce((acc, key) => {
      const d = dataFromJSON[key];
      if (new Date(new Date(d.writtenAt) + timeLimitInMs) < new Date()) {
        acc[key] = d;
      }

      return acc;
    }, {});
  }

  async function getUrlsToScrape() {
    if (!getUrls()) {
      setUrls(await getUrlsFromScrapersDirectory());
    }

    const dataFromJSON = await getDataFromJSONStore();
    return getUrls().filter(url => {
      const data = dataFromJSON[url];
      if (!data) {
        return true;
      }

      if (new Date(new Date(data.writtenAt) + timeLimitInMs) >= new Date()) {
        return true;
      }

      return false;
    });
  }

  async function getDataFromScrapers() {
    const urlsToScrape = await getUrlsToScrape();
    const scrapingPromises = urlsToScrape.map(website => {
      const scraper = require(`.${SCRAPERS_RELATIVE_PATH}/${website}`).default;
      return scraper();
    });
    const scrapeResults = await Promise.all(scrapingPromises);
    return scrapeResults.reduce(
      (acc, val) => ({ ...acc, [val.website]: val }),
      {},
    );
  }

  async function writeDataToJSON(scrapeResults) {
    const writeDataPromises = Object.keys(scrapeResults).reduce((acc, key) => {
      const val = scrapeResults[key];
      const file = `src${DATA_RELATIVE_PATH}/${val.website}.json`;
      const fileData = JSON.stringify(val);
      return [...acc, fs.promises.writeFile(file, fileData)];
    }, []);
    try {
      await Promise.all(writeDataPromises);
    } catch (e) {
      throw new Error('Failed to write data');
    }
  }
  return {
    scrape: async function scrape(urls) {
      const validUrls = await getUrlsFromScrapersDirectory();
      if (urls && !isSubset(validUrls, urls)) {
        throw new Error(
          'Urls given are not valid! Run getValidWebsites to check',
        );
      }

      setUrls(urls);
      await ensureDataDirectoryExists();
      const dataFromStorage = await getValidDataFromJSONStore();
      const dataFromScrapers = await getDataFromScrapers();
      await writeDataToJSON(dataFromScrapers);
      return { ...dataFromStorage, ...dataFromScrapers };
    },
    getValidWebsites: async function getValidWebsites() {
      return getUrlsFromScrapersDirectory();
    },
  };
};

export default Scraper;
