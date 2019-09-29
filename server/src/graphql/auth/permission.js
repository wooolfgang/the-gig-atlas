import { allow, chain, not } from 'graphql-shield';
import common from '@shared/common';
// import * as yup from 'yup';
import { validate, verifyUser, isAuthenticated } from '../utils/rules';

export default {
  Query: {
    googleAuth: chain(verifyUser, not(isAuthenticated)),
  },
  Mutation: {
    signup: chain(
      verifyUser,
      not(isAuthenticated),
      validate(common.validation.signupInput),
    ),
    login: chain(verifyUser, not(isAuthenticated)),
  },
  AuthPayload: allow,
};
