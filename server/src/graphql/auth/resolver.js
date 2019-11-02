import argon2 from 'argon2';
import uuidv4 from 'uuid/v4';
import google from '../../serverless/google';
import github from '../../serverless/github';
import { verifyToken } from '../utils/rules';
import { createAuth } from './util';
import { header } from '@shared/common';

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

/**
 * Resolver for handling user password
 */
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

  const isVerified = await argon2.verify(user.password, password);
  if (!isVerified) {
    throw new Error('Invalid credentials');
  }

  return createAuth(user.id, user.role);
};

const checkValidToken = async (_, _1, { req }) => {
  const auth = req.get('Authorization');
  if (!auth) {
    return false;
  }

  const token = header.getToken(auth);

  if (!token) {
    return false;
  }

  try {
    await verifyToken(token);

    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Resolver for handling providers OAuth
 */
const oauth = async (_, { input }, { prisma }) => {
  const { code, provider } = input;
  let data;

  if (provider === 'google') {
    data = await google.getUserData(code);
  } else if (provider === 'github') {
    data = await github.getUserData(code);
  } else {
    throw new Error('No provider');
  }

  const { email, firstName, lastName } = data;
  const user = await prisma // => check user if already a member or not
    .user({ email })
    .$fragment('fragment Login on User { id role password }');
  let logType;
  let authPayload;

  if (user) {
    // => login user
    logType = 'LOGIN';
    authPayload = await createAuth(user.id, user.role);
  } else {
    // => create new User if user dont exist
    logType = 'SIGNUP';
    const create = {
      email,
      firstName,
      lastName,
      isEmailVerified: true,
    };

    authPayload = await createUser(create, prisma);
  }

  return { logType, ...authPayload };
};

const oauthURL = () => ({
  google: google.getConnectionUrl(),
  github: github.getConnectionURL(),
});

/**
 * Get current logged in user
 */
const authenticatedUser = async (root, args, { prisma, user }, info) =>
  prisma.user({ id: user.id }, info);

export default {
  Query: {
    checkValidToken,
    oauthURL,
    authenticatedUser,
  },
  Mutation: {
    signup,
    login,
    oauth,
  },
};
