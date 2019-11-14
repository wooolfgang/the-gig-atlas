import { createFragment } from '../utils/fragment';
import prisma from '../../prisma';

export default {
  Mutation: {},
  Query: {
    freelancers: async (_, args, _ctx, info) => prisma.freelancers(args, info),
  },

  Freelancer: {
    asUser: async (root, _args, _ctx, info) => {
      const fragment = createFragment(info, 'UserFromFreelancer', 'Freelancer');
      return prisma
        .freelancer({ id: root.id })
        .asUser()
        .$fragment(fragment);
    },
    avatar: async (root, _args, _ctx, info) => {
      const fragment = createFragment(
        info,
        'AvatarFromFreelancer',
        'Freelancer',
      );
      return prisma
        .freelancer({ id: root.id })
        .avatar()
        .$fragment(fragment);
    },
    portfolio: root => prisma.freelancer({ id: root.id }).portfolio(),
    socials: ({ id }) => prisma.freelancer({ id }).socials(),
  },
};
