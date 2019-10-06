import { allow, chain } from 'graphql-shield';
import common from '@shared/common';
import { validate, hasNoAuth } from '../utils/rules';

export default {
  Query: {
    checkValidToken: allow,
    googleOAuthURL: hasNoAuth,
  },
  Mutation: {
    signup: chain(hasNoAuth, validate(common.validation.signupInput)),
    login: chain(hasNoAuth, validate(common.validation.signinInput)),
    oauth: hasNoAuth,
  },
  AuthPayload: allow,
  OAuthResult: allow,
};
