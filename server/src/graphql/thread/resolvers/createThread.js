import prisma from '@thegigatlas/prisma';
import { sortExistTags } from '../../tag/util';

export default async function createThread(_, { input }, { user }, info) {
  const { title, body, tags } = input;
  const createOrConnect = await sortExistTags(tags);

  return prisma.createThread(
    {
      title,
      body,
      tags: createOrConnect,
      postedBy: { connect: { id: user.id } },
    },
    info,
  );
}
