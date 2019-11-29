import prisma from '@thegigatlas/prisma';
import { DOWNVOTE_VALUE, UPVOTE_VALUE } from '../constants';

export default async function upvoteThread(_, { threadId }, { user }, info) {
  const thread = await prisma.thread({ id: threadId });
  const { upvoteCount, downvoteCount } = thread;
  const [downvote] = await prisma.threadVotes({
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

  return prisma.updateThread(
    {
      where: {
        id: threadId,
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
