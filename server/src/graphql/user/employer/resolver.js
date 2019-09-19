import { transformGigInput } from '../../gig/resolver';

export default {
  Query: {
    employers: (_, _args, ctx) => ctx.prisma.employers(),
    searchEmployers: (_, { name }, ctx) =>
      ctx.prisma.employers({ where: { name_contains: name } }),
  },
  Mutation: {
    newEmployer: async (_, { info }, { prisma }, gqlinfo) => {
      let create = info;

      if (info.gig) {
        const { gig, ...employer } = info;

        create = {
          gigs: { create: [transformGigInput(gig)] },
          ...employer,
        };
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
