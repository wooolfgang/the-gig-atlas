import axios from 'axios';
import config from '../../config';
import { prisma } from '../../generated/prisma-client';

const { testUrl, admin } = config;
const input = {
  email: 'john@gmail.com',
  name: 'John Doe',
  password: 'mamam0',
};

afterAll(async () => {
  try {
    // await to prevent data races from jest:watch
    await prisma.deleteUser({ email: input.email });
  } catch (e) {
    //
  }
});

describe('basic signup', () => {
  let newId;

  it('creates a new user as role=MEMBER', async () => {
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

  it('fails on duplicate email', async () => {
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

  it('logins to the created user', async () => {
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

  it('removes user by admin credentials', async () => {
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
      { headers: { Authorization: adminToken } },
    );

    expect(delRes.data.data.deleteUser).toBe(true);
  });
});