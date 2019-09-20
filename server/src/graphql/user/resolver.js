export default {
  Query: {
    //
  },
  Mutation: {
    deleteUser: async (_, { id }, { prisma }) => {
      const res = await prisma.deleteUser({ id });

      return !!res;
    },
  },
};
