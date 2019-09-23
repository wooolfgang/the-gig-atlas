import { chain, allow } from 'graphql-shield';
import { verifyUser, isAuthenticated } from '../auth/rules';

export default {
  Mutation: {
    setEmployer: chain(verifyUser, isAuthenticated),
  },
  Employer: allow,
};
