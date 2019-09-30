import uuidv4 from 'uuid/v4';
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
    gigs: (_, args, { prisma }) => prisma.gigs(),
    searchGigs: (_, { search }, { prisma }) =>
      prisma.gigs({ where: { title_contains: search } }),
  },
  Mutation: {
    createGig: async (_, { gig, employer }, { prisma }) => {
      const createGigInput = {
        ...transformGigInput(gig),
        employer: {
          create: {
            ...transformEmployerInput(employer),
            asUser: {
              create: {
                email: employer.email,
                role: 'MEMBER',
                password: uuidv4(),
              },
            },
          },
        },
      };

      const [existingEmployer] = await prisma.employers({
        where: {
          AND: {
            email: employer.email,
            asUser: {
              email: employer.email,
            },
          },
        },
      });

      if (existingEmployer) {
        await prisma.updateEmployer({
          data: transformEmployerInput(employer),
          where: {
            id: existingEmployer.id,
          },
        });
        createGigInput.employer = {
          connect: {
            id: existingEmployer.id,
          },
        };
      }

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
