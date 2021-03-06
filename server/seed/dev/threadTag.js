/* eslint-disable no-console */
// import cfg from '../../src/config';
import prisma from '@thegigatlas/prisma';

export default async () => {
  const threadTags = [
    {
      name: 'freelance',
      categories: {
        connect: {
          name: 'thread',
        },
      },
    },
    {
      name: 'design',
      categories: {
        connect: {
          name: 'thread',
        },
      },
    },
    {
      name: 'discuss',
      categories: {
        connect: {
          name: 'thread',
        },
      },
    },
    {
      name: 'webdev',
      categories: {
        connect: {
          name: 'thread',
        },
      },
    },
    {
      name: 'productivity',
      categories: {
        connect: {
          name: 'thread',
        },
      },
    },
  ];

  try {
    try {
      await prisma.createTagCategory({
        name: 'thread',
      });
    } catch (e) {
      // Catch error if categoryTag "thread" already exists
    }

    const newThreadTags = await Promise.all([
      ...threadTags.map(tag => prisma.createTag(tag)),
    ]);

    console.log('\n>>> Seed on threadTags');
    console.log('created new threadTags:\n', newThreadTags);
  } catch (e) {
    console.error('error on inserting threadTags(s)\n', e);
  }
};
