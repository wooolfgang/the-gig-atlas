import uuidv4 from 'uuid/v4';
import argon2 from 'argon2';
import prisma from '@thegigatlas/prisma';
import { toAndQuery, toOrQuery } from '../../serverless/postgres';
// eslint-disable-next-line import/no-cycle
import { transformEmployerInput } from '../employer/resolver';

export function transformGigInput({ avatarFileId, ...gigInput }) {
  return {
    ...gigInput,
    tags: {
      connect: gigInput.tags.map(tag => ({ name: tag })),
    },
    media: avatarFileId && {
      connect: {
        id: avatarFileId,
      },
    },
  };
}

/**
 * Search gigs
 * target fields: 1.titles, 2.tags, 3.employers
 */
function searchGigs(
  _r,
  { search, where, skip, after, before, first, last },
  { pg },
) {
  if (!search) {
    return prisma.gigs({
      first: first || 8,
      where,
      orderBy: 'createdAt_DESC',
      skip,
      after,
      before,
      last,
    });
  }

  const orQuery = toOrQuery(search);
  const andQuery = toAndQuery(search);
  const qs = /* sql */ `
    SELECT * FROM search_gigs('${andQuery}', '${orQuery}');
  `;

  return pg.query(qs).then(r => r.rows);
}

export default {
  Query: {
    gig: (_, { id }) => prisma.gig({ id }),
    searchGigs,
    gigs: (_, args) => prisma.gigs(args),
    gigsListLanding: () => prisma.gigs({ first: 6, orderBy: 'createdAt_DESC' }),
  },
  Mutation: {
    createGig: async (_, { gig, employer }) => {
      const existingUser = await prisma.$exists.user({ email: employer.email });
      const password = await argon2.hash(uuidv4());

      // Create tags that do not exist
      const existingTags = await Promise.all(
        gig.tags.map(tag =>
          prisma.$exists.tag({
            name: tag,
          }),
        ),
      );
      const tagsToCreate = gig.tags.filter(
        (tag, index) => !existingTags[index],
      );
      await Promise.all(
        tagsToCreate.map(tag => prisma.createTag({ name: tag })),
      );

      const createGigInput = {
        ...transformGigInput({ ...gig, avatarFileId: employer.avatarFileId }),
        employer: {
          create: {
            ...transformEmployerInput(employer),
            asUser: existingUser
              ? {
                  connect: {
                    email: employer.email,
                  },
                }
              : {
                  create: {
                    email: employer.email,
                    role: 'MEMBER',
                    password,
                  },
                },
          },
        },
      };
      return prisma.createGig(createGigInput);
    },
    deleteGig: async (_, args) => {
      await prisma.deleteGig(args);

      return true;
    },
  },
  Gig: {
    employer: ({ id }) => prisma.gig({ id }).employer(),
    tags: ({ id }) => prisma.gig({ id }).tags(),
    media: ({ id }) => prisma.gig({ id }).media(),
  },
};

/**
 * text query references
 * full text SQL architecture: https://docs.microsoft.com/en-us/sql/relational-databases/search/full-text-search?view=sql-server-ver15
 * postgres full text reference: https://www.postgresql.org/docs/9.5/textsearch.html
 * using view: https://www.postgresql.org/docs/9.5/tutorial-views.html
 *
 * working example: https://stackoverflow.com/questions/45123689/can-a-view-of-multiple-tables-be-used-for-full-text-search
 *
 * import/export pg db: https://www.a2hosting.com/kb/developer-corner/postgresql/import-and-export-a-postgresql-database
 */
