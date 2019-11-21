import prisma from '../../prisma';

const tags = (_, args, _ctx, info) => prisma.tags(args, info);
const tag = (_, { id }, _ctx, info) => prisma.tag({ id }, info);

export default {
  Query: {
    tag,
    tags,
  },
  Mutation: {},
  Tag: {
    category: ({ id }) => prisma.tag({ id }).category(),
  },
  TagCategory: {
    tags: ({ id }) => prisma.tagCategory({ id }).tags(),
  },
};
