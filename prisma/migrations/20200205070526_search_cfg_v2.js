/* eslint-disable prefer-destructuring, no-param-reassign, func-names, object-curly-newline */

/**
 * Setup full text search to specified table and column
 *  @param {object} pgClient - postgres pool/client object
 *  @param {SearchConfig} cfgData - the {@link SearchConfig} config
 */
function setupSearch(knex, cfgData) {
  const {
    schema,
    table,
    column,
    idxCol,
    tableIdx,
    tableIdxTrigger,
    config,
  } = cfgData;
  // => we need to use var "schemaTable" instead of var "table" as specified by prisma
  const schemaTable = `"${schema}"."${table}"`;
  const tsVectorCol = `${idxCol}_${column}`;

  const createSearchIdx = /* sql */ `
    ALTER TABLE ${schemaTable}
      ADD COLUMN ${tsVectorCol} tsvector;
    UPDATE ${schemaTable}
      SET ${tsVectorCol} = to_tsvector('${config}', coalesce('${column}', ''));
    CREATE INDEX ${tableIdx}
      ON ${schemaTable}
      USING GIN (${tsVectorCol});
    CREATE TRIGGER ${tableIdxTrigger}
      BEFORE INSERT OR UPDATE OF "${column}" ON ${schemaTable}
      FOR EACH ROW EXECUTE PROCEDURE
        tsvector_update_trigger(${tsVectorCol}, 'pg_catalog.${config}', '${column}');
  `;
  const colExists = /* sql */ `
    SELECT 1 FROM information_schema.columns
      WHERE table_name='${table}' AND table_schema='${schema}' AND column_name='${tsVectorCol}'
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
function removeSearch(knex, cfgData) {
  const { schema, table, idxCol, tableIdx, tableIdxTrigger, column } = cfgData;
  const schemaTable = `"${schema}"."${table}"`;
  const tsVectorCol = `${idxCol}_${column}`;
  const conditonal = /* sql */ `
    DO
    $do$
    BEGIN
      DROP INDEX "${schema}".${tableIdx};
      DROP TRIGGER ${tableIdxTrigger} ON ${schemaTable};
      ALTER TABLE ${schemaTable} DROP COLUMN ${tsVectorCol};
    END
    $do$
  `;

  return knex.raw(conditonal);
}

/**
 * Search indexing config data
 * @typedef {Object} SearchConfig
 * @property {string} [schema="default$default"] - schema name made by prisma
 * @property {string} [idxCol="search_idx"] - name of column to store vector tokens (custom)
 * @property {string} [config="english"] -  index config name for postgres reference
 * @property {string} table - name of table made by prisma, referenced from datamodel.prisma
 * @property {string} column - name of target column to index (custom)
 * @property {string} tableIdx - name of index for table (custom)
 * @property {string} tableIdxTrigger - name trigger to in table (custom)
 */
const baseConfig = {
  schema: 'default$default',
  idxCol: 'search_idx',
  config: 'english',
};
const gigTitleSearch = {
  table: 'Gig',
  column: 'title',
  tableIdx: 'gig_title_idx',
  tableIdxTrigger: 'gig_title_srch_trig',
};
const gigDescriptionSearch = {
  table: 'Gig',
  column: 'description',
  tableIdx: 'gig_description_idx',
  tableIdxTrigger: 'gig_description_srch_trig',
};
const employerNameSearch = {
  table: 'Employer',
  column: 'displayName',
  tableIdx: 'emp_idx',
  tableIdxTrigger: 'emp_srch_trig',
};
const tagSearch = {
  table: 'Tag',
  column: 'name',
  tableIdx: 'tag_idx',
  tableIdxTrigger: 'tag_srch_trig',
};

exports.up = knex => {
  let schema = knex.schema;

  schema = setupSearch(schema, { ...baseConfig, ...gigTitleSearch });
  schema = setupSearch(schema, { ...baseConfig, ...gigDescriptionSearch });
  schema = setupSearch(schema, { ...baseConfig, ...employerNameSearch });
  schema = setupSearch(schema, { ...baseConfig, ...tagSearch });

  return schema;
};

exports.down = knex => {
  let schema = knex.schema;

  schema = removeSearch(schema, { ...baseConfig, ...gigTitleSearch });
  schema = removeSearch(schema, { ...baseConfig, ...gigDescriptionSearch });
  schema = removeSearch(schema, { ...baseConfig, ...employerNameSearch });
  schema = removeSearch(schema, { ...baseConfig, ...tagSearch });

  return schema;
};
