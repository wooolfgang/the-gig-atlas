import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import config from '../../config';

const signup = async (_, { input }, { prisma }) => {
  const hash = await argon2.hash(input.password);

  const create = {
    ...input,
    password: hash,
    role: 'MEMBER',
  };

  const { id } = await prisma.createUser(create);

  return {
    id,
    token: jwt.sign({ id }, config.secretUser),
  };
};

const login = async (_, { email, password }, { prisma }) => {
  const user = await prisma.user({ email });

  try {
    if (!user || !argon2.verify(user.password, password)) {
      throw new Error('Invalid credentials');
    }
  } catch (e) {
    throw new Error('Internal Error');
  }

  return {
    id: user.id,
    token: jwt.sign({ id: user.id, role: user.role }, config.secretUser),
  };
};

export default {
  Query: {
    //
  },
  Mutation: {
    signup,
    login,
  },
};
