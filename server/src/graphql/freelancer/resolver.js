export default {
  Mutation: {
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

    freelancerOnboardingPortfolio: async (_, { input }, { prisma, user }) => {
      const { socials, portfolio, skills } = input;
      const res = await prisma.updateUser({
        where: {
          id: user.id,
        },
        data: {
          freelancerOnboardingStep: 'FINISHED',
          asFreelancer: {
            update: {
              skills: {
                set: skills,
              },
              socials: {
                create: socials,
              },
              portfolio: {
                create: portfolio.map(p => ({
                  ...p,
                  images: {
                    connect: p.images,
                  },
                })),
              },
            },
          },
        },
      });

      return !!res;
    },

    skipFreelancerOnboarding: async (_, args, { prisma, user }) => {
      const res = await prisma.updateUser({
        where: {
          id: user.id,
        },
        data: {
          freelancerOnboardingStep: 'FINISHED',
        },
      });
      return !!res;
    },
  },
};
