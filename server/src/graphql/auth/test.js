import axios from 'axios';
import config from '../../config';
import { prisma } from '../../generated/prisma-client';
import debugReq from '../utils/req_debug';

const { testUrl, admin } = config;
const input = {
  email: 'john@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'mamam0',
};

const user2 = {
  email: 'Li@gmail.com',
  firstName: 'Li',
  lastName: 'test',
};

/**
 * IMPORTANT: added users must be remove after test
 */

afterAll(async () => {
  try {
    // await to prevent data races from jest:watch
    await Promise.all([
      prisma.deleteUser({ email: input.email }),
      prisma.deleteUser({ email: user2.email }),
    ]);
  } catch (e) {
    //
  }
});

describe('basic signup', () => {
  let newId;

  it('Creates a new user of role=MEMBER', async () => {
    const res = await axios.post(testUrl, {
      query: `
        mutation Test($input: SignupInput!) {
          signup(input: $input) {
            id
            token
          }
        }
      `,
      variables: { input },
    });

    const signup = res.data.data.signup;
    newId = signup.id;

    expect(signup.token).toBeTruthy();
  });

  it('Fails on duplicate email', async () => {
    const res = await axios.post(testUrl, {
      query: `
        mutation Test($input: SignupInput!) {
          signup(input: $input) {
            id
            token
          }
        }
      `,
      variables: { input },
    });

    expect(res.data.errors).toBeTruthy();
    // const signup = res.data.data.signup;
  });

  it('Logins to the created user', async () => {
    const res = await axios.post(testUrl, {
      query: `
        mutation {
          login(email: "${input.email}", password: "${input.password}") {
            id
            token
          }
        }
      `,
    });
    const { id, token } = res.data.data.login;

    expect(id).toBe(newId);
    expect(token).toBeTruthy();
  });

  it('Removes user by admin credentials', async () => {
    const res = await axios.post(testUrl, {
      query: `
        mutation {
          login(email: "${admin.email}", password: "${admin.password}") {
            id
            token
          }
        }
      `,
    });

    const adminToken = res.data.data.login.token;

    const delRes = await axios.post(
      testUrl,
      {
        query: `
          mutation {
            deleteUser(id: "${newId}")
          }
        `,
      },
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );

    expect(delRes.data.data.deleteUser).toBe(true);
  });
});
