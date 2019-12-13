/* eslint-disable no-plusplus */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';
import argon2 from 'argon2';
import prisma from '@thegigatlas/prisma';
import { fullDisplay } from './utils';
import { tags } from './tag';

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

function randomN(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function gigRandStatus() {
  return ['POSTED', 'SAVED'][randomN(0, 1)];
}

function randomTags(count) {
  const stags = [...tags];
  const rtags = [];

  for (let i = 0; i < count; i++) {
    const index = randomN(0, stags.length - 1);
    rtags.push({ name: stags[index] });
    stags.splice(index, 1);
  }

  return rtags;
}

function createGig() {
  return {
    title: faker.name.jobTitle(),
    description: faker.lorem.paragraph(),
    status: gigRandStatus(),
    tags: { connect: randomTags(15) },
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
        tags {
          id
          name
        }
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
  const usersCount = 10;
  const gigsPerUser = 50;

  const toProcess = fromArr(usersCount, () => {
    // => create 5 users with 5 gigs
    const user = createUser(password);
    const employer = createEmployer();
    const gigs = fromArr(gigsPerUser, createGig);
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
    // const res = randomTags(5)
    console.log('\n>>> Sucesful Seed on employer user with gigs');
    console.log('Results\n');
    fullDisplay(res);
  } catch (e) {
    console.error('error on inserting user employers with gigs\n');
    if (e.result) {
      fullDisplay(e.result.errors);
    } else {
      console.log(e);
    }
    process.exit(1);
  }
};
