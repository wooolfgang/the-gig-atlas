import rssToJson from '../utils/rssToJson';

export default async () => {
  const data = await rssToJson('https://remoteok.io/remote-jobs.rss');
  data.website = 'remoteok';
  data.writtenAt = new Date();
  return data;
};
