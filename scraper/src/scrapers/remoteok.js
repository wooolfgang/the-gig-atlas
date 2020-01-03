import rssToJson from '../utils/rssToJson';

export default async () => {
  console.log('Remoteok scraper is called');
  const remoteokData = await rssToJson(
    'https://remoteok.io/remote-dev-jobs.rss',
  );
  const data = {
    items: remoteokData.items,
    website: 'remoteok',
    writtenAt: new Date(),
  };
  return data;
};
