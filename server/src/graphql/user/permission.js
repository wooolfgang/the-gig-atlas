import { allow, and } from 'graphql-shield';
import { validation } from '@shared/common';
import {
  isAdminOnly,
  isAuthenticated,
  validate,
  dompurify,
} from '../utils/rules';

export default {
  Query: {
    user: isAuthenticated,
  },
  Mutation: {
    deleteUser: isAdminOnly,
    onboardingPersonal: and(
      validate.withShape({ input: validation.onboardingPersonal }),
      isAuthenticated,
    ),
    onboardingEmployer: and(
      validate.withShape({ input: validation.onboardingEmployer }),
      isAuthenticated,
    ),
    onboardingFreelancer: and(
      dompurify({ name: 'input.bio', isNeed: false }),
      validate.withShape({ input: validation.freelancerPortfolioInput }),
      isAuthenticated,
    ),
  },
  User: allow,
};
