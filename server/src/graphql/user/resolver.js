import { createFragment } from '../utils/fragment';
import prisma from '../../prisma';

async function onboardingPersonal(_, { input }) {
  const { accountType, id, firstName, lastName } = input;
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

  await prisma.updateUser({
    where: { id },
    data: {
      firstName,
      lastName,
      onboardingStep,
    },
  });

  return {
    id,
    onboardingStep,
  };
}

async function onboardingEmployer(_, { input }) {
  const { id, avatarFileId, ...employer } = input;
  const userFrag = `
      fragment EmpOnb on User {
        id
        onboardingStep
        asEmployer { id }
      }
    `;
  const resFrag = `
    fragment EmpOnbdRes on User {
      id
      onboardingStep
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
    .$fragment(resFrag);
}

export default {
  Query: {
    user: (_, _args, { user: { id } }, info) => prisma.user({ id }, info),
  },
  Mutation: {
    onboardingPersonal,
    onboardingEmployer,
    deleteUser: async (_, { id }) => {
      const res = await prisma.deleteUser({ id });

      return !!res;
    },
  },
  User: {
    asEmployer: async (root, _args, _, info) => {
      const fragment = createFragment(info, 'AsEmployerFromUser', 'Employer');

      return prisma
        .user({ id: root.id })
        .asEmployer()
        .$fragment(fragment);
    },
    asFreelancer: async (root, _args, _, info) => {
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
