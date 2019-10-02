import { chain, allow } from 'graphql-shield';
import common from '@shared/common';
import { validate, isAuthenticated } from '../utils/rules';

export default {
  Mutation: {
    setEmployer: chain(
      validate(common.validation.setEmployerInput),
      isAuthenticated,
    ),
  },
  Employer: allow,
};
