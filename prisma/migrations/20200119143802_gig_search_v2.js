
/**
 * Create a gig search function to postgres server to simplify gig seach query
 * @example: 'SELECT * FROM search_gigs('${andQuery}', '${orQuery}')'; where andQuery and orQuery as parameters
 */
function createGigSearchFunction(knex) {
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
    DROP FUNCTION IF EXISTS search_gigs(and_input VARCHAR, or_input VARCHAR); -- drop v1 because it has different fn params

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

  return knex.raw(createFn);

  // ref => http://www.postgresqltutorial.com/plpgsql-function-returns-a-table/
}

function removeGigSearchFunction(knex) {
  const q = /* sql */ `
    DROP FUNCTION IF EXISTS search_gigs(and_input VARCHAR, or_input VARCHAR, items_count INT);
  `;

  return knex.raw(q);
}

// ----- migrations

exports.up = knex => createGigSearchFunction(knex.schema);

exports.down = knex => removeGigSearchFunction(knex.schema);
