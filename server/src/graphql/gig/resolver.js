/* eslint-disable no-plusplus */
import uuidv4 from 'uuid/v4';
import argon2 from 'argon2';
import prisma from '@thegigatlas/prisma';
import { createFragment, createSubFragment } from '../utils/fragment';
// eslint-disable-next-line import/no-cycle
import { transformEmployerInput } from '../employer/resolver';
// import { fullDisplay } from '../utils/display';
import { gigSearchQuery } from './utils';

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
async function searchGigs(_r, { search, where = {} }, { pg }, info) {
  const { first, skip } = where;
  const qs = gigSearchQuery(search, where);
  console.log(qs);
  const { rows } = await pg.query(qs); // .catch(e => console.log(e));
  const ids = rows.map(r => r.id);

  if (rows.length === 0) {
    return { gigs: [], ids: [] };
  }

  const id_in = [];
  const itemCount = first || 20;
  const begin = skip || 0;
  for (let i = begin; i < itemCount; i++) {
    const id = ids[i];
    if (!id) break;
    id_in.push(id);
  }

  const frag = createSubFragment(info, 'GigSearch', 'Gig', 'gigs', true);
  const gigs = await prisma.gigs({ where: { id_in } }).$fragment(frag);
  // => sort gigs to its original index position
  const idMap = id_in.reduce((map, id, i) => {
    // eslint-disable-next-line no-param-reassign
    map[id] = i;

    return map;
  }, {});
  gigs.sort((a, b) => idMap[a.id] - idMap[b.id]);

  return { gigs, ids };
}

export default {
  Query: {
    searchGigs,
    gigs: (_, args, _1, info) =>
      prisma.gigs(args).$fragment(createFragment(info, 'Gigs', 'Gig', true)),
    gigsListLanding: (_, _0, _1, info) =>
      prisma
        .gigs({ first: 6, orderBy: 'createdAt_DESC' })
        .$fragment(createFragment(info, 'GigsLand', 'Gig', true)),
  },
  Mutation: {
    createGig: async (_, { gig, employer }, _c, info) => {
      const existingUser = await prisma.$exists.user({ email: employer.email });
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
                    password: await argon2.hash(uuidv4()),
                  },
                },
          },
        },
      };

      return prisma
        .createGig(createGigInput)
        .$fragment(createFragment(info, 'GigCreate', 'Gig', true));
    },
    deleteGig: async (_, args) => {
      await prisma.deleteGig(args);

      return true;
    },
  },
  Gig: {
    employer: ({ id, employer }) => employer || prisma.gig({ id }).employer(),
    tags: ({ id, tags }) => tags || prisma.gig({ id }).tags(),
    media: ({ id, media }) => media || prisma.gig({ id }).media(),
  },
  // GigSearch: {
  //   gigs: ({ gigs }) => gigs,
  //   ids: ({ ids }) => ids,
  // },
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
