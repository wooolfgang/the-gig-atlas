import { allow, chain, rule } from 'graphql-shield';
import { validation } from '@shared/common';
import prisma from '@thegigatlas/prisma';
import { isAuthenticated, validate, dompurify } from '../utils/rules';
import { UPVOTE_VALUE } from './constants';

const hasNotUpvoted = type =>
  rule()(async (_, args, { user }) => {
    const AND = {
      value: UPVOTE_VALUE,
      user: {
        id: user.id,
      },
    };

    if (type === 'threadVote') {
      AND.thread = { id: args.threadId };
    } else if (type === 'commentVote') {
      AND.comment = { id: args.commentId };
    } else {
      return new Error('Invalid type for hasNotUpvoted permission rule');
    }

    const voted = await prisma.$exists[type]({
      AND,
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
  ThreadVote: allow,
  Tag: allow,
  Comment: allow,
  CommentVote: allow,
};
