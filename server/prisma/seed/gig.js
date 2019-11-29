/* eslint-disable no-plusplus */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import argon2 from 'argon2';
import prisma from '../../src/prisma';
import { fullDisplay } from './utils';

function createUser(password) {
  return {
    password,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    role: 'MEMBER',
    onboardingStep: null,
  };
}

function createEmployer() {
  return {
    displayName: faker.company.companyName(),
    employerType: 'COMPANY',
  };
}

// const progLangs = ['js', 'python', 'rust', 'java', 'C', 'C++', 'C#', 'html', 'css', 'es6', 'typescript', 'go', 'dart'];
// const techs = ['react', 'vue', 'yue', 'aws', 'graphql', 'node', 'webassembly', 'android', 'linux'];
// const engineering = ['configuration', 'devops', 'architecture', 'software design', 'microservices'];

function createGig() {
  return {
    title: faker.name.jobTitle(),
    description: faker.lorem.paragraph(),
    status: 'POSTED',
  };
}

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
      }
    }
  }
`;

function fromArr(count, create) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(create());
  }

  return arr;
}

export default async () => {
  const password = await argon2.hash('password');

  const toProcess = fromArr(5, () => {
    // => create 5 users with 5 gigs
    const user = createUser(password);
    const employer = createEmployer();
    const gigs = fromArr(5, createGig);
    return prisma
      .createUser({
        ...user,
        asEmployer: {
          create: {
            ...employer,
            gigs: { create: gigs },
          },
        },
      })
      .$fragment(frag);
  });

  try {
    const res = await Promise.all(toProcess);

    console.log('\n>>> Sucesful Seed on employer user with gigs');
    console.log('Results\n');
    fullDisplay(res);
  } catch (e) {
    console.error('error on inserting user employers with gigs\n');
    if (e.result) {
      console.log(e.result.errors);
    } else {
      console.log(e);
    }
    process.exit(1);
  }
};
