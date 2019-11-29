import prisma from '@thegigatlas/prisma';
// eslint-disable-next-line import/no-cycle
import { transformGigInput } from '../gig/resolver';

export function transformEmployerInput({
  displayName,
  website,
  introduction,
  email,
  employerType,
  avatarFileId,
}) {
  return {
    displayName,
    website,
    introduction,
    email,
    employerType,
    avatar: {
      connect: {
        id: avatarFileId,
      },
    },
  };
}

export default {
  Query: {
    employers: (_, _args, ctx) => ctx.prisma.employers(),
    searchEmployers: (_, { name }, ctx) =>
      ctx.prisma.employers({ where: { name_contains: name } }),
  },
  Mutation: {
    setEmployer: async (_, { employer, gig }, { user }) => {
      const exist = await prisma.user({ id: user.id }).asEmployer();
      if (exist) {
        throw new Error('Already an Employer');
      }

      const create = {
        asUser: { connect: { id: user.id } },
        gigs: { create: [transformGigInput(gig)] },
        ...transformEmployerInput(employer),
      };

      return prisma.createEmployer(create);
    },
  },
  Employer: {
    gigs: ({ id }) => prisma.employer({ id }).gigs(),
    avatar: ({ id }) => prisma.employer({ id }).avatar(),
    asUser: ({ id }) => prisma.employer({ id }).asUser(),
  },
};
