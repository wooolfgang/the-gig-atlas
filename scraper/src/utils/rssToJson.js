import Feed from 'rss-to-json-v2';

export default function rssToJson(url) {
  return new Promise((res, rej) => {
    Feed.load(url, (err, rss) => {
      if (err) {
        rej(err);
      }
      res(rss);
    });
  });
}
