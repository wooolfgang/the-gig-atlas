import prisma from '@thegigatlas/prisma';
import config from '../../config';

import debugReq from '../utils/req_debug';
import { createUser } from '../auth/util';

const { testUrl } = config;

const userInput = {
  firstName: 'nico',
  lastName: 'ool',
  email: 'nico@gmail.com',
  password: 'asdfksdfjs;ldjfksadf',
  onboardingStep: 'EMPLOYER',
};
const inputGig = {
  title: 'Testing App',
  description: 'testing my app',
  tags: ['react', 'nodejs'],
  projectType: 'TESTING',
  paymentType: 'FIXED',
  minFee: 100.0,
  maxFee: 200.0,
  jobType: 'CONTRACT',
  communicationType: 'IN_APP',
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
let userAuth;
let token;
let debugPost;
let fileId;

beforeAll(async () => {
  userAuth = await createUser(userInput);
  debugPost = debugReq.createDebugPost.withAuth(testUrl, userAuth);
  const file = await prisma.createFile({ name: 'this is a file' });

  fileId = file.id;
  input.employer.avatarFileId = file.id;
  try {
    await Promise.all(
      inputGig.tags.map(tag =>
        prisma.createTag({
          name: tag,
        }),
      ),
    );
  } catch (e) {
    //
  }
});

afterAll(async () => {
  await prisma.deleteUser({ email: userInput.email }).catch(console.error);
  await prisma.deleteFile({ id: fileId }).catch(console.error);
  await prisma.deleteManyTags({
    name_in: inputGig.tags,
  });
});

describe('Employer crud operation', () => {
  it('sets logged member as employer together with posted gig', async () => {
    const res = await debugPost({
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
                tags {
                  id
                  name
                } 
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
    });

    const { employerType, gigs } = res.setEmployer;
    // eslint-disable-next-line no-unused-vars
    const { id, ...insertedGig } = gigs[0];

    expect(employerType).toBe('PERSONAL');
    expect(inputGig).toEqual({
      ...insertedGig,
      tags: insertedGig.tags.map(t => t.name),
    });
  });

  it('queries user as employer with gig', async () => {
    const res = await debugPost({
      query: `
          query {
            user {
              id
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
    });

    const user = res.user;
    const employer = user.asEmployer;
    const gig = employer.gigs[0];

    expect(user.email).toBe(userInput.email);
    expect(employer.employerType).toBe(input.employer.employerType);
    expect(gig.title).toBe(inputGig.title);
  });

  it('disallow re-setting of employer', async () => {
    const reqData = {
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
                tags {
                  id
                  name
                }
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
    };

    try {
      await debugPost(reqData, {}, false);
      // eslint-disable-next-line no-undef
      fail('NO BUG RESULT!: Something went wrong with employer re-setting');
    } catch (e) {
      expect(e.message).toBe('Already an Employer');
    }
  });
});
