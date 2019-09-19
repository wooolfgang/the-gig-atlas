import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../../../config';

const testUrl = config.testUrl;
const input = {
  email: 'jogn@gmail.com',
  name: 'John Doe',
  password: 'mamam0',
};

let token;
let id;

beforeAll(() => {
  token = jwt.sign({}, config.adminSecret);
});

describe('admin basic signup', () => {
  it('create new admin account from token by admin secret envi', async () => {
    const {
      data: {
        data: { adminSignup },
      },
    } = await axios.post(
      testUrl,
      {
        query: `
        mutation Test($input: AdminInput!) {
          adminSignup(input: $input) {
            id
            token
          }
        }
      `,
        variables: { input },
      },
      { headers: { Authorization: token } },
    );

    console.log('new user: ', adminSignup);

    id = adminSignup.id;

    expect(adminSignup.id).toBeTruthy();
    expect(adminSignup.token).toBeTruthy();
  });

  it('log-in to the current admin account', async () => {
    const {
      data: {
        data: { adminLogin },
      },
    } = await axios.post(testUrl, {
      query: `
        mutation {
          adminLogin(email: "${input.email}", password: "${input.password}") {
            id
            token
          }
        }
      `,
    });

    token = adminLogin.token;

    expect(adminLogin.id).toBeTruthy();
    expect(adminLogin.token).toBeTruthy();
  });

  it('deletes the admin', async () => {
    const {
      data: {
        data: { deleteAdmin },
      },
    } = await axios.post(
      testUrl,
      {
        query: `
          mutation {
            deleteAdmin(id: "${id}")
          }
        `,
      },
      { headers: { Authorization: token } }
    );

    expect(deleteAdmin).toBe(true);
  });
});
