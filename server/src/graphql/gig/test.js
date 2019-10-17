import axios from 'axios';
import argon2 from 'argon2';
import config from '../../config';
import { prisma } from '../../generated/prisma-client';

const { testUrl } = config;

const gig = {
  title: 'Testing App',
  description: 'testing my app',
  technologies: ['js', 'jest'],
  projectType: 'TESTING',
  paymentType: 'FIXED',
  minFee: 100.0,
  maxFee: 200.0,
  jobType: 'CONTRACT',
  communicationType: 'EMAIL',
  communicationEmail: 'casd@gmail.com',
};

const employer = {
  displayName: 'Someting',
  website: 'https://some.com',
  introduction: 'Hi wewewewe',
  email: 'some@gmail.com',
  employerType: 'PERSONAL',
  avatarFileId: null,
};

const existingUser = {
  email: 'existing@gmail.com',
  password: 'asdsadsadas',
  role: 'MEMBER',
};

let testFile2;

beforeAll(async () => {
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
        name: 'Test FIle',
      },
    },
  });
  const file2 = await axios.post(testUrl, {
    query: `
      mutation ($file: FileInput!) {
        createFile(file: $file) {
          id
        }
      }
    `,
    variables: {
      file: {
        name: 'Test FIle 2',
      },
    },
  });
  employer.avatarFileId = file.data.data.createFile.id;
  testFile2 = file2.data.data.createFile.id;

  await prisma.createUser(existingUser);
});

afterAll(async () => {
  try {
    await Promise.all([
      prisma.deleteUser({ email: employer.email }),
      prisma.deleteUser({ email: existingUser.email }),
    ]);
  } catch (e) {
    // fail gracefully
  }
});

describe('Testing gig resolvers', () => {
  it('Creates a new gig with populated employer, avatar and user', async () => {
    const res = await axios.post(testUrl, {
      query: `
        mutation($gig: GigInput!, $employer: EmployerInput!) {
          createGig(gig: $gig, employer: $employer) {
            title
            communicationType
            communicationEmail
            description
            technologies
            projectType
            paymentType
            minFee
            maxFee
            jobType
            employer {
              id
              email
              avatar {
                id
              }
              asUser {
                email
              }
            }
          }
        }
      `,
      variables: { employer, gig },
    });

    const { employer: employerResult, ...gigResult } = res.data.data.createGig;
    expect(gigResult).toMatchObject(gig);
    expect(employerResult.email).toEqual(employer.email);
    expect(employerResult.avatar.id).toEqual(employer.avatarFileId);
    expect(employerResult.asUser.email).toEqual(employer.email);
  });

  it('Updates existing employer with new data when same email is used in creating gig', async () => {
    const newEmployerData = {
      displayName: 'ASdkaldajsdkljskl',
      website: 'https://gweeasdsad.com',
      introduction: 'This is new',
      // same email as previously created gig from test
      email: employer.email,
      employerType: 'COMPANY',
      avatarFileId: testFile2,
    };
    const res = await axios.post(testUrl, {
      query: `
        mutation($gig: GigInput!, $employer: EmployerInput!) {
          createGig(gig: $gig, employer: $employer) {
            title
            communicationType
            communicationEmail
            description
            technologies
            projectType
            paymentType
            minFee
            maxFee
            jobType
            employer {
              id
              email
              displayName
              avatar {
                id
              }
              asUser {
                email
              }
            }
          }
        }
      `,
      variables: { employer: newEmployerData, gig },
    });

    const { employer: employerResult, ...gigResult } = res.data.data.createGig;
    expect(gigResult).toMatchObject(gig);
    expect(employerResult.email).toEqual(newEmployerData.email);
    expect(employerResult.avatar.id).toEqual(newEmployerData.avatarFileId);
    expect(employerResult.displayName).toEqual(newEmployerData.displayName);
    expect(employerResult.asUser.email).toEqual(employer.email);
  });

  it('Should allow existing users to create a gig', async () => {
    const newEmployerData = {
      displayName: 'ASdkaldajsdkljskl',
      website: 'https://gweeasdsad.com',
      introduction: 'This is new',
      email: existingUser.email,
      employerType: 'COMPANY',
      avatarFileId: testFile2,
    };
    const res = await axios.post(testUrl, {
      query: `
        mutation($gig: GigInput!, $employer: EmployerInput!) {
          createGig(gig: $gig, employer: $employer) {
            title
            communicationType
            communicationEmail
            description
            technologies
            projectType
            paymentType
            minFee
            maxFee
            jobType
            employer {
              id
              email
              displayName
              avatar {
                id
              }
              asUser {
                email
              }
            }
          }
        }
      `,
      variables: { employer: newEmployerData, gig },
    });
    const { employer: employerResult, ...gigResult } = res.data.data.createGig;
    expect(gigResult).toMatchObject(gig);
    expect(employerResult.email).toEqual(newEmployerData.email);
    expect(employerResult.avatar.id).toEqual(newEmployerData.avatarFileId);
    expect(employerResult.displayName).toEqual(newEmployerData.displayName);
    expect(employerResult.asUser.email).toEqual(existingUser.email);
  });

  it('Created user from gig should be properly hashed by argon', async () => {
    const user = await prisma.user({ email: employer.email });
    const randomhash = await argon2.hash('adskjsadksjdaskldjaskl');
    const res = await argon2.verify(user.password, randomhash);
    expect(user.password).toBeTruthy();
    expect(res).toEqual(false);
  });
});
