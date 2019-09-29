import axios from 'axios';
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
};

const employer = {
  displayName: 'Someting',
  website: 'https://some.com',
  introduction: 'Hi wewewewe',
  email: 'some@gmail.com',
  employerType: 'PERSONAL',
  avatarFileId: null,
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
});

afterAll(async () => {
  await prisma.deleteUser({ email: employer.email });
});

describe('Testing gig resolvers', () => {
  it('Creates a new gig with populated employer, avatar and user', async () => {
    const res = await axios.post(testUrl, {
      query: `
        mutation($gig: GigInput!, $employer: EmployerInput!) {
          createGig(gig: $gig, employer: $employer) {
            title
            communicationType
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
    expect(gigResult).toEqual(gig);
    expect(employerResult.email).toEqual(employer.email);
    expect(employerResult.avatar.id).toEqual(employer.avatarFileId);
    expect(employerResult.asUser.email).toEqual(employer.email);
  });

  it('Updates existing employer with new data when same email is used in creating gig', async () => {
    const newEmployerData = {
      displayName: 'ASdkaldajsdkljskl',
      website: 'https://gweeasdsad.com',
      introduction: 'This is new',
      email: 'some@gmail.com',
      employerType: 'COMPANY',
      avatarFileId: testFile2,
    };
    const res = await axios.post(testUrl, {
      query: `
        mutation($gig: GigInput!, $employer: EmployerInput!) {
          createGig(gig: $gig, employer: $employer) {
            title
            communicationType
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
    expect(gigResult).toEqual(gig);
    expect(employerResult.email).toEqual(newEmployerData.email);
    expect(employerResult.avatar.id).toEqual(newEmployerData.avatarFileId);
    expect(employerResult.displayName).toEqual(newEmployerData.displayName);
    expect(employerResult.asUser.email).toEqual(employer.email);
  });
});
