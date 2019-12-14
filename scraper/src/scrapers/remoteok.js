export default async () => {
  console.log('Remoteok scraper is called');
  const jsonRes = await fetch('https://remoteok.io/api');
  const [_legalities, ...res] = await jsonRes.json();
  const data = {
    items: res,
    website: 'remoteok',
    writtenAt: new Date(),
  };
  return data;
};
