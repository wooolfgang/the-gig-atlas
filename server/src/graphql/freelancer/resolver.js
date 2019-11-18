import { createFragment } from '../utils/fragment';

export default {
  Mutation: {},

  Query: {
    freelancers: async (_, args, { prisma }, info) =>
      prisma.freelancers(args, info),
  },

  Freelancer: {
    asUser: async (root, _args, { prisma }, info) => {
      const fragment = createFragment(info, 'UserFromFreelancer', 'Freelancer');
      return prisma
        .freelancer({ id: root.id })
        .asUser()
        .$fragment(fragment);
    },
    avatar: async (root, _args, { prisma }, info) => {
      const fragment = createFragment(
        info,
        'AvatarFromFreelancer',
        'Freelancer',
      );
      return prisma
        .freelancer({ id: root.id })
        .asUser()
        .avatar()
        .$fragment(fragment);
    },
    portfolio: (root, args, { prisma }) =>
      prisma.freelancer({ id: root.id }).portfolio(),
    socials: ({ id }, args, { prisma }) => prisma.freelancer({ id }).socials(),
  },
};
