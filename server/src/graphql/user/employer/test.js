/* eslint-disable no-undef */
import axios from 'axios';
import config from '../../../config';

const testUrl = config.testUrl;
const info = {
  name: 'nico',
  email: 'nico@gmail.com',
  employerType: 'PERSONAL',
  gig: {
    title: 'Testing App',
    description: 'testing my app',
    technologies: ['js', 'jest'],
    projectType: 'TESTING',
    paymentType: 'FIXED',
    minFee: 100.0,
    maxFee: 200.0,
    jobType: 'CONTRACT',
  },
};

describe('employer crud', () => {
  it('add and remove employer', async () => {
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
              gigs {
                id
              }
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
            deleteEmployer(id: "${newEmployer.id}")
          }
        `,
    });

    expect(newEmployer.email).toBe(info.email);
    expect(deleteEmployer).toBe(true);
  });
});
