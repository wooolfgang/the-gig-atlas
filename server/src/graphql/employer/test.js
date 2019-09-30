import axios from 'axios';
import config from '../../config';
import { prisma } from '../../generated/prisma-client';

const { testUrl } = config;

const userInput = {
  firstName: 'nico',
  lastName: 'ool',
  email: 'nico@gmail.com',
  password: 'asdfksdfjs;ldjfksadf',
};
const inputGig = {
  title: 'Testing App',
  description: 'testing my app',
  technologies: ['js', 'jest'],
  projectType: 'TESTING',
  paymentType: 'FIXED',
  minFee: 100.0,
  maxFee: 200.0,
  jobType: 'CONTRACT',
  communicationType: 'EMAIL',
};
const input = {
  employer: {
    displayName: 'Awesome Employer',
    website: 'https://awesome.com',
    introduction: 'Hi I am an awesome employer',
    email: 'awesome@gmail.com',
    employerType: 'PERSONAL',
    avatarFileId: null,
  },
  gig: inputGig,
};
let token;

beforeAll(async () => {
  const res = await axios.post(testUrl, {
    query: `
      mutation Test($input: SignupInput!) {
        signup(input: $input) {
          id
          token
        }
      }
    `,
    variables: { input: userInput },
  });
  const file = await axios.post(testUrl, {
    query: `
      mutation ($file: FileInput!) {
        createFile(file: $file) {
          id
        }
      }
    `,
    variables: {
      file: {
        name: 'this is a file',
      },
    },
  });
  input.employer.avatarFileId = file.data.data.createFile.id;
  token = res.data.data.signup.token;
});

afterAll(async () => {
  try {
    await prisma.deleteUser({ email: userInput.email });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
});

describe('Employer crud operation', () => {
  it('sets logged member as employer together with posted gig', async () => {
    const res = await axios.post(
      testUrl,
      {
        query: `
          mutation Test($employer: EmployerInput!, $gig: GigInput!) {
            setEmployer(employer: $employer, gig: $gig) {
              id
              employerType
              gigs {
                id
                title
                communicationType
                description
                technologies
                projectType
                paymentType
                minFee
                maxFee
                jobType
              }
            }
          }
        `,
        variables: { ...input },
      },
      { headers: { Authorization: token } },
    );

    const { employerType, gigs } = res.data.data.setEmployer;
    // eslint-disable-next-line no-unused-vars
    const { id, ...insertedGig } = gigs[0];

    expect(employerType).toBe('PERSONAL');
    expect(inputGig).toEqual(insertedGig);
  });

  it('queries user as employer with gig', async () => {
    const res = await axios.post(
      testUrl,
      {
        query: `
          query {
            user {
              firstName
              lastName
              email
              asEmployer {
                id
                employerType
                gigs {
                  id
                  title
                  description
                }
              }
            }
          }
        `,
      },
      { headers: { Authorization: token } },
    );

    const user = res.data.data.user;
    const employer = user.asEmployer;
    const gig = employer.gigs[0];

    expect(user.email).toBe(userInput.email);
    expect(employer.employerType).toBe(input.employer.employerType);
    expect(gig.title).toBe(inputGig.title);
  });

  it('disallow re-setting of employer', async () => {
    const res = await axios.post(
      testUrl,
      {
        query: `
          mutation Test($employer: EmployerInput!, $gig: GigInput!) {
            setEmployer(employer: $employer, gig: $gig) {
              id
              employerType
              gigs {
                id
                title
                communicationType
                description
                technologies
                projectType
                paymentType
                minFee
                maxFee
                jobType
              }
            }
          }
        `,
        variables: { ...input },
      },
      { headers: { Authorization: token } },
    );
    expect(res.data.errors[0].message).toBe('Already an Employer');
  });
});
