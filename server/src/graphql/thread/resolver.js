import { createFragment } from '../utils/fragment';

export default {
  Mutation: {
    createThread: async (_, { input }, { prisma, user }, info) => {
      const { title, body, tags } = input;
      return prisma.createThread(
        {
          title,
          body,
          tags: {
            set: tags,
          },
          postedBy: {
            connect: {
              id: user.id,
            },
          },
        },
        info,
      );
    },

    createComment: async (_, { input }, { prisma, user }, info) => {
      const { text, threadId, parentId } = input;
      const isRoot = !parentId;
      return prisma.createComment(
        {
          text,
          isRoot,
          parent: parentId && {
            connect: {
              id: parentId,
            },
          },
          thread: {
            connect: {
              id: threadId,
            },
          },
          postedBy: {
            connect: {
              id: user.id,
            },
          },
        },
        info,
      );
    },
  },

  Query: {},

  Thread: {
    postedBy: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'PostedByFromThread', 'PostedBy');
      return prisma
        .thread({ id: root.id })
        .postedBy()
        .$fragment(fragment);
    },
    comments: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'CommentsFromThread', 'Comments');
      return prisma
        .thread({ id: root.id })
        .comments()
        .$fragment(fragment);
    },
  },

  Comment: {
    parent: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'ParentFromComment', 'Parent');
      return prisma
        .comment({ id: root.id })
        .parent()
        .$fragment(fragment);
    },
    children: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'ChildrenFromComment', 'Children');
      return prisma
        .comment({ id: root.id })
        .children()
        .$fragment(fragment);
    },
    postedBy: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'PostedByFromComment', 'PostedBy');
      return prisma
        .comment({ id: root.id })
        .postedBy()
        .$fragment(fragment);
    },
    thread: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'ThreadFromComment', 'Thread');
      return prisma
        .comment({ id: root.id })
        .thread()
        .$fragment(fragment);
    },
  },
};
