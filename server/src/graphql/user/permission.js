import { allow } from 'graphql-shield';
import { isAdminOnly, isAuthenticated } from '../utils/rules';

export default {
  Query: {
    user: isAuthenticated,
    getUser: allow,
  },
  Mutation: {
    deleteUser: isAdminOnly,
  },
  User: allow,
};
