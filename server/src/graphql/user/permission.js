import { and } from 'graphql-shield';
import { verifyUser, isAdmin } from '../auth/rules';

export default {
  Mutation: {
    deleteUser: and(verifyUser, isAdmin),
  },
};
