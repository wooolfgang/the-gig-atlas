import { validation } from '@shared/common';
import prisma from '@thegigatlas/prisma';
import config from '../../config';
import { createAuth, createUser } from '../auth/util';
import { createDebugPost } from '../utils/req_debug';

const { testUrl } = config;

let normalUser;
// const reqConfig = { headers: { Authorization: '' } };
const createdThreadIds = [];
const createdCommentIds = [];
let debugPost;
const tags = ['freelance', 'discuss', 'node', 'react'];

beforeAll(async () => {
  const userInput = {
    email: 'averagejoe123@gmail.com',
    password: 'password',
    role: 'MEMBER',
  };
  try {
    const user = await createUser(userInput);
    const auth = await createAuth(user.id, 'MEMBER');
    normalUser = auth;
    // reqConfig.headers.Authorization = `Bearer ${auth.token}`;
    debugPost = createDebugPost.withAuth(testUrl, auth);
  } catch (e) {
    console.error('on create auth failed, ', e);
  }
});

afterAll(async () => {
  // No need to delete threads, as it cascade deletes on user delete
  try {
    await Promise.all([
      prisma.deleteUser({ id: normalUser.id }),
      prisma.deleteManyTags({ name_in: tags }),
      prisma.deleteThreadVote({ user: { id: normalUser.id } }),
    ]);
  } catch (e) {
    console.log('fail gracefully');
  }
});

describe('Test thread resolvers', () => {
  it('allows tags', () => {
    expect(() => {
      validation.tags.validate(['freelance', 'discuss']);
    }).not.toThrow();
  });

  it('createThread properly connecting relations and doing validations', async () => {
    const thread = {
      tags,
      title: 'What is love?',
      body: "Baby don't hurt me, don't hurt me no more",
    };

    try {
      await prisma.createTagCategory({
        name: 'thread',
      });
    } catch (e) {
      // Fail gracefully in case tagCategory already exists
    }

    // prepend initial tags to the database
    await Promise.all([
      prisma.createTag({
        name: 'react',
        categories: {
          connect: {
            name: 'thread',
          },
        },
      }),
      prisma.createTag({
        name: 'node',
        categories: {
          connect: {
            name: 'thread',
          },
        },
      }),
    ]);
    const res = await debugPost({
      query: `mutation ($input: ThreadInput!) {
          createThread(input: $input) {
            id
            title
            postedBy {
              id
              email
            }
            comments {
              id
            }
            tags {
              id
              name
            }
          }
        }
      `,
      variables: { input: thread },
    });

    const createThread = res.createThread;
    createdThreadIds.push(createThread.id);

    expect(createThread.title).toBe(thread.title);
    expect(createThread.postedBy.id).toBe(normalUser.id);
    expect(createThread.comments).toEqual([]);
    expect(createThread.tags.map(t => t.name).sort()).toEqual(
      thread.tags.sort(),
    );
  });

  it('Creates a parent comment, and connects to children comment properly', async () => {
    const [threadId] = createdThreadIds;
    const parentComment = {
      text: '<div>This is a comment about love and bees </div>',
      threadId,
      parentId: null,
    };

    // Create root comment

    const res = await debugPost({
      query: `mutation ($input: CommentInput!) {
          createComment(input: $input) {
            id
            isRoot
            postedBy {
              id
              email
            }
            parent {
              id
            }
            children {
              id
            }
          }
        }
      `,
      variables: {
        input: parentComment,
      },
    });

    const parentCommentRes = res.createComment;
    createdCommentIds.push(parentCommentRes.id);

    expect(parentCommentRes.title).toBe(parentComment.title);
    expect(parentCommentRes.parent).toBeNull();
    expect(parentCommentRes.children).toEqual([]);
    expect(parentCommentRes.postedBy.id).toBe(normalUser.id);
    expect(parentCommentRes.isRoot).toEqual(true);

    const childrenComment = {
      text: 'Yeah I also love them bees man',
      parentId: parentCommentRes.id,
      threadId,
    };

    // Create child comment from root comment
    const childRes = await debugPost({
      query: `mutation ($input: CommentInput!) {
            createComment(input: $input) {
              id
              text
              parent {
                id
              }
              children {
                id
              }
            }
          }
        `,
      variables: {
        input: childrenComment,
      },
    });

    const childrenCommentRes = childRes.createComment;
    const parentChildren = await prisma
      .comment({ id: parentCommentRes.id })
      .children();

    expect(childrenCommentRes.parent.id).toBe(parentCommentRes.id);
    expect(parentChildren[0].id).toEqual(childrenCommentRes.id);
  });

  it('Should upvote thread should upvote correctly and only allow one upvote per use', async () => {
    const [threadId] = createdThreadIds;
    const upvoteThread = async () =>
      debugPost({
        query: `mutation ($threadId: ID!) {
        upvoteThread (threadId: $threadId) {
          upvoteCount
          downvoteCount
        }
      }`,
        variables: {
          threadId,
        },
      });
    let res;
    try {
      res = await upvoteThread();
    } catch (e) {
      res = e;
    }
    expect(res.upvoteThread.upvoteCount).toEqual(1);
    expect(res.upvoteThread.downvoteCount).toEqual(0);

    let res2;
    try {
      res2 = await debugPost();
    } catch (e) {
      res2 = 'An error occured';
    }
    expect(res2).toEqual('An error occured');
  });

  it('Should upvote comment correctly and only allow on upvote per user', async () => {
    const [commentId] = createdCommentIds;

    const upvoteComment = async () =>
      debugPost({
        query: `mutation ($commentId: ID!) {
        upvoteComment (commentId: $commentId) {
          upvoteCount
          downvoteCount
        }
      }`,
        variables: {
          commentId,
        },
      });
    let res;
    try {
      res = await upvoteComment();
    } catch (e) {
      console.log(JSON.stringify(e.response.data));
      res = e;
    }
    expect(res.upvoteComment.upvoteCount).toEqual(1);
    expect(res.upvoteComment.downvoteCount).toEqual(0);

    let res2;
    try {
      res2 = await debugPost();
    } catch (e) {
      res2 = 'An error occured';
    }
    expect(res2).toEqual('An error occured');
  });
});
