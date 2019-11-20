import { validation } from '@shared/common';
import config from '../../config';
import { prisma } from '../../generated/prisma-client';
import { createAuth, createUser } from '../auth/util';
import { createDebugPost } from '../utils/req_debug';

const { testUrl } = config;

let normalUser;
// const reqConfig = { headers: { Authorization: '' } };
const createdThreadIds = [];
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
    // prepend initial tags to the database
    await Promise.all([
      prisma.createTag({ name: 'react' }),
      prisma.createTag({ name: 'node' }),
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
});
