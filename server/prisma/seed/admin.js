/* eslint-disable no-console */
import argon2 from 'argon2';
import cfg from '../../src/config';
import { prisma } from '../../src/generated/prisma-client';

const { admin } = cfg;

export default async () => {
  try {
    await prisma.deleteUser({ email: admin.email });
    console.log('Removed old admin account');
  } catch (e) {
    console.log('Nothing to reset on admin account');
  }

  try {
    const hash = await argon2.hash(admin.password);

    const newAdmin = {
      name: 'admin',
      email: admin.email,
      password: hash,
      role: 'ADMIN',
    };

    await prisma.createUser(newAdmin);

    console.log('Inserted Admin(s): ', newAdmin);
  } catch (e) {
    console.error('error on inserting admin\n', e);
    process.exit(1);
  }
};
