export default {
  Query: {
    admins: (_, args, ctx) => ctx.prisma.admins(args),
    admin: (_, { id }, { prisma }) => prisma.admin({ id }),
  },
  Mutation: {
    // newAdmin: (_, { input }, { prisma }) => {

    //   return prisma.crateAdmin(input);
    // },
  },
};
