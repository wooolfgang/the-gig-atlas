/* eslint-disable no-console */
// import cfg from '../../src/config';
import { prisma } from '../../src/generated/prisma-client';

export default async () => {
  const threadTags = [
    {
      name: 'freelance',
    },
    {
      name: 'design',
    },
    {
      name: 'discuss',
    },
    {
      name: 'webdev',
    },
    {
      name: 'productivity',
    },
  ];

  try {
    const deleted = await prisma.deleteManyThreadTags();
    const newThreadTags = await Promise.all([
      ...threadTags.map(tag => prisma.createThreadTag(tag)),
    ]);

    console.log('\n>>> Seed on threadTags');
    console.log('removed old threadTags', deleted);
    console.log('created new threadTags:\n', newThreadTags);
  } catch (e) {
    console.error('error on inserting threadTags(s)\n', e);
  }
};
