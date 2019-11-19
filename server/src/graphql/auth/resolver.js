import { header } from '@shared/common';
import google from '../../serverless/google';
import github from '../../serverless/github';
import { verifyToken } from '../utils/rules';
import { createAuth, createUser, loginUser } from './util';

/**
 * Resolver for handling user password
 */
const signup = (_, { input }) => {
  const { accountType, ...create } = input;
  create.onboardingStep = accountType;

  return createUser(create);
};

const login = (_, { email, password }) => loginUser(email, password);

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

  const { email, firstName, lastName, imageUrl } = data;
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

    if (imageUrl) {
      create.avatar = {
        create: {
          name: 'Avatar Url',
          url: imageUrl,
        },
      };
    }

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
