import { allow } from 'graphql-shield';
import { isAdminOnly, isAuthenticated } from '../utils/rules';

export default {
  Query: {
    user: isAuthenticated,
  },
  Mutation: {
    deleteUser: isAdminOnly,
  },
  User: allow,
};
