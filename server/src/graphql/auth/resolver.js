import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import uuidv4 from 'uuid/v4';
import config from '../../config';
import { getConnectionUrl } from '../../../serverless/google';

function jwtSign(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, config.secretUser, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

export async function createAuth(id, role) {
  const token = await jwtSign({ id, role });

  return {
    id,
    token,
  };
}

export async function createUser(input, prisma) {
  const password = input.password || uuidv4();
  const hash = await argon2.hash(password);

  const create = {
    ...input,
    password: hash,
    role: 'MEMBER',
  };

  const { id, role } = await prisma
    .createUser(create)
    .$fragment('fragment Payload on User { id role password }');

  return createAuth(id, role);
}

function signup(_, { input }, { prisma }) {
  return createUser(input, prisma);
}

const login = async (_, { email, password }, { prisma }) => {
  const user = await prisma
    .user({ email })
    .$fragment('fragment Payload on User { id role password }');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isVeryfied = await argon2.verify(user.password, password);
  if (!isVeryfied) {
    throw new Error('Invalid credentials');
  }

  return createAuth(user.id, user.role);
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
