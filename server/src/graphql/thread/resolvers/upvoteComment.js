import prisma from '@thegigatlas/prisma';
import { DOWNVOTE_VALUE, UPVOTE_VALUE } from '../constants';

export default async function upvoteComment(_, { commentId }, { user }, info) {
  const comment = await prisma.comment({ id: commentId });
  const { upvoteCount, downvoteCount } = comment;
  const [downvote] = await prisma.commentVotes({
    where: {
      user: {
        id: user.id,
      },
      value: DOWNVOTE_VALUE,
    },
  });

  const upsert = {
    where: {
      id: downvote ? downvote.id : '',
    },
    update: {
      value: UPVOTE_VALUE,
    },
    create: {
      value: UPVOTE_VALUE,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  };

  return prisma.updateComment(
    {
      where: {
        id: commentId,
      },
      data: {
        votes: {
          upsert,
        },
        upvoteCount: upvoteCount + 1,
        downvoteCount: downvote ? downvoteCount - 1 : downvoteCount,
      },
    },
    info,
  );
}
