import pg from '../../serverless/postgres';
import dbCfg from '../../db/config';

export function searchGig(db, txt, start = 0, count = 10) {
  const orQuery = '';
  const andQuery = '';

  const titleQuery = /* sql */ `
    SELECT g.id as gid, 1 AS p
      FROM "default$default"."Gig" as g
      WHERE g.status='POSTED'
        AND g._srch_idx @@ to_tsquery('english', '${andQuery}')
  `;
  // take gig ids by joining with tags from text match
  const gigTagsQuery = /* sql */ `
    SELECT mid."A" AS gid
      FROM "default$default"."_GigsByTag" AS mid
      INNER JOIN "default$default"."Tag" AS tag
        ON mid."B" = tag.id
        WHERE tag._srch_idx @@ to_tsquery('english', '${orQuery}')
      GROUP BY gid
  `;
  // validate gig ids fro original gig table
  const tagsQuery = /* sql */ `
    SELECT gig.id AS gid, 2 AS p
      FROM "default$default"."Gig" AS gig
      INNER JOIN (${gigTagsQuery}) AS mid
        ON gig.id = mid.gid
      WHERE gig.status='POSTED'
  `;
  const unionAll = /* sql */ `
    SELECT gid, MIN(c.p) as p
    FROM (${titleQuery} UNION ${tagsQuery}) AS c
    GROUP BY c.gid
    ORDER BY p ASC
  `;

  const query = /* sql */ `
    DO $$ 
    DECLARE
      t_gig varchar(25) := ${dbCfg.gigSchemaTable};
      t_tag varchar(25) := ${dbCfg.tagSchemaTable};
    BEGIN 

    END $$;
  `;

  return db.query(query);
}
