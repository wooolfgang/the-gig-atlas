import axios from 'axios';
import argon2 from 'argon2';
import prisma from '@thegigatlas/prisma';
import config from '../../config';
import { createDebugPost } from '../utils/req_debug';
// eslint-disable-next-line no-unused-vars
import { fullDisplay } from '../../../seed/utils';

const { testUrl } = config;

const gig = {
  title: 'Testing App',
  description: 'testing my app',
  tags: ['g-node', 'g-react'],
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
// eslint-disable-next-line no-use-before-define
const searchGigs = searchGigsFactory();
// eslint-disable-next-line no-use-before-define
const allTags = tagsFactory();
// eslint-disable-next-line no-use-before-define
const searchUsers = employerFactory();

let testFile2;

beforeAll(async () => {
  const [file1, file2] = await Promise.all([
    prisma.createFile({ name: 'Test File 1' }),
    prisma.createFile({ name: 'Test File 2' }),
    ...allTags.map(t => prisma.createTag({ name: t })),
  ]).catch(console.error);

  // eslint-disable-next-line quotes
  // const frag = /* sql */ `fragment ASD on Gig { id title tags { id name } }`;
  // searchGigs = await Promise.all(
  //   searchGigs.map(g => prisma.createGig(g).$fragment(frag)),
  // );
  // fullDisplay(searchGigs);
  employer.avatarFileId = file1.id;
  testFile2 = file2.id;
  await prisma.createUser(existingUser);

  // eslint-disable-next-line no-use-before-define
  const res = await _insertSearchData(searchGigs, allTags, searchUsers);
  // console.log(res);
});

afterAll(async () => {
  await Promise.all([
    prisma.deleteManyUsers({ email_in: [employer.email, existingUser.email] }),
    // eslint-disable-next-line prettier/prettier
    prisma.deleteManyEmployers({ email_in: [employer.email, existingUser.email] }),
    prisma.deleteManyFiles({ id_in: [employer.avatarFileId, testFile2] }),
    prisma.deleteManyTags({ name_in: allTags }),
  ]).catch(console.error);
  // await prisma // gigs delete should not be concurrent with tags
  //   .deleteManyGigs({ id_in: searchGigs.map(g => g.id) })
  //   .catch(console.error);
  await prisma // => delete all gigs with respect to employer with respect to user
    .deleteManyUsers({ email_in: searchUsers.users.map(u => u.email) })
    .catch(e => console.log('Error delteting users: ', e));
});

describe('Testing gig resolvers', () => {

  it('searches gig by title and tags', async () => {
    const post = createDebugPost(testUrl);
    // const gigs = await prisma.gigs();
    // console.log('gigs: ', gigs);
    const search = 'senior javascript'; // => search by exact title as 1st priority, optinal title as second, tags as third
    // const search = 'Intel Corp Javascript programmer';
    const query = /* graphql */ `
      query {
        searchGigs(search: "${search}") {
          gigs {
            id
            title
            status
            tags {
              id
              name
            }
          }
          ids
        }
      }
    `;

    const res = await post({ query });
    fullDisplay(res);
    const { searchGigs: resG } = res;
    expect(resG[0].p).toBe(1);
    expect(resG[0].title).toBe(searchGigs[0].title);
    expect(resG[1].p).toBe(2);
    expect(resG[2].p).toBe(2);
    expect(resG[3].p).toBe(3);
    expect(resG[4].p).toBe(3);
  });
});

function _cgig(title, tagss) {
  return {
    title,
    tags: tagss,
    description: '',
    status: 'POSTED',
  };
}

// gig search seeds
function tagsFactory() {
  /* eslint-disable prettier/prettier */
  const tags1 = ['g-node', 'g-react', 'g-javascript', 'g-python', 'g-typescript', 'g-java', 'g-next', 'g-css'];
  const tags2 = ['g-information', 'g-engineering', 'g-engineer', 'g-architecture', 'g-frontend', 'g-design', 'g-figma', 'g-consultant'];
  const tags3 = ['g-programmer', 'g-devops', 'g-docker', 'g-infrastracture', 'g-configuration', 'g-ai'];

  return [...tags1, ...tags2, ...tags3];
}

function searchGigsFactory() {
  /* eslint-disable spaced-comment */
  return [
    /*1*/_cgig('Senior javascript programmer', ['g-javascript', 'g-node', 'g-react']),
    /*2*/_cgig('Junior javascript programmer', ['g-javascript', 'g-node']),
    // /*3*/_cgig('Frontend engineer', ['g-javascript', 'g-react', 'g-design', 'g-frontend']),
    // /*4*/_cgig('Experienced Tech Mentor', ['g-javascript', 'g-node', 'g-next']),
    // /*5*/_cgig('Information Business Consultant', ['g-information', 'g-architecture', 'g-consultant']),
    // /*6*/_cgig('Frontend UI/UX designer', ['g-design', 'g-frontend', 'g-figma']),
    // /*7*/_cgig('Development Operation Engineer', ['g-devops', 'g-infrastracture', 'g-configuration']),
    // /*8*/_cgig('Senior AI Engineer', ['g-python', 'g-engineer', 'g-ai']),
  ].map(g => ({ ...g, tags: { connect: g.tags.map(t => ({ name: t })) } }));
  /* eslint-enable spaced-comment */
  /* eslint-enable prettier/prettier */
}

function employerFactory() {
  return {
    users: [
      {
        firstName: 'user',
        lastName: 'user1',
        email: 'admin@amd.com',
        role: 'MEMBER',
        onboardingStep: null,
        password: 'test',
      },
      {
        firstName: 'user',
        lastName: 'user1',
        email: 'admin@intel.com',
        role: 'MEMBER',
        onboardingStep: null,
        password: 'test',
      },
    ],
    employer: [
      {
        displayName: 'AMD Manufacturer',
        employerType: 'COMPANY',
      },
      {
        displayName: 'Intel Corp',
        employerType: 'COMPANY',
      },
    ],
  };
}

async function _insertSearchData(gigs, tags, users) {
  const frag = `
  fragment UEG on User {
    id
    firstName
    lastName
    email
    role
    asEmployer {
      id
      displayName
      gigs {
        id
        title
        description
        tags {
          id
          name
        }
      }
    }
  }
`;

  const allGigs = [[], []];
  const half = gigs.length / 2;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < gigs.length; i++) {
    allGigs[i < half ? 0 : 1].push(gigs[i]);
  }

  return Promise.all(
    users.users.map((u, i) => {
      const emp = users.employer[i];

      return prisma
        .createUser({
          ...u,
          asEmployer: {
            create: {
              ...emp,
              gigs: { create: allGigs[i] },
            },
          },
        })
        .$fragment(frag);
    }),
  );
}
