export default {
  Query: {
    admins: (_, args, ctx) => ctx.prisma.admins(args),
    admin: (_, { id }, { prisma }) => prisma.admin({ id }),
  },
  Mutation: {
    deleteAdmin: async (_, { id }, { prisma, admin }) => {
      if (id !== admin.id) {
        throw new Error('Athorization failed');
      }

      const res = await prisma.deleteAdmin({ id });

      return !!res;
    },
  },
};
