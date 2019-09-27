import { allow } from 'graphql-shield';
import common from '@shared/common';
// import * as yup from 'yup';
import { validate } from '../utils/rules';

export default {
  Mutation: {
    signup: validate(common.validation.signupInput),
    login: allow,
  },
  AuthPayload: allow,
};
