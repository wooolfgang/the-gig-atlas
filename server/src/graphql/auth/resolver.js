import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import uuidv4 from 'uuid/v4';
import config from '../../config';
import { getConnectionUrl } from '../../../serverless/google';

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
  /* Create random generated password if password does not exist */
  const password = input.password || uuidv4();
  const hash = await argon2.hash(password);

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
    googleAuth: () => getConnectionUrl(),
  },
  Mutation: {
    signup,
    login,
  },
};
