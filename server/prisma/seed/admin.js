/* eslint-disable no-console */
import argon2 from 'argon2';
import cfg from '../../src/config';
import { prisma } from '../../src/generated/prisma-client';

const { admin } = cfg;

export default async () => {
  try {
    await prisma.deleteUser({ email: admin.email });
  } catch (e) {
    console.log('Nothing to reset on admin account');
  }

  try {
    const hash = await argon2.hash(admin.password);

    const newAdmin = {
      firstName: 'Mr.',
      lastName: 'Admin',
      email: admin.email,
      password: hash,
      role: 'ADMIN',
    };

    await prisma.createUser(newAdmin);

    console.log('\n>>> Seed on admin');
    console.log('Removed old admin account.');
    console.log('New admin created: ', newAdmin);
  } catch (e) {
    console.error('error on inserting admin\n', e);
    process.exit(1);
  }
};
