import { and, allow } from 'graphql-shield';
import { verifyUser, isAdmin, isAuthenticated } from '../auth/rules';

export default {
  Query: {
    user: and(verifyUser, isAuthenticated),
  },
  Mutation: {
    deleteUser: and(verifyUser, isAdmin),
  },
  User: allow,
};
