/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
import axios from 'axios';
import cheerio from 'cheerio';

const pages = [
  'https://stackoverflow.com/jobs/remote-developer-jobs',
  'https://stackoverflow.com/jobs/remote-developer-jobs?sort=i&pg=2',
  'https://stackoverflow.com/jobs/remote-developer-jobs?sort=i&pg=3',
  'https://stackoverflow.com/jobs/remote-developer-jobs?sort=i&pg=4',
  'https://stackoverflow.com/jobs/remote-developer-jobs?sort=i&pg=5',
];

const getStackOverflowJobs = async () => {
  const jobIdToImages = await Promise.all(
    pages.map(async pageUrl => {
      const res = await axios(pageUrl);
      const html = res.data;
      const $ = cheerio.load(html);
      const jobsList = $('.listResults > div');
      const jobs = [];

      jobsList.each(function() {
        const jobId = $(this).attr('data-jobid');
        const title = $(this)
          .find('.s-link')
          .attr('title');
        const url = $(this)
          .find('.s-link')
          .attr('href');
        const categoriesLink = $(this)
          .find('.ps-relative')
          .children();

        const categories = [];
        categoriesLink.each(function() {
          const category = $(this).text();
          if (category) {
            categories.push(category);
          }
        });

        let imgSrc = $(this)
          .find('img')
          .attr('src');

        if (!imgSrc) {
          imgSrc = $(this)
            .find('.svg-icon')
            .parent()
            .html();
        }

        jobs.push({
          title,
          categories,
          url: `https://stackoverflow.com${url}`,
          image: imgSrc,
          guid: jobId,
        });
      });

      return jobs;
    }),
  );
  return jobIdToImages.reduce((acc, val) => [...acc, ...val], []);
};

export default async () => {
  console.log('Stackoverflow scraper is called');
  const items = await getStackOverflowJobs();
  const data = {
    items,
    writtenAt: new Date(),
    website: 'stackoverflow',
  };
  return data;
};
