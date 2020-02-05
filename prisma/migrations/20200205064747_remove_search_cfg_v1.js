/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable object-curly-newline */

const defaultCfg = {
  schema: 'default$default', // schema made by prisma
  idxCol: '_srch_idx', // name of col to store idx vector
  config: 'english', // vector ref config
};

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

function removeSearch(knex, cfgData) {
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
    IF EXISTS (${colExists}) THEN
      ${removeSearchIdx}
    END IF;
    END
    $do$
  `;

  return knex.raw(conditonal);
}

exports.up = knex => {
  let schema = knex.schema;

  schema = removeSearch(schema, gigSearch);
  schema = removeSearch(schema, tagSearch);
  schema = removeSearch(schema, employerNameSearch);

  return schema;
};

exports.down = () => {};
