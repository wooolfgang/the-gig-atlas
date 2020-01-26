/* eslint-disable no-plusplus */
import uuidv4 from 'uuid/v4';
import argon2 from 'argon2';
import prisma from '@thegigatlas/prisma';
import { createFragment, createSubFragment } from '../utils/fragment';
// eslint-disable-next-line import/no-cycle
import { transformEmployerInput } from '../employer/resolver';
// import { fullDisplay } from '../utils/display';
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

function _sortGigsByIds(ids, gigs) {
  const idMap = ids.reduce((map, id, i) => {
    // eslint-disable-next-line no-param-reassign
    map[id] = i;

    return map;
  }, {});

  gigs.sort((a, b) => idMap[a.id] - idMap[b.id]);
  return gigs;
}

/**
 * Search gigs
 * target fields: 1.titles, 2.tags, 3.employers
 */
async function searchGigs(_r, { search, where = {} }, { pg }, info) {
  const { first, skip } = where;
  const qs = gigSearchQuery(search, where);
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
  const sortedGigs = _sortGigsByIds(id_in, gigs);

  return { ids, gigs: sortedGigs };
}

async function nextPage(_, { ids }, _c, info) {
  const frag = createFragment(info, 'NextGig', 'Gig', true);
  const gigs = await prisma.gigs({ where: { id_in: ids } }).$fragment(frag);

  return _sortGigsByIds(ids, gigs);
}

export default {
  Query: {
    gig: (_, { id }) => prisma.gig({ id }),
    searchGigs,
    nextPage,
    gigs: (_, args, _1, info) =>
      prisma.gigs(args).$fragment(createFragment(info, 'Gigs', 'Gig', true)),
    gigsListLanding: () => prisma.gigs({ first: 6, orderBy: 'createdAt_DESC' }),
    // .$fragment(createFragment(info, 'GigsLand', 'Gig', true)),
  },
  Mutation: {
    createGig: async (_, { gig, employer }) => {
      const existingUser = await prisma.$exists.user({ email: employer.email });
      // const password = await argon2.hash(uuidv4());

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
                    password: await argon2.hash(uuidv4()),
                  },
                },
          },
        },
      };

      return prisma.createGig(createGigInput);
      // .$fragment(createFragment(info, 'GigCreateFrag', 'Gig', true));
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
