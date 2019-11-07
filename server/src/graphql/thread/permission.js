import { allow, chain } from 'graphql-shield';
import * as yup from 'yup';
import common from '@shared/common';
import { isAuthenticated, validate, dompurify } from '../utils/rules';

export default {
  Mutation: {
    createThread: chain(
      validate(
        yup.object().shape({
          input: common.validation.threadInput,
        }),
      ),
      dompurify('input.body'),
      isAuthenticated,
    ),
    createComment: chain(
      validate(
        yup.object().shape({
          input: common.validation.commentInptu,
        }),
      ),
      dompurify('input.text'),
      isAuthenticated,
    ),
  },
  Query: {
    thread: allow,
    threads: allow,
    threadTags: allow,
  },
  Thread: allow,
  Comment: allow,
};
