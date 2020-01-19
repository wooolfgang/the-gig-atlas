/**
 * Search indexing config data
 * @typedef {Object} SearchConfig
 * @property {string} [schema="default$default"] - schema name made by prisma
 * @property {string} [idxCol="_srch_idx"] - name of column to store vector tokens (custom)
 * @property {string} [config="english"] -  index config name for postgres reference
 * @property {string} table - name of table made by prisma, referenced from datamodel.prisma
 * @property {string} column - name of target column to index (custom)
 * @property {string} tableIdx - name of index for table (custom)
 * @property {string} tableIdxTrigger - name trigger to in table (custom)
 */

const defaultCfg = {
  schema: 'default$default', // schema made by prisma
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
      ADD COLUMN ${idxCol} tsvector; -- insert new index column to table
    UPDATE ${schemaTable} -- set all the values of idx column
      SET ${idxCol} = to_tsvector('${config}', '${column}'); -- IMPORTANT: token ${column} must be enclosed with '' to avoid postgres camel case auto parse table name
    CREATE INDEX ${tableIdx}
      ON ${schemaTable}
      USING GIN (${idxCol});
    CREATE TRIGGER ${tableIdxTrigger} -- trigger helps update idx column every row change
      BEFORE INSERT OR UPDATE ON ${schemaTable}
      FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(${idxCol}, 'pg_catalog.${config}', '${column}');
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
  /**
   * @IMPORTANT GUIDLINES
   * -> Final data type position must match function return position
   * -> Complicated UNION cant combine title
   */

  // save all gig by related search title to temporary table "gtc"
  const gigsTitleCache = /* sql */ `
    SELECT g.id, g._srch_idx
      FROM "default$default"."Gig" AS g
      WHERE g.status='POSTED'
        AND g._srch_idx @@ or_query
  `;
  // get gigs with matched title from search set as first priority
  const andGigsTitle = /* sql */ `
    SELECT gtc.id, 1 AS p
      FROM gtc
      WHERE gtc._srch_idx @@ and_query
  `;
  // get gig with optinally matched title from search set as secondary priority
  const orGigsTitle = /* sql */ `
    SELECT gtc.id, 2 as p
      FROM gtc
  `;
  // take gig ids by joining with tags from text match
  // -- "A" col is named by prisma represents gig id for n:m relationship
  const gigTagsQuery = /* sql */ `
  SELECT mid."A" AS gid
    FROM "default$default"."_GigTags" AS mid
    WHERE mid."B" IN (
      SELECT tag.id
      FROM "default$default"."Tag" as tag
      WHERE tag._srch_idx @@ or_query
    )
    GROUP BY gid
  `;
  // validate gig ids from original gig table
  const tagsRelativeGigs = /* sql */ `
    SELECT gig.id, 3 as p
    FROM "default$default"."Gig" AS gig
    WHERE
      gig.status='POSTED'
      AND gig.id IN (${gigTagsQuery})
  `;
  // find matched employer name
  const employerNameQuery = /* sql */ `
    SELECT emp.id
    FROM "default$default"."Employer" AS emp
    WHERE emp._srch_idx @@ or_query
  `;
  // matched employers id to find available gig
  const employersRelativeGigs = /* sql */ `
  SELECT gig.id, 4 as p
  FROM "default$default"."Gig" AS gig
  WHERE
    gig.status='POSTED'
    AND gig.employer IN (${employerNameQuery})
`;
  const combineGigResults = /* sql */ `
    SELECT c.id, 'test' as title, MIN(c.p) AS p
      FROM (
      ${andGigsTitle}
      UNION
      ${orGigsTitle}
      UNION
      ${tagsRelativeGigs}
      UNION
      ${employersRelativeGigs}
    ) AS c
    GROUP BY c.id
    ORDER BY p ASC
  `;
  // get the first items_count number only
  const pagination = /* sql */ `
    SELECT * FROM search_res FETCH NEXT (items_count) ROWS ONLY
  `;
  // populate the paginated rows with title
  const pagedData = /* sql */ `
    SELECT gig.id, gig.title, pr.p
      FROM "default$default"."Gig" AS gig
      INNER JOIN (${pagination}) AS pr
        ON gig.id = pr.id
  `;
  // add the paginatd data to rows other similar searched gigs
  // only the first paginated rows has title content
  const paginatedWithSimilar = /* sql */ `
    SELECT sr.id, pg.title, sr.p
      FROM search_res AS sr
      FULL JOIN (${pagedData}) AS pg
      ON pg.id = sr.id
  `;
  // set query as a function
  // gtc temp table stores gig searched by similar title
  // search_res temp table stores results to be paginated
  const createFn = /* sql */ `
    CREATE OR REPLACE FUNCTION search_gigs (
      and_input VARCHAR,
      or_input VARCHAR,
      items_count INT
    ) 
      RETURNS TABLE (id VARCHAR, title TEXT, p INT) -- p - "sorted index by priority"
    AS $$
    DECLARE
      and_query tsquery := to_tsquery('english', and_input);
      or_query tsquery := to_tsquery('english', or_input);
    BEGIN
      CREATE TEMP TABLE gtc AS -- holds optionally title queried gig
        SELECT * FROM (${gigsTitleCache}) as _gtc;
      CREATE TEMP TABLE search_res AS -- stores all gigs searched
         SELECT * FROM (${combineGigResults}) AS _cr;

      RETURN QUERY ${paginatedWithSimilar};
      DROP TABLE gtc; -- drop table to avoid conflict with another function query
      DROP TABLE search_res;
    END; $$

    LANGUAGE 'plpgsql';
  `;

  return db.query(createFn);

  // ref => http://www.postgresqltutorial.com/plpgsql-function-returns-a-table/
}

export function removeGigSearchFunction(db) {
  const q = /* sql */ `
    DROP FUNCTION IF EXISTS search_gigs(and_input VARCHAR, or_input VARCHAR, items_count INT);
  `;

  return db.query(q);
}
