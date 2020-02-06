/* eslint-disable no-multi-spaces, operator-linebreak */
import { toAndQuery, toOrQuery } from '../../serverless/postgres';

/**
 * Converts string array to sql tupple
 * e.g: ('foo','bar','baz')
 * @param {string[]} arr of string
 */
function _toSqlTuple(arr) {
  return `${arr.reduce((t, e) => `${t}'${e}',`, '(').slice(0, -1)})`;
}

export function gigSearchQuery(args) {
  const { search, where, first, skip } = args;
  const tsQuery = `${toAndQuery(search)} | ${toOrQuery(search)}`;

  const limit = first;
  const offset = skip;
  const { projectType_in, paymentType_in, jobType_in } = where;

  const projectTypeAnd =
    projectType_in && projectType_in.length > 0
      ? `AND gig."projectType" IN ${_toSqlTuple(projectType_in)}`
      : '';
  const paymentTypeAnd =
    paymentType_in && paymentType_in.length > 0
      ? `AND gig."paymentType" IN ${_toSqlTuple(paymentType_in)}`
      : '';
  const jobTypeAnd =
    jobType_in && jobType_in.length > 0
      ? `AND gig."jobType" IN ${_toSqlTuple(jobType_in)}`
      : '';

  const query = /* sql */ `
    SELECT
      search_results.id,
      search_results.title,
      search_results."createdAt",
      search_results."updatedAt",
      search_results.description,
      search_results."projectType",
      search_results."paymentType",
      search_results."jobType",
      search_results."communicationType",
      search_results."communicationEmail",
      search_results."communicationWebsite",
      search_results.from,
      search_results."fromId",
      search_results.media,
      search_results.employer,
      search_results."minFee",
      search_results."maxFee",
      search_results."locationRestriction",
      search_results.status,
      COUNT(*) OVER() AS total
    FROM (
      SELECT
      gig.*,
      setweight(gig.search_idx_title, 'A') || 
      setweight(tsvector_agg(tag.search_idx_name), 'B') || 
      setweight(gig.search_idx_description, 'C') as document
    FROM
      "default$default"."Gig" as gig
      LEFT JOIN "default$default"."_GigTags" as gig_tags ON gig_tags."A" = gig.id
      LEFT JOIN "default$default"."Tag" as tag ON gig_tags."B" = tag.id
      LEFT JOIN "default$default"."Employer" as employer ON gig.employer = employer.id
    WHERE
      gig.status = 'POSTED' 
      ${projectTypeAnd}
      ${paymentTypeAnd}
      ${jobTypeAnd}
    GROUP BY
      gig.id
    ) search_results
    WHERE
      search_results.document @@ to_tsquery('english', '${tsQuery}')
    ORDER BY
      ts_rank(
        search_results.document,
        to_tsquery('english', '${tsQuery}')
      ) DESC
    LIMIT ${limit}
    OFFSET ${offset}
      ;
  `;

  return query;
}
