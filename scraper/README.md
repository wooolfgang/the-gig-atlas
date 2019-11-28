# `@thegigatlas/scraper`

A wrapper for scraping job/gigs listing websites

## Usage

```
  const Scraper = require('@thegigatlas/scraper');
  const scraper = Scraper({ limit: 5});
  const availableWebsites = await scraper.getValidWebsites();
  const data = await scraper.scrape(getValidWebsites);
  console.log(data);
```
