
export default {
  Query: {
    User: (parent, { id }, { prisma }, info) => prisma.user({ id }, info),
    users: (parent, args, ctx) => ctx.prisma.users(),
  },
  Mutation: {
    updateUser: (parent, { id, ...data }, { prisma }) => {
      return prisma.updateUser({ data, where: { id } });
    },
  },
};
