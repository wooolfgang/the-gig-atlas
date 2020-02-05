function createTsVectorAgg(knex) {
  const sqlQuery = /* sql */ `
    DO $$ BEGIN
    CREATE aggregate tsvector_agg (tsvector) (
      STYPE = pg_catalog.tsvector,
      SFUNC = pg_catalog.tsvector_concat,
      INITCOND = ''
    );
    EXCEPTION
      WHEN duplicate_function THEN NULL;
    END $$;
  `;

  return knex.raw(sqlQuery);
}

function removeTsVectorAgg(knex) {
  const sqlQuery = /* sql */ `
    DO $$ BEGIN
    DROP aggregate tsvector_agg (tsvector);
    END $$;
  `;

  return knex.raw(sqlQuery);
}

exports.up = knex => {
  let { schema } = knex;
  schema = createTsVectorAgg(knex);
  return schema;
};

exports.down = knex => {
  let { schema } = knex;
  schema = removeTsVectorAgg(knex);
  return schema;
};
