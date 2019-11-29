import prisma from '@thegigatlas/prisma';
import { createFragment } from '../utils/fragment';

export default {
  Mutation: {},

  Query: {
    freelancers: async (_, args, _c, info) => prisma.freelancers(args, info),
  },

  Freelancer: {
    asUser: async (root, _a, _c, info) => {
      const fragment = createFragment(info, 'UserFromFreelancer', 'Freelancer');
      return prisma
        .freelancer({ id: root.id })
        .asUser()
        .$fragment(fragment);
    },
    avatar: async ({ id }, _a, _c, info) => {
      const fragment = createFragment(
        info,
        'AvatarFromFreelancer',
        'Freelancer',
      );

      return prisma
        .freelancer({ id })
        .asUser()
        .avatar()
        .$fragment(fragment);
    },
    portfolio: ({ id }) => prisma.freelancer({ id }).portfolio(),
    socials: ({ id }) => prisma.freelancer({ id }).socials(),
  },
};
