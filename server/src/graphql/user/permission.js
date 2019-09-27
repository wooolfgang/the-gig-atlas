import { chain, allow } from 'graphql-shield';
import { verifyUser, isAdmin, isAuthenticated } from '../auth/rules';

export default {
  Query: {
    user: chain(verifyUser, isAuthenticated),
  },
  Mutation: {
    deleteUser: chain(verifyUser, isAdmin),
  },
  User: allow,
};
