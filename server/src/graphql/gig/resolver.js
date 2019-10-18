import uuidv4 from 'uuid/v4';
import argon2 from 'argon2';
// eslint-disable-next-line import/no-cycle
import { transformEmployerInput } from '../employer/resolver';

export function transformGigInput(gigInput) {
  return {
    ...gigInput,
    technologies: {
      set: gigInput.technologies || [],
    },
  };
}
export default {
  Query: {
    gigs: (_, args, { prisma }) => prisma.gigs(args),
    searchGigs: (_, { search }, { prisma }) =>
      prisma.gigs({ where: { title_contains: search } }),
    gigsListLanding: (_, args, { prisma }) =>
      prisma.gigs({ first: 6, orderBy: 'createdAt_DESC' }),
  },
  Mutation: {
    createGig: async (_, { gig, employer }, { prisma }) => {
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
    deleteGig: async (_, args, { prisma }) => {
      await prisma.deleteGig(args);

      return true;
    },
  },
  Gig: {
    employer: ({ id }, _, { prisma }) => prisma.gig({ id }).employer(),
  },
};
