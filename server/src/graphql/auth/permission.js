import { allow, chain } from 'graphql-shield';
import common from '@shared/common';
import { validate, hasNoAuth } from '../utils/rules';

export default {
  Query: {
    checkValidToken: allow,
    oauthURL: hasNoAuth,
  },
  Mutation: {
    signup: chain(hasNoAuth, validate(common.validation.signupInput)),
    login: chain(hasNoAuth, validate(common.validation.signinInput)),
    oauth: hasNoAuth,
  },
  AuthPayload: allow,
  OAuthResult: allow,
  OAuthURL: allow,
};
