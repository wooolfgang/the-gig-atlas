/* eslint-disable no-undef */
import axios from 'axios';
import config from '../../../config';

const testUrl = config.testUrl;

describe('employer crud', () => {
  it('add and remove employer', async () => {
    const info = {
      name: 'nico',
      email: 'nico@gmail.com',
      employerType: 'PERSONAL',
    };

    const {
      data: {
        data: { newEmployer },
      },
    } = await axios.post(testUrl, {
      query: `
          mutation Test($info: EmployerInput!) {
            newEmployer(info: $info) {
              id
              name
              email
            }
          }
        `,
      variables: { info },
    });

    const {
      data: {
        data: { deleteEmployer },
      },
    } = await axios.post(testUrl, {
      query: `
          mutation {
            deleteEmployer(id: "${newEmployer.id}") {
              id
              name
              email
            }
          }
        `,
    });

    expect(newEmployer.email).toBe(info.email);
    expect(deleteEmployer.id).toBe(newEmployer.id);
  });
});
