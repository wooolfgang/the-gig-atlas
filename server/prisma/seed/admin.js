import argon2 from 'argon2';
import cfg from '../../src/config';
import { prisma } from '../../src/generated/prisma-client';

const { admin } = cfg;

export default async () => {
  try {
    await prisma.deleteUser({ email: admin.email });

    const hash = await argon2.hash(admin.password);

    const newAdmin = {
      firstName: 'Mr.',
      lastName: 'Admin',
      email: admin.email,
      password: hash,
      role: 'ADMIN',
    };

    await prisma.createUser(newAdmin);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }
};
