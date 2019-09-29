import { chain, allow } from 'graphql-shield';
import common from '@shared/common';
import { validate, verifyUser, isAuthenticated } from '../utils/rules';

export default {
  Mutation: {
    setEmployer: chain(
      validate(common.validation.employerInput),
      verifyUser,
      isAuthenticated,
    ),
  },
  Employer: allow,
};
