import rssToJson from '../utils/rssToJson';

export default async () => {
  console.log('Weworkremotely scraper is called');
  const data = await rssToJson('https://weworkremotely.com/remote-jobs.rss');
  data.website = 'weworkremotely';
  data.writtenAt = new Date();
  return data;
};
