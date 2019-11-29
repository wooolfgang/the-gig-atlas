import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import argon2 from 'argon2';
import prisma from '@thegigatlas/prisma';
import config from '../../config';

/**
 * Async utility function to create new JWT
 * @param {Object} payload contains value for jwt
 */
export function jwtSign(payload) {
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

/**
 * Creates new token with provided payload values
 * @param {String} id user's id
 * @param {String} role role of user
 */
export async function createAuth(id, role) {
  const token = await jwtSign({ id, role });

  return {
    id,
    token,
  };
}

export async function createUser(input) {
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

export async function loginUser(email, password) {
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
}
