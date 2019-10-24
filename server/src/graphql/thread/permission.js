import { allow, chain } from 'graphql-shield';
import * as yup from 'yup';
import common from '@shared/common';
import { isAuthenticated, validate } from '../utils/rules';

export default {
  Mutation: {
    createThread: chain(
      validate(
        yup.object().shape({
          input: common.validation.threadInput,
        }),
      ),
      isAuthenticated,
    ),
    createComment: chain(
      validate(
        yup.object().shape({
          input: common.validation.commentInptu,
        }),
      ),
      isAuthenticated,
    ),
  },
  Query: {
    threads: allow,
  },
  Thread: allow,
  Comment: allow,
};
