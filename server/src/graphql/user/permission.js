import { chain, allow } from 'graphql-shield';
import { verifyUser, isAdmin, isAuthenticated } from '../utils/rules';

export default {
  Query: {
    user: chain(verifyUser, isAuthenticated),
  },
  Mutation: {
    deleteUser: chain(verifyUser, isAdmin),
  },
  User: allow,
};
