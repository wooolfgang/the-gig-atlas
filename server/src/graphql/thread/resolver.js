import { createFragment } from '../utils/fragment';

function constructCommentTree(parents, nodes) {
  if (nodes && nodes.length === 0) {
    return null;
  }

  const newParents = [];

  for (let i = 0; i < parents.length; i += 1) {
    if (parents[i].children && parents[i].children.length > 0) {
      const childrenIds = parents[i].children.map(c => c.id);
      const children = nodes.filter(n => childrenIds.includes(n.id));
      // eslint-disable-next-line no-param-reassign
      parents[i].children = children;
      parents[i].children.forEach(child => newParents.push(child));
    }
  }

  const newParentsIds = newParents.map(n => n.id);
  const remainingNodes = nodes.filter(n => !newParentsIds.includes(n.id));
  return constructCommentTree(newParents, remainingNodes, parents);
}

export default {
  Mutation: {
    createThread: async (_, { input }, { prisma, user }, info) => {
      const { title, body, tags } = input;
      return prisma.createThread(
        {
          title,
          body,
          tags: {
            connect: tags.map(tag => ({
              name: tag,
            })),
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
          parent: parentId
            ? {
                connect: {
                  id: parentId,
                },
              }
            : {},
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

  Query: {
    thread: (root, args, { prisma }, info) => prisma.thread(args.where, info),
    threads: (root, args, { prisma }, info) => prisma.threads(args, info),
    threadTags: async (root, args, { prisma }, info) =>
      prisma.threadTags(args, info),
  },

  Thread: {
    postedBy: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'PostedByFromThread', 'User');
      return prisma
        .thread({ id: root.id })
        .postedBy()
        .$fragment(fragment);
    },
    tags: (root, args, { prisma }) => prisma.thread({ id: root.id }).tags(),
    comments: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'CommentsFromThread', 'Comment');
      return prisma
        .thread({ id: root.id })
        .comments()
        .$fragment(fragment);
    },
    commentCount: (root, args, { prisma }) =>
      prisma
        .commentsConnection({ where: { thread: { id: root.id } } })
        .aggregate()
        .count(),
    commentTree: async (root, args, { prisma }) => {
      const comments = await prisma.comments({
        where: {
          thread: {
            id: root.id,
          },
        },
      }).$fragment(`
        fragment CommentTree on Comment {
          id
          text
          isRoot
          parent {
            id
            text
          }
          children {
            id
            text
          }
        }
        `);
      const parents = comments.filter(c => c.isRoot);
      const children = comments.filter(c => !c.isRoot);
      constructCommentTree(parents, children);
      return parents;
    },
    posters: async (root, args, { prisma }, info) => {
      const users = await prisma.users(
        {
          where: {
            comments_some: {
              thread: {
                id: root.id,
              },
            },
            asFreelancer: {
              id_not: null,
            },
          },
        },
        info,
      );
      return users;
    },
  },

  Comment: {
    parent: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'ParentFromComment', 'Comment');
      return prisma
        .comment({ id: root.id })
        .parent()
        .$fragment(fragment);
    },
    children: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'ChildrenFromComment', 'Comment');
      return prisma
        .comment({ id: root.id })
        .children()
        .$fragment(fragment);
    },
    postedBy: (root, args, { prisma }, info) => {
      const fragment = createFragment(info, 'PostedByFromComment', 'User');
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
