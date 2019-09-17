export default {
  Query: {
    employers: (_, _args, ctx) => ctx.prisma.employers(),
    searchEmployers: (_, { name }, ctx) =>
      ctx.prisma.employers({ where: { name_contains: name } }),
  },
  Mutation: {
    newEmployer: async (_, { info }, { prisma }, gqlinfo) => {
      let create;
      if (info.gig) {
        const { gig, ...employer } = info;

        gig.technologies = { set: gig.technologies };
        create = {
          gigs: { create: [gig] },
          ...employer,
        };
      } else {
        create = info;
      }

      return prisma.createEmployer(create, gqlinfo);
    },
    deleteEmployer: async (_, { id }, { prisma }) => {
      const res = await prisma.deleteEmployer({ id });

      return !!res;
    },
  },
  Employer: {
    gigs: ({ id }, _, { prisma }) => prisma.employer({ id }).gigs(),
  },
};
