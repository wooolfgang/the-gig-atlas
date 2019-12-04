/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { client } from '../../src/serverless/postgres';
import {
  createGigSearchFunction,
  setupSearch,
  removeGigSearchFunction,
} from './utils';

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
const employerNameSearch = {
  table: 'Employer',
  column: 'displayName',
  tableIdx: 'emp_idx',
  tableIdxTrigger: 'emp_srch_trig',
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
      // setupSearch(pg, employerNameSearch),
      // removeGigSearchFunction(pg), // remove if exist (for updating only)
      createGigSearchFunction(pg),
    ]);

    console.log('\n>>> Sucesful Gig Search idx initialization');
    // console.log(res);
    pg.end();
  } catch (e) {
    console.error('error on Gig search idx initialization\n');
    console.log(e);
    pg.end();
    process.exit(1);
  }
};
