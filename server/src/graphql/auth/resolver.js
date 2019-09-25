import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import config from '../../config';

const jwtSign = payload =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, config.secretUser, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });

const signup = async (_, { input }, { prisma }) => {
  const hash = await argon2.hash(input.password);

  const create = {
    ...input,
    password: hash,
    role: 'MEMBER',
  };

  const { id, role } = await prisma.createUser(create);
  const token = await jwtSign({ id, role });

  return {
    id,
    token,
  };
};

const login = async (_, { email, password }, { prisma }) => {
  const user = await prisma
    .user({ email })
    .$fragment('fragment Login on User { id role password }');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isVeryfied = await argon2.verify(user.password, password);
  if (!isVeryfied) {
    throw new Error('Invalid credentials');
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
