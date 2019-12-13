import axios from 'axios';
import prisma from '@thegigatlas/prisma';
import config from '../../config';
import { createUser } from './util';
// import { createDebugPost } from '../utils/req_debug';

const { testUrl } = config;
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

const admin = {
  email: 'admin@test.com',
  password: 'testadmin',
};

const signupMutatation = `
mutation Test($input: SignupInput!) {
  signup(input: $input) {
    id
    token
  }
}
`;
const _loginMutation = (email, pass) => `
mutation {
  login(email: "${email}", password: "${pass}") {
    id
    token
  }
}
`;

beforeAll(async () => {
  await createUser(admin, 'ADMIN');
});

/**
 * IMPORTANT: added users must be remove after test
 */

afterAll(async () => {
  const delMails = [input.email, user2.email, admin.email];
  await prisma.deleteManyUsers({ email_in: delMails }).catch(e => {
    // eslint-disable-next-line no-console
    console.error('Auth test afterAll delete: ', e);
  });
});

describe('User Authentication', () => {
  let newId;

  it('Creates a new user as EMPLOYER of role=MEMBER', async () => {
    const create = { ...input, accountType: 'EMPLOYER' };
    const res = await axios.post(testUrl, {
      query: signupMutatation,
      variables: { input: create },
    });

    const signup = res.data.data.signup;
    newId = signup.id;

    expect(signup.token).toBeTruthy();
  });

  it('Fails on duplicate email', async () => {
    const create = { ...input, accountType: 'FREELANCER' };
    const res = await axios.post(testUrl, {
      query: signupMutatation,
      variables: { input: create },
    });

    expect(res.data.errors).toBeTruthy();
    // const signup = res.data.data.signup;
  });

  it('Logins to the created user', async () => {
    const res = await axios.post(testUrl, {
      query: _loginMutation(input.email, input.password),
    });
    const { id, token } = res.data.data.login;

    expect(id).toBe(newId);
    expect(token).toBeTruthy();
  });

  it('Removes user by admin credentials', async () => {
    const res = await axios.post(testUrl, {
      query: _loginMutation(admin.email, admin.password),
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
