import { createFragment } from '../utils/fragment';
import prisma from '../../prisma';

const onboardingResFrag = `
  fragment EmpOnbdRes on User {
    id
    firstName
    lastName
    onboardingStep
    accountType
  }
`;

async function onboardingPersonal(_r, { input }, { user: auth }) {
  const { accountType, firstName, lastName, avatarFileId } = input;
  const { id } = auth;
  const fragment = `
      fragment PersonalOnboard on User {
        id
        firstName
        lastName
        onboardingStep
        asEmployer { id }
        asFreelancer { id }
      }
    `;
  // => get user with respective account type for validation
  const user = await prisma.user({ id }).$fragment(fragment);
  if (!user) {
    throw new Error('Invalid user');
  }
  let onboardingStep;

  // eslint-disable-next-line prettier/prettier
  if (!user.onboardingStep) {
    throw new Error('Invalid onboarding access');
  }

  if (accountType === 'EMPLOYER') {
    if (user.asEmployer) {
      throw new Error('Already an employer');
    }
    onboardingStep = 'EMPLOYER';
  } else if (accountType === 'FREELANCER') {
    if (user.asFreelancer) {
      throw new Error('Already an freelancer');
    }
    onboardingStep = 'FREELANCER';
  } else {
    throw new Error('Invalid account type');
  }

  return prisma
    .updateUser({
      where: { id },
      data: {
        firstName,
        lastName,
        onboardingStep,
        accountType,
        avatar: {
          connect: {
            id: avatarFileId,
          },
        },
      },
    })
    .$fragment(onboardingResFrag);
}

async function onboardingEmployer(_, { input }, { user: auth }) {
  const { id } = auth;
  const { ...employer } = input;
  const userFrag = `
      fragment EmpOnb on User {
        id
        onboardingStep
        asEmployer { id }
      }
    `;

  const { onboardingStep, asEmployer } = await prisma
    .user({ id })
    .$fragment(userFrag);

  if (onboardingStep !== 'EMPLOYER') {
    throw new Error('Invalid onboarding access');
  }
  if (asEmployer) {
    throw new Error('Already an employer');
  }

  return prisma
    .updateUser({
      where: { id },
      data: {
        onboardingStep: null,
        asEmployer: {
          create: {
            ...employer,
          },
        },
      },
    })
    .$fragment(onboardingResFrag);
}

async function onboardingFreelancer(_r, { input }, { user: auth }) {
  const { id } = auth;
  // const { avatarFileId, ...create } = input;
  const userFrag = `
      fragment EmpOnb on User {
        id
        onboardingStep
        asFreelancer { id }
      }
    `;
  const { onboardingStep, asFreelancer } = await prisma
    .user({ id })
    .$fragment(userFrag);

  if (onboardingStep !== 'FREELANCER') {
    throw new Error('Invalid onboarding access');
  }
  if (asFreelancer) {
    throw new Error('Already a freelancer');
  }

  const portfolio = input.portfolio.map(p => ({
    ...p,
    images: {
      connect: p.images,
    },
  }));
  const skills = { set: input.skills };
  const socials = { create: input.socials };

  return prisma
    .updateUser({
      where: { id },
      data: {
        onboardingStep: null,
        asFreelancer: {
          create: {
            ...input,
            skills,
            socials,
            portfolio: { create: portfolio },
          },
        },
      },
    })
    .$fragment(onboardingResFrag);
}

export default {
  Query: {
    user: (_, _a, { user: { id } }, info) => prisma.user({ id }, info),
    getUser: (_, args, _c, info) => prisma.user(args.where, info),
  },
  Mutation: {
    onboardingPersonal,
    onboardingEmployer,
    onboardingFreelancer,
    deleteUser: async (_r, { id }) => {
      const res = await prisma.deleteUser({ id });

      return !!res;
    },
  },
  User: {
    asEmployer: async (root, _a, _c, info) => {
      const fragment = createFragment(info, 'AsEmployerFromUser', 'Employer');

      return prisma
        .user({ id: root.id })
        .asEmployer()
        .$fragment(fragment);
    },
    asFreelancer: (root, _a, _c, info) => {
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
    avatar: async (root, _a, _c, info) => {
      const fragment = createFragment(info, 'AvatarFromUser', 'Avatar');
      return prisma
        .user({ id: root.id })
        .avatar()
        .$fragment(fragment);
    },
  },
};
