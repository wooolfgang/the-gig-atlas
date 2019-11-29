/* eslint-disable no-console */
import { client } from '../../src/serverless/postgres';

const gigSearch = {
  schemaName: 'default$default', // shcema made by prisma
  tableName: '"default$default"."Gig"', // name of table by schema (made by prisma)
  colName: 'title', // column for text search
  idxColName: '_srch_idx', // name of col to store idx vector
  tableIdx: 'gig_idx', // name of idx for gig table
  tableIdxTrigger: 'gig_srch_trig', // name of trigger for idx col
  configName: 'english', // vector ref config
};

function setupGigSearch(pgClient) {
  const {
    schemaName,
    tableName,
    colName,
    idxColName,
    tableIdx,
    tableIdxTrigger,
    configName,
  } = gigSearch;

  const createSearchIdx = `
    ALTER TABLE ${tableName}
      ADD COLUMN ${idxColName} tsvector;
    UPDATE ${tableName}
      SET ${idxColName} = to_tsvector('${configName}', ${colName});
    CREATE INDEX ${tableIdx}
      ON ${tableName}
      USING GIN (${idxColName});
    CREATE TRIGGER ${tableIdxTrigger}
      BEFORE INSERT OR UPDATE ON ${tableName}
      FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(${idxColName}, 'pg_catalog.${configName}', ${colName});
  `;
  const colExists = `
    SELECT 1 FROM information_schema.columns
      WHERE table_name='Gig' AND table_schema='${schemaName}' AND column_name='${idxColName}'
  `;
  const conditonal = `
    DO
    $do$
    BEGIN
    IF NOT EXISTS (${colExists})
      THEN ${createSearchIdx}
    END IF;
    END
    $do$
  `;

  return pgClient.query(conditonal);
}

// eslint-disable-next-line no-unused-vars
function removeGigSearch(pgClient) {
  const {
    schemaName,
    tableName,
    // colName,
    idxColName,
    tableIdx,
    tableIdxTrigger,
    // configName,
  } = gigSearch;

  const removeSearchIdx = `
    DROP INDEX "${schemaName}".${tableIdx};
    DROP TRIGGER ${tableIdxTrigger} ON ${tableName};
    ALTER TABLE ${tableName} DROP COLUMN ${idxColName};
  `;
  const colExists = `
    SELECT 1 FROM information_schema.columns
      WHERE table_name='Gig' AND table_schema='${schemaName}' AND column_name='${idxColName}'
  `;
  const conditonal = `
    DO
    $do$
    BEGIN
    IF EXISTS (${colExists})
      THEN
      ${removeSearchIdx}
    END IF;
    END
    $do$
  `;

  return pgClient.query(conditonal);
}

export default async () => {
  /**
   * use external interface to access postgres db for custom change
   */

  const pg = await client();

  try {
    const res = await setupGigSearch(pg);

    console.log('\n>>> Sucesful Gig Search idx initialization');
    pg.end();
  } catch (e) {
    console.error('error on Gig search idx initialization\n');
    console.log(e);
    pg.end();
    process.exit(1);
  }
};
