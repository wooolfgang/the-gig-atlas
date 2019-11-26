import { allow, chain, rule } from 'graphql-shield';
import { validation } from '@shared/common';
import { isAuthenticated, validate, dompurify } from '../utils/rules';
import prisma from '../../prisma';
import { UPVOTE_VALUE } from './constants';

const hasNotUpvoted = type =>
  rule()(async (_, args, { user }) => {
    const voted = await prisma.$exists[type]({
      AND: {
        value: UPVOTE_VALUE,
        user: {
          id: user.id,
        },
      },
    });
    return !voted;
  });

const hasNotUpvotedThread = hasNotUpvoted('threadVote');
const hasNotUpvotedComment = hasNotUpvoted('commentVote');

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
    upvoteThread: chain(isAuthenticated, hasNotUpvotedThread),
    upvoteComment: chain(isAuthenticated, hasNotUpvotedComment),
  },
  Query: {
    thread: allow,
    threads: allow,
  },
  Thread: allow,
  Tag: allow,
  Comment: allow,
};
