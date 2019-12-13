/* eslint-disable no-console */
// import cfg from '../../src/config';
import prisma from '@thegigatlas/prisma';

export default async () => {
  const technologyTags = [
    {
      name: 'nodejs',
      categories: {
        connect: {
          name: 'technology',
        },
      },
    },
    {
      name: 'react',
      categories: {
        connect: {
          name: 'technology',
        },
      },
    },
    {
      name: 'javascript',
      categories: {
        connect: {
          name: 'technology',
        },
      },
    },
  ];

  try {
    // const deleted = await prisma.deleteManyTags(); // should not cause conflict, use purge command instead

    try {
      await prisma.createTagCategory({
        name: 'technology',
      });
    } catch (e) {
      // Catch error if categoryTag "thread" already exists
    }

    const newTechnologyTags = await Promise.all([
      ...technologyTags.map(tag => prisma.createTag(tag)),
    ]);

    console.log('\n>>> Seed on technologyTags');
    console.log('removed old technologyTags', deleted);
    console.log('created new technologyTags:\n', newTechnologyTags);
  } catch (e) {
    console.error('error on inserting technologyTags(s)\n', e);
  }
};
