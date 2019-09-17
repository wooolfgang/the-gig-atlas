export default {
  Query: {
    gigs: (_, args, { prisma }) => prisma.gigs(),
    searchGigs: (_, { search }, { prisma }) =>
      prisma.gigs({ where: { title_contains: search } }),
  },
  Mutation: {
    newGig: async (_, { info }, { prisma }) => {
      const res = await prisma.createGig(info);

      console.log("new gig: ", res);

      return res;
    },
    deleteGig: async (_, args, { prisma }) => {
      const res = await prisma.deleteGig(args);

      console.log('delted gig', res);
      return res;
    },
  },
};
