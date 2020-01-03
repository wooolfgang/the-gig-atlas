import rssToJson from '../utils/rssToJson';

export default async () => {
  console.log('Weworkremotely scraper is called');
  const programmingData = await rssToJson(
    'https://weworkremotely.com/categories/remote-programming-jobs.rss',
  );
  const devopsData = await rssToJson(
    'https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss',
  );
  programmingData.website = 'weworkremotely';
  programmingData.writtenAt = new Date();
  programmingData.items = [...programmingData.items, ...devopsData.items];
  return programmingData;
};
