/* eslint-disable no-undef */
import axios from 'axios';
import config from '../../config';

const testUrl = config.testUrl;
const employerInfo = {
  name: 'nica',
  email: 'nica@gmail.com',
  employerType: 'COMPANY',
};
let employer;

beforeAll(async () => {
  const {
    data: {
      data: { newEmployer },
    },
  } = await axios.post(testUrl, {
    query: `
        mutation TestEmployer($info: EmployerInput!) {
          newEmployer(info: $info) {
            id
            email
          }
        }
      `,
    variables: { info: employerInfo },
  });

  employer = newEmployer;
});

afterAll(() => {
  axios.post(testUrl, {
    query: `
        mutation {
          deleteEmployer(id: "${employer.id}")
        }
      `,
  });
});

describe('Gig crud', () => {
  it('creates new gig to existing employer', async () => {
    const gigInfo = {
      title: 'Fluff developer',
      description: 'Calculate fluffness every hop',
      technologies: ['css', 'ts'],
      projectType: 'MAINTENANCE',
      paymentType: 'FIXED',
      minFee: 400.0,
      maxFee: 500.0,
      jobType: 'FULL_TIME',
    };

    const {
      data: {
        data: { newGig },
      },
    } = await axios.post(testUrl, {
      query: `
        mutation TestGig($employerId: ID!, $info: GigInput!) {
          newGig(employerId: $employerId, info: $info) {
            id
            title
            employer {
              id
              email
            }
          }
        }
      `,
      variables: { employerId: employer.id, info: gigInfo },
    });

    console.log("the new gig: ", newGig);

    expect(newGig).toEqual({
      id: newGig.id,
      title: gigInfo.title,
      employer: {
        id: employer.id,
        email: employerInfo.email,
      },
    });
  });
});
