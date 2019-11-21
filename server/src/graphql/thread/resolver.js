import { createFragment } from '../utils/fragment';
import prisma from '../../prisma';
import { sortExistTags } from '../tag/util';

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

async function createThread(_, { input }, { user }, info) {
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

export default {
  Mutation: {
    createThread,
    createComment: async (_, { input }, { user }, info) => {
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
    },
  },

  Query: {
    thread: (_r, args, _c, info) => prisma.thread(args.where, info),
    threads: (_r, args, _c, info) => prisma.threads(args, info),
  },

  Thread: {
    postedBy: (root, _a, _c, info) => {
      const fragment = createFragment(info, 'PostedByFromThread', 'User');
      return prisma
        .thread({ id: root.id })
        .postedBy()
        .$fragment(fragment);
    },
    tags: ({ id }) => prisma.thread({ id }).tags(),
    comments: (root, _a, _c, info) => {
      const fragment = createFragment(info, 'CommentsFromThread', 'Comment');
      return prisma
        .thread({ id: root.id })
        .comments()
        .$fragment(fragment);
    },
    commentCount: ({ id }) =>
      prisma
        .commentsConnection({ where: { thread: { id } } })
        .aggregate()
        .count(),
    commentTree: async ({ id }) => {
      const comments = await prisma.comments({ where: { thread: { id } } })
        .$fragment(`
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
    posters: ({ id }, _a, _c, info) =>
      prisma.users(
        {
          where: {
            comments_some: { thread: { id } },
            asFreelancer: { id_not: null },
          },
        },
        info,
      ),
  },

  Comment: {
    parent: (root, _a, _c, info) => {
      const fragment = createFragment(info, 'ParentFromComment', 'Comment');
      return prisma
        .comment({ id: root.id })
        .parent()
        .$fragment(fragment);
    },
    children: (root, _a, _c, info) => {
      const fragment = createFragment(info, 'ChildrenFromComment', 'Comment');
      return prisma
        .comment({ id: root.id })
        .children()
        .$fragment(fragment);
    },
    postedBy: (root, _a, _c, info) => {
      const fragment = createFragment(info, 'PostedByFromComment', 'User');
      return prisma
        .comment({ id: root.id })
        .postedBy()
        .$fragment(fragment);
    },
    thread: (root, _a, _c, info) => {
      const fragment = createFragment(info, 'ThreadFromComment', 'Thread');
      return prisma
        .comment({ id: root.id })
        .thread()
        .$fragment(fragment);
    },
  },
};
