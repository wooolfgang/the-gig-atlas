import { prisma } from '../../src/generated/prisma-client';
import cfg from '../../src/config';

const { admin } = cfg;

export default async () => {
  const threads = [
    {
      title: 'Daily standup. What are you working on today?',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      tags: {
        connect: [
          {
            name: 'discuss',
          },
          {
            name: 'productivity',
          },
        ],
      },
      postedBy: {
        connect: {
          email: admin.email,
        },
      },
    },
    {
      title: 'Rant wednesdays. Talk about your rants anonymously',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      tags: {
        connect: [
          {
            name: 'discuss',
          },
        ],
      },
      postedBy: {
        connect: {
          email: admin.email,
        },
      },
    },
    {
      title: 'Introduce yourself!',
      body:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      tags: {
        connect: [
          {
            name: 'discuss',
          },
        ],
      },
      postedBy: {
        connect: {
          email: admin.email,
        },
      },
    },
  ];

  try {
    const deleted = await prisma.deleteManyThreads();
    const newThreads = await Promise.all(
      threads.map(thread => prisma.createThread(thread)),
    );

    console.log('\n>>> Seed on threads');
    console.log('removed old threads', deleted);
    console.log('created new threads:\n', newThreads);
  } catch (e) {
    console.error('error on inserting threads(s)\n', e);
    process.exit(1);
  }
};
