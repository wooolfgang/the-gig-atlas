/* eslint-disable import/no-cycle */
import uuidv4 from 'uuid/v4';
import argon2 from 'argon2';
import prisma from '@thegigatlas/prisma';
import { createFragment } from '../utils/fragment';
import { transformEmployerInput } from '../employer/resolver';
import { gigSearchQuery } from './utils';

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

async function searchGigs(_r, args, { pg }, info) {
  const { search, where = {}, first = 8, skip = 0 } = args;

  if (!search) {
    const gigs = await prisma.gigs({
      where,
      first,
      skip,
      orderBy: 'createdAt_DESC',
      status: 'POSTED',
    });
    const total = await prisma
      .gigsConnection()
      .aggregate()
      .count();

    return { gigs, total };
  }

  const qs = gigSearchQuery({
    search,
    where,
    first,
    skip,
  });

  const { rows } = await pg.query(qs);
  const total = (rows[0] && rows[0].total) || 0;
  return { gigs: rows, total };
}

export default {
  Query: {
    gig: (_, { id }) => prisma.gig({ id }),
    searchGigs,
    gigs: (_, args, _1, info) =>
      prisma.gigs(args).$fragment(createFragment(info, 'Gigs', 'Gig', true)),
    gigsListLanding: () => prisma.gigs({ first: 6, orderBy: 'createdAt_DESC' }),
  },
  Mutation: {
    createGig: async (_, { gig, employer }) => {
      const existingUser = await prisma.$exists.user({ email: employer.email });
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
                    password: await argon2.hash(uuidv4()),
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
 * -- text query references --
 * Full text search in postgres: http://rachbelaid.com/postgres-full-text-search-is-good-enough/
 * Getting total before offset/limit: https://stackoverflow.com/questions/28888375/run-a-query-with-a-limit-offset-and-also-get-the-total-number-of-rows
 * full text SQL architecture: https://docs.microsoft.com/en-us/sql/relational-databases/search/full-text-search?view=sql-server-ver15
 * postgres full text reference: https://www.postgresql.org/docs/9.5/textsearch.html
 * using view: https://www.postgresql.org/docs/9.5/tutorial-views.html
 * working example: https://stackoverflow.com/questions/45123689/can-a-view-of-multiple-tables-be-used-for-full-text-search
 * import/export pg db: https://www.a2hosting.com/kb/developer-corner/postgresql/import-and-export-a-postgresql-database
 */
