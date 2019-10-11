import { createFragment } from '../util';

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

    freelancerOnboardingPersonal: async (_, { input }, { prisma, user }) => {
      const { avatarFileId, firstName, lastName, ...asFreelancer } = input;
      const res = await prisma.updateUser({
        where: {
          id: user.id,
        },
        data: {
          firstName,
          lastName,
          freelancerOnboardingStep: 'PORTFOLIO',
          asFreelancer: {
            create: {
              ...asFreelancer,
              avatar: {
                connect: {
                  id: avatarFileId,
                },
              },
            },
          },
        },
      });
      return !!res;
    },

    freelancerOnboardingPortfolio: async (_, { input }, { prisma, user }) => {},
  },
  User: {
    asEmployer: async (_, _args, { prisma, user: { id } }, info) => {
      const fragment = createFragment(info, 'FromUser', 'Employer');

      return prisma
        .user({ id })
        .asEmployer()
        .$fragment(fragment);
    },
    asFreelancer: async (_, _args, { prisma, user: { id } }, info) => {
      const fragment = createFragment(info, 'FromUser', 'Freelancer');

      return prisma
        .user({ id })
        .asFreelancer()
        .$fragment(fragment);
    },
  },
};
