import { allow, chain } from 'graphql-shield';
import { validation } from '@shared/common';
import { isAuthenticated, validate, dompurify } from '../utils/rules';

export default {
  Mutation: {
    createThread: chain(
      validate.withShape({ input: validation.threadInput }),
      dompurify('input.body'),
      isAuthenticated,
    ),
    createComment: chain(
      validate.withShape({ input: validation.commentInput }),
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
  ThreadTag: allow,
  Comment: allow,
};
