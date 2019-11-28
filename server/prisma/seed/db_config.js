/* eslint-disable no-console */
import { client } from '../../src/serverless/postgres';

export default async () => {
  const pg = await client();

  const gigIdx = `
    ALTER TABLE "default$default"."Gig"
      ADD COLUMN search_idx tsvector;
    UPDATE "default$default"."Gig"
      SET search_idx = to_tsvector('english', title);
    CREATE INDEX gig_idx
      ON "default$default"."Gig"
      USING GIN (search_idx);
    CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
      ON "default$default"."Gig" FOR EACH ROW EXECUTE PROCEDURE
      tsvector_update_trigger(tsv, 'pg_catalog.english', title);
  `;
  // const tagIdx = `
  //   ALTER TABLE "default$default"."Tag"
  //     ADD COLUMN search_idx tsvector;
  //   UPDATE "default$default"."Tag"
  //     SET search_idx = to_tsvector('english', name);
  //   CREATE INDEX tag_idx
  //     ON "default$default"."Tag"
  //     USING GIN (search_idx);
  // `;

  try {
    const res = await pg.query(gigIdx);

    console.log('\n>>> Sucesful Search idx update');
    console.log(res);
    pg.end();
    // console.log('New admin created: ', newAdmin);
  } catch (e) {
    console.error('error on search idx update\n');
    console.log(e);
    process.exit(1);
  }
};
