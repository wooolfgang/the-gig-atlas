/**
 * Search indexing config data
 * @typedef {Object} SearchConfig
 * @property {string} [schema="default$default"] - shcema name made by prisma
 * @property {string} [idxCol="_srch_idx"] - name of column to store vector tokens (custom)
 * @property {string} [config="english"] -  index config name for postgres reference
 * @property {string} table - name of table made by prisma, referenced from datamode.prisma
 * @property {string} column - name of target column to index (custom)
 * @property {string} tableIdx - name of index for table (custom)
 * @property {string} tableIdxTrigger - name trigger to in table (custom)
 */

const defaultCfg = {
  schema: 'default$default', // shcema made by prisma
  idxCol: '_srch_idx', // name of col to store idx vector
  config: 'english', // vector ref config
};

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
 * Create a gig search function to postgres server to simplify gig seach query
 * @example: 'SELECT * FROM search_gigs('${andQuery}', '${orQuery}')'; where andQuery and orQuery as parameters
 */
export function createGigSearchFunction(db) {
  const titleQuery = /* sql */ `
    SELECT g.id, 1 AS p -- set 1st priority
      FROM "default$default"."Gig" as g
      WHERE g.status='POSTED'
        AND g._srch_idx @@ to_tsquery('english', and_query)
  `;
  // take gig ids by joining with tags from text match
  const gigTagsQuery = /* sql */ `
    SELECT mid."A" AS gid
      FROM "default$default"."_GigsByTag" AS mid
      INNER JOIN "default$default"."Tag" AS tag
        ON mid."B" = tag.id
        WHERE tag._srch_idx @@ to_tsquery('english', or_query)
      GROUP BY gid
  `;
  // validate gig ids fro original gig table
  const tagsQuery = /* sql */ `
    SELECT gig.id, 2 AS p
    FROM "default$default"."Gig" AS gig
    INNER JOIN (${gigTagsQuery}) AS mid
      ON gig.id = mid.gid
    WHERE gig.status='POSTED'
  `;
  const combineSearchResults = /* sql */ `
    SELECT c.id, MIN(c.p) AS p
    FROM (${titleQuery} UNION ${tagsQuery}) AS c
    GROUP BY c.id
    ORDER BY p ASC
  `;
  const pagination = /* sql */ `
    SELECT * FROM search_res FETCH NEXT 10 ROWS ONLY
  `;
  const pagedData = /* sql */ `
    SELECT gig.id, gig.title, pr.p
      FROM "default$default"."Gig" AS gig
      INNER JOIN (${pagination}) AS pr
        ON gig.id = pr.id
  `;
  const pagedWithRest = /* sql */ `
    SELECT sr.id, pg.title, sr.p
      FROM search_res AS sr
      FULL JOIN (${pagedData}) AS pg
      ON pg.id = sr.id
  `;
  // set query as a function
  const createFn = /* sql */ `
    CREATE OR REPLACE FUNCTION search_gigs (and_query VARCHAR, or_query VARCHAR) 
      RETURNS TABLE (id VARCHAR, title TEXT, p INT)
    AS $$
    BEGIN
      CREATE TEMP TABLE search_res AS
        SELECT *
        FROM (${combineSearchResults}) AS cr;

      RETURN QUERY ${pagedWithRest};
    END; $$

    LANGUAGE 'plpgsql';
  `;

  return db.query(createFn);

  // ref => http://www.postgresqltutorial.com/plpgsql-function-returns-a-table/
}

export function removeGigSearchFunction(db) {
  const q = /* sql */ `
    DROP FUNCTION IF EXISTS search_gigs(and_query VARCHAR, or_query VARCHAR);
  `;

  return db.query(q);
}
