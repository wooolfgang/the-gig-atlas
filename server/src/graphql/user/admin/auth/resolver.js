import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import config from '../../../../config';

const signup = async (_, { input }, { prisma }) => {
  const hash = await argon2.hash(input.password);

  const { id } = await prisma.createAdmin({ ...input, password: hash });

  return {
    id,
    token: jwt.sign({ id }, config.adminSecret),
  };
};

const login = async (_, { email, password }, { prisma }) => {
  const user = await prisma.admin({ email });
  try {
    if (!user || !argon2.verify(user.password, password)) {
      throw new Error('Invalid credentials');
    }
  } catch (e) {
    throw new Error('Internal Error');
  }

  return {
    id: user.id,
    token: jwt.sign({ id: user.id }, config.adminSecret),
  };
};

export default {
  Mutation: {
    adminLogin: login,
    adminSignup: signup,
  },
};
