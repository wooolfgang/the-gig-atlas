/* eslint-disable prettier/prettier */
import { argv } from 'yargs';
import path from 'path';
import fs from 'fs';

export default async function getWebsites() {
  const { _: urlArguments } = argv;
  let websitesToScrape = urlArguments;

  if (websitesToScrape[0] === 'all') {
    const websitesPath = `${path.dirname(__dirname)}/websites`;
    try {
      websitesToScrape = await fs.promises.readdir(websitesPath);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }


  return websitesToScrape.map((url) => url.replace('.js', ''));
}
