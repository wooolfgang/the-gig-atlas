import uuidv4 from 'uuid/v4';
import argon2 from 'argon2';
import prisma from '@thegigatlas/prisma';
// eslint-disable-next-line import/no-cycle
import { transformEmployerInput } from '../employer/resolver';

export function transformGigInput(gigInput) {
  return {
    ...gigInput,
    tags: {
      connect: gigInput.tags.map(tag => ({ name: tag })),
    },
  };
}

/**
 * Search gigs
 * target fields: 1.titles, 2.tags, 3.employers
 */
// async function searchGigs(_r, { search }) {
//   const qs = `
//     SELECT id, title
//     FROM Gigs
//     WHERE
//   `;
//   // prisma.$raw()

//   return [];
// }

export default {
  Query: {
    gigs: (_, args) => prisma.gigs(args),
    searchGigs: (_, { search }) =>
      prisma.gigs({ where: { title_contains: search } }),
    gigsListLanding: () => prisma.gigs({ first: 6, orderBy: 'createdAt_DESC' }),
  },
  Mutation: {
    createGig: async (_, { gig, employer }) => {
      const existingUser = await prisma.$exists.user({ email: employer.email });
      const password = await argon2.hash(uuidv4());
      const createGigInput = {
        ...transformGigInput(gig),
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
