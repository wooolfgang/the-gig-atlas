import argon2 from 'argon2';
import config from '../../src/config';
import { prisma } from '../../src/generated/prisma-client';

export default async () => {
  try {
    await prisma.deleteUser({ email: config.admin.email });

    const hash = await argon2.hash(config.admin.password);

    const admin = {
      name: 'admin',
      email: config.admin.email,
      password: hash,
      role: 'ADMIN',
    };

    await prisma.createUser(admin);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }
};
