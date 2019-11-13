import axios from 'axios';
import argon2 from 'argon2';
import config from '../../config';
import { prisma } from '../../generated/prisma-client';

const { testUrl } = config;

const normalUser = {
  id: null,
  token: null,
};
const createdThreadIds = [];

beforeAll(async () => {
  const password = 'password';
  const hashed = await argon2.hash(password);
  const user = await prisma.createUser({
    email: 'averagejoe123@gmail.com',
    password: hashed,
  });

  try {
    await prisma.createThreadTag({
      name: 'freelance',
    });
  } catch (e) {
    console.log('fail gracefully');
  }

  try {
    await prisma.createThreadTag({
      name: 'discuss',
    });
  } catch (e) {
    console.log('fail gracefully');
  }

  const res = await axios.post(testUrl, {
    query: `
      mutation {
        login(email: "${user.email}", password: "${password}") {
          id
          token
        }
      }
    `,
  });
  normalUser.id = user.id;
  normalUser.token = res.data.data.login.token;
});

afterAll(async () => {
  // No need to delete threads, as it cascade deletes on user delete
  try {
    await prisma.deleteUser({
      id: normalUser.id,
    });
  } catch (e) {
    console.log('fail gracefully');
  }
});

describe('Test thread resolvers', () => {
  it('createThread properly connecting relations and doing validations', async () => {
    const thread = {
      title: 'What is love?',
      body: "Baby don't hurt me, don't hurt me no more",
      tags: ['freelance', 'discuss'],
    };

    let res;

    try {
      res = await axios.post(
        testUrl,
        {
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
          variables: {
            input: thread,
          },
        },
        { headers: { Authorization: normalUser.token } },
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }

    const createThread = res.data.data.createThread;
    createdThreadIds.push(createThread.id);

    expect(createThread.title).toBe(thread.title);
    expect(createThread.postedBy.id).toBe(normalUser.id);
    expect(createThread.comments).toEqual([]);
    expect(createThread.tags.map(t => t.name)).toEqual(thread.tags);
  });

  it('Creates a parent comment, and connects to children comment properly', async () => {
    const [threadId] = createdThreadIds;
    const parentComment = {
      text: '<div>This is a comment about love and bees </div>',
      threadId,
      parentId: null,
    };

    // Create root comment
    let parentRes;

    try {
      parentRes = await axios.post(
        testUrl,
        {
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
        },
        { headers: { Authorization: normalUser.token } },
      );
    } catch (e) {
      console.log(JSON.stringify(e));
    }

    const parentCommentRes = parentRes.data.data.createComment;

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
    let childrenRes;

    try {
      childrenRes = await axios.post(
        testUrl,
        {
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
        },
        { headers: { Authorization: normalUser.token } },
      );
    } catch (e) {
      JSON.stringify(e);
    }

    const childrenCommentRes = childrenRes.data.data.createComment;
    const parentChildren = await prisma
      .comment({ id: parentCommentRes.id })
      .children();

    expect(childrenCommentRes.parent.id).toBe(parentCommentRes.id);
    expect(parentChildren[0].id).toEqual(childrenCommentRes.id);
  });
});
