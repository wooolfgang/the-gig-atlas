import { allow } from 'graphql-shield';

export default {
  Mutation: {
    signup: allow,
    login: allow,
  },
  AuthPayload: allow,
};
