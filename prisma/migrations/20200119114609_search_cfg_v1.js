/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
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
export function setupSearch(knex, cfgData) {
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

  return knex.raw(conditonal);
}

/**
 * Remove full text search to specified table and column
 *  @param {object} pgClient - postgres pool/client object
 *  @param {SearchConfig} cfgData - the {@link SearchConfig} config
 */
export function removeSearch(knex, cfgData) {
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

  return knex.raw(conditonal);
}

// ------- configs

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

// ------ migrations

exports.up = knex => {
  knex = setupSearch(knex, gigSearch);
  knex = setupSearch(knex, tagSearch);
  knex = setupSearch(knex, employerNameSearch);

  return knex;
};

exports.down = knex => {
  knex = removeSearch(knex, gigSearch);
  knex = removeSearch(knex, tagSearch);
  knex = removeSearch(knex, employerNameSearch);

  return knex;
};
