import { allow, chain } from 'graphql-shield';
import common from '@shared/common';
// import * as yup from 'yup';
import { validate, hasNoAuth } from '../utils/rules';

export default {
  Query: {
    checkValidToken: allow,
    oauthURL: hasNoAuth,
  },
  Mutation: {
    signup: chain(hasNoAuth, validate(common.validation.signupInput)),
    login: hasNoAuth,
    oauth: hasNoAuth,
  },
  AuthPayload: allow,
  OAuthResult: allow,
  OAuthURL: allow,
};
