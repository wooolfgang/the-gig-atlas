import rssToJson from '../utils/rssToJson';

export default async () => {
  console.log('Remoteok scraper is called');
  const data = await rssToJson('https://remoteok.io/remote-jobs.rss');
  data.website = 'remoteok';
  data.writtenAt = new Date();
  return data;
};
