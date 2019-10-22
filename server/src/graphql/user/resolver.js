import { createFragment } from '../utils/fragment';

export default {
  Query: {
    user: (_, _args, { prisma, user: { id } }, info) => {
      const fragment = createFragment(info, 'ToUser', 'User');

      return prisma.user({ id }).$fragment(fragment);
    },
  },
  Mutation: {
    deleteUser: async (_, { id }, { prisma }) => {
      const res = await prisma.deleteUser({ id });

      return !!res;
    },
  },
  User: {
    asEmployer: async (root, _args, { prisma }, info) => {
      const fragment = createFragment(info, 'AsEmployerFromUser', 'Employer');

      return prisma
        .user({ id: root.id })
        .asEmployer()
        .$fragment(fragment);
    },
    asFreelancer: async (root, _args, { prisma }, info) => {
      const fragment = createFragment(
        info,
        'AsFreelancerFromUser',
        'Freelancer',
      );

      return prisma
        .user({ id: root.id })
        .asFreelancer()
        .$fragment(fragment);
    },
  },
};
