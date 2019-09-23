import { and, allow } from 'graphql-shield';
import { verifyUser, isAuthenticated } from '../auth/rules';

export default {
  Mutation: {
    setEmployer: and(verifyUser, isAuthenticated),
  },
  Employer: allow,
};
