import { transformGigInput } from '../gig/resolver';

export default {
  Query: {
    employers: (_, _args, ctx) => ctx.prisma.employers(),
    searchEmployers: (_, { name }, ctx) =>
      ctx.prisma.employers({ where: { name_contains: name } }),
  },
  Mutation: {
    setEmployer: async (_, { input }, { prisma, user }) => {
      // check if user is already an emplyer
      const exist = await prisma.user({ id: user.id }).asEmployer();
      if (exist) {
        throw new Error('Already an Employer');
      }

      let create = input;
      if (input.gig) {
        const { gig, ...employer } = input;
        create = {
          asUser: { connect: { id: user.id } },
          gigs: { create: [transformGigInput(gig)] },
          ...employer,
        };
      }

      return prisma.createEmployer(create);
    },
  },
  Employer: {
    gigs: ({ id }, _, { prisma }) => prisma.employer({ id }).gigs(),
  },
};
