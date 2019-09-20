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
    newGig: (_, { employerId, info }, { prisma }) => {
      const create = {
        employer: {
          connect: { id: employerId },
        },
        ...transformGigInput(info),
      };

      return prisma.createGig(create);
    },
    deleteGig: async (_, args, { prisma }) => {
      prisma.deleteGig(args);

      return true;
    },
  },
  Gig: {
    employer: ({ id }, _, { prisma }) => prisma.gig({ id }).employer(),
  },
};
