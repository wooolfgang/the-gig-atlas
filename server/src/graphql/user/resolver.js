import { createFragment } from '../util';

export default {
  Query: {
    user: (_, _args, { prisma, user: { id } }, info) => {
      const fragment = createFragment(info, 'ToUser', 'User');
      return prisma.user({ id }).$fragment(fragment);
    },
  },
  Mutation: {
    deleteUser: async (_, { id }, { prisma, user }) => {
      console.log('here on delete user: ', id, user);
      const res = await prisma.deleteUser({ id });

      return !!res;
    },
  },
  User: {
    asEmployer: async (_, _args, { prisma, user: { id } }, info) => {
      const fragment = createFragment(info, 'FromUser', 'Employer');

      return prisma
        .user({ id })
        .asEmployer()
        .$fragment(fragment);
    },
  },
};
