/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import {
  client,
  setupSearch,
  removeSearch,
} from '../../src/serverless/postgres';

const gigSearch = {
  table: 'Gig',
  column: 'title',
  tableIdx: 'gig_idx',
  tableIdxTrigger: 'gig_srch_trig',
};
const tagSearch = {
  table: 'Tag',
  column: 'name',
  tableIdx: 'tag_idx',
  tableIdxTrigger: 'tag_srch_trig',
};

export default async () => {
  /**
   * use external interface to access postgres db for custom change
   */

  const pg = await client();

  try {
    const res = await Promise.all([
      setupSearch(pg, gigSearch),
      setupSearch(pg, tagSearch),
    ]);

    console.log('\n>>> Sucesful Gig Search idx initialization');
    pg.end();
  } catch (e) {
    console.error('error on Gig search idx initialization\n');
    console.log(e);
    pg.end();
    process.exit(1);
  }
};
