import { allow } from 'graphql-shield';
import verifyAdmin from './verifyAdmin';

export default {
  Mutation: {
    adminSignup: verifyAdmin,
    adminLogin: allow,
  },
  AuthPayload: allow,
};
