export default {
  Query: {
    employers: (_, _args, ctx) => ctx.prisma.employers(),
    searchEmployers: (_, { name }, ctx) =>
      ctx.prisma.employers({ where: { name_contains: name } }),
  },
  Mutation: {
    newEmployer: async (_, { info }, { prisma }) => {
      const res = await prisma.createEmployer(info);

      return res;
    },
    deleteEmployer: async (_, { id }, { prisma }) => {
      const res = await prisma.deleteEmployer({ id });

      return res;
    },
  },
};
