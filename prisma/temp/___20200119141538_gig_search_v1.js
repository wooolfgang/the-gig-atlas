function createGigSearchFunction(knex) {
  const orGigsTitle = /* sql */ `
    SELECT g.id, g._srch_idx, 2 AS p -- set 1st priority
      FROM "default$default"."Gig" AS g
      WHERE g.status='POSTED'
        AND g._srch_idx @@ to_tsquery('english', or_query)
  `;
  const titleQuery = /* sql */ `
    SELECT g.id, 1 AS p -- set 1st priority
      FROM "default$default"."Gig" AS g
      WHERE g.status='POSTED'
        AND g._srch_idx @@ to_tsquery('english', and_query)
  `;
  // take gig ids by joining with tags from text match
  const gigTagsQuery = /* sql */ `
    SELECT mid."A" AS gid
      FROM "default$default"."_GigTags" AS mid
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
    SELECT * FROM search_res FETCH NEXT 10 ROWS ONLY -- 10 rows to query
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
    DROP FUNCTION IF EXISTS search_gigs(and_input VARCHAR, or_input VARCHAR, items_count INT); -- backward friction compatibility from v2

    CREATE OR REPLACE FUNCTION search_gigs (and_query VARCHAR, or_query VARCHAR) 
      RETURNS TABLE (id VARCHAR, title TEXT, p INT)
    AS $$
    BEGIN
      CREATE TEMP TABLE or_gigs AS
        SELECT * FROM (${orGigsTitle}) as ogt;
      CREATE TEMP TABLE search_res AS
        SELECT * FROM (${combineSearchResults}) AS cr;

      RETURN QUERY ${pagedWithRest};
    END; $$

    LANGUAGE 'plpgsql';
  `;

  return knex.raw(createFn);

  // ref => http://www.postgresqltutorial.com/plpgsql-function-returns-a-table/
}

function removeGigSearchFunction(knex) {
  const q = /* sql */ `
    DROP FUNCTION IF EXISTS search_gigs(and_input VARCHAR, or_input VARCHAR);
  `;

  return knex.raw(q);
}

exports.up = knex => createGigSearchFunction(knex.schema);

exports.down = knex => removeGigSearchFunction(knex.schema);
