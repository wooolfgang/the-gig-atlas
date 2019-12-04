/* eslint-disable no-console */
import { Client, Pool } from 'pg';
import cfg from '../config';

const { pg } = cfg;

/**
 * Create one time conneciton client
 * usefull for db build initialization
 * call .end() to end connection
 */
export async function client() {
  const pgClient = new Client(pg);

  await pgClient.connect();

  return pgClient;
}

/**
 * Create a continous connection pooling
 * usefull for continous working system
 * call .end() to end connection
 */
export function pool() {
  const pgPool = new Pool(pg);
  pgPool.on('error', err => {
    // todo: handle connection error
    console.error('Postgres pooling error');
    console.error(err);

    process.exit(-1);
  });

  return pgPool;
}



/**
 * Setup full text search to specified table and column
 *  @param {object} pgClient - postgres pool/client object
 *  @param {SearchConfig} cfgData - the {@link SearchConfig} config
 */
export function setupSearch(pgClient, cfgData) {
  const { schema, table, column, idxCol, tableIdx, tableIdxTrigger, config } = {
    ...defaultCfg,
    ...cfgData,
  };
  // => we need to use var "schemaTable" instead of var "table" as specified by prisma
  const schemaTable = `"${schema}"."${table}"`;

  const createSearchIdx = /* sql */ `
    ALTER TABLE ${schemaTable}
      ADD COLUMN ${idxCol} tsvector;
    UPDATE ${schemaTable}
      SET ${idxCol} = to_tsvector('${config}', ${column});
    CREATE INDEX ${tableIdx}
      ON ${schemaTable}
      USING GIN (${idxCol});
    CREATE TRIGGER ${tableIdxTrigger}
      BEFORE INSERT OR UPDATE ON ${schemaTable}
      FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(${idxCol}, 'pg_catalog.${config}', ${column});
  `;
  const colExists = /* sql */ `
    SELECT 1 FROM information_schema.columns
      WHERE table_name='${table}' AND table_schema='${schema}' AND column_name='${idxCol}'
  `;
  const conditonal = /* sql */ `
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

/**
 * Remove full text search to specified table and column
 *  @param {object} pgClient - postgres pool/client object
 *  @param {SearchConfig} cfgData - the {@link SearchConfig} config
 */
export function removeSearch(pgClient, cfgData) {
  const { schema, table, idxCol, tableIdx, tableIdxTrigger } = {
    ...defaultCfg,
    ...cfgData,
  };
  const schemaTable = `"${schema}"."${table}"`;

  const removeSearchIdx = /* sql */ `
    DROP INDEX "${schema}".${tableIdx};
    DROP TRIGGER ${tableIdxTrigger} ON ${schemaTable};
    ALTER TABLE ${schemaTable} DROP COLUMN ${idxCol};
  `;
  const colExists = /* sql */ `
    SELECT 1 FROM information_schema.columns
      WHERE table_name='${table}' AND table_schema='${schema}' AND column_name='${idxCol}'
  `;
  const conditonal = /* sql */ `
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

/**
 * convert string to or query by replace spaces with "|"
 * @param {string} txt - text to convert to or query
 */
export function toOrQuery(txt) {
  return txt.trim().replace(/\s+/g, '|');
}

export function toAndQuery(txt) {
  return txt.trim().replace(/\s+/g, '&');
}

// export function searchGigs(txt, skip, count) {
// }
