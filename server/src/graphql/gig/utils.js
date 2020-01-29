import { toAndQuery, toOrQuery } from '../../serverless/postgres';

/**
 * converts string array to sql tupple
 * e.g: ('foo','bar','baz')
 * @param {string[]} arr of string
 */
function _toSqlTuple(arr) {
  return `${arr.reduce((t, e) => `${t}'${e}',`, '(').slice(0, -1)})`;
}

export function gigSearchQuery(search, where) {
  const { jobs, projects, payments } = where;
  const orQuery = toOrQuery(search);
  const andQuery = toAndQuery(search);
  const gigPredicate = /* sql */ `
     g.status='POSTED'
    ${jobs && jobs.length > 0 ? `AND g."jobType" IN ${_toSqlTuple(jobs)}` : ''}
    ${
      projects && projects.length > 0
        ? `AND g."projectType" IN ${_toSqlTuple(projects)}`
        : ''
    }
    ${
      payments && payments.length > 0
        ? `AND g."paymentType" IN ${_toSqlTuple(payments)}`
        : ''
    }
  `;
  const qs = /* sql */ `
    WITH
    ts AS (
      SELECT
        to_tsquery('english', '${andQuery}') AS and_vec,
        to_tsquery('english', '${orQuery}') AS or_vec
    ),
    gtc AS (
      SELECT g.id, g._srch_idx
      FROM "default$default"."Gig" AS g, ts
      WHERE ${gigPredicate}
        AND g._srch_idx @@ ts.or_vec
    )
    SELECT c.id, MIN(c.p) AS p
      FROM (
        SELECT gtc.id, 1 AS p FROM gtc, ts
        WHERE gtc._srch_idx @@ ts.and_vec
      UNION
        SELECT gtc.id, 2 as p FROM gtc
      UNION
        SELECT g.id, 3 as p FROM "default$default"."Gig" AS g
        WHERE ${gigPredicate}
          AND g.id IN (
            SELECT mid."A" AS gid
            FROM "default$default"."_GigTags" AS mid
            WHERE mid."B" IN (
              SELECT t.id
              FROM "default$default"."Tag" as t, ts
              WHERE t._srch_idx @@ ts.or_vec
            )
            GROUP BY gid
          )
      UNION
        SELECT g.id, 4 as p FROM "default$default"."Gig" AS g
        WHERE ${gigPredicate}
          AND g.employer IN (
            SELECT emp.id
            FROM "default$default"."Employer" AS emp, ts
            WHERE emp._srch_idx @@ ts.or_vec
          )
    ) AS c
    GROUP BY c.id
    ORDER BY p ASC
    FETCH NEXT 500 ROWS ONLY;
  `; // .replace(/\s\s/g, ''); // trim spaces

  return qs;
}
