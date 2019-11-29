import prisma from '@thegigatlas/prisma';

export default async function createComment(_, { input }, { user }, info) {
  const { text, threadId, parentId } = input;
  const isRoot = !parentId;
  const parent = isRoot ? undefined : { connect: { id: parentId } };

  return prisma.createComment(
    {
      text,
      isRoot,
      parent,
      thread: { connect: { id: threadId } },
      postedBy: { connect: { id: user.id } },
    },
    info,
  );
}
