import { allow, chain } from 'graphql-shield';
import * as yup from 'yup';
import common from '@shared/common';
import { isAdminOnly, isAuthenticated, validate } from '../utils/rules';

export default {
  Query: {
    user: isAuthenticated,
  },
  Mutation: {
    deleteUser: isAdminOnly,
    freelancerOnboardingPersonal: chain(
      validate(
        yup
          .object()
          .shape({ input: common.validation.freelancerPersonalInput }),
      ),
      isAuthenticated,
    ),
    freelancerOnboardingPortfolio: isAuthenticated,
  },
  User: allow,
};
