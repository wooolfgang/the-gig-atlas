import * as yup from 'yup';
import { chain } from 'graphql-shield';
import common from '@shared/common';
import { isAuthenticated, validate, dompurify } from '../utils/rules';

export default {
  Mutation: {
    freelancerOnboardingPersonal: chain(
      dompurify('input.bio'),
      validate(
        yup
          .object()
          .shape({ input: common.validation.freelancerPersonalInput }),
      ),
      isAuthenticated,
    ),
    freelancerOnboardingPortfolio: chain(
      validate(
        yup
          .object()
          .shape({ input: common.validation.freelancerPotfolioInput }),
      ),
      isAuthenticated,
    ),
    skipFreelancerOnboarding: isAuthenticated,
  },
};
