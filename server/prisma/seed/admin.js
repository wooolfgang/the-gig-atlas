/* eslint-disable no-console */
import argon2 from 'argon2';
import cfg from '../../src/config';
import { prisma } from '../../src/generated/prisma-client';

const { admin } = cfg;

export default async () => {
  const hash = await argon2.hash(admin.password);
  const newAdmin = {
    firstName: 'Mr.',
    lastName: 'Admin',
    email: admin.email,
    password: hash,
    role: 'ADMIN',
  };

  const user = await prisma.user({ email: admin.email });
  if (user && user.role === 'ADMIN') {
    console.log('\n>>> Seed on admin: user already exist');

    return;
  }

  if (user && user.role !== 'ADMIN') {
    try {
      await prisma.deleteUser({ email: admin.email });
      console.log('Removed old admin account.');
    } catch (e) {
      console.log('Failed to reset admin account:', admin.email);
      process.exit(1);
    }
  }

  try {
    await prisma.createUser(newAdmin);

    console.log('\n>>> Sucesful Seed on admin');
    console.log('New admin created: ', newAdmin);
  } catch (e) {
    console.error('error on inserting admin\n');
    console.log(e);
    process.exit(1);
  }
};
