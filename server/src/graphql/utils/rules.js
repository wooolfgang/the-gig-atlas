import { rule } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const ADMIN = 'ADMIN';
export const MEMBER = 'MEMBER';

/**
 * Resolves on valid token
 * @param {String} jwt token from Authorization headers
 */
export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secretUser, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

/**
 * Loads payload to ctx.user after sucessful jwt verification
 * @param {ResolverContext} ctx graphql resolver's context
 */
const loadAuthPayload = async ctx => {
  const token = ctx.req.get('Authorization');
  if (!token) {
    return new Error('No token specified');
  }

  const payload = await verifyToken(token);
  ctx.user = payload;
  ctx.isAuthenticated = true;

  return payload;
};

/**
 * Athorization for MEMBER access only
 */
export const isMemberOnly = rule()(async (_, _1, ctx) => {
  const payload = await loadAuthPayload(ctx);

  return payload.role === MEMBER;
});

/**
 * Athorization for ADMIN access only
 */
export const isAdminOnly = rule()(async (_, _1, ctx) => {
  const payload = await loadAuthPayload(ctx);

  return payload.role === MEMBER;
});

/**
 * Ahorization for all valid jwt
 */
export const isAuthenticated = rule()(async (_, _1, ctx) => {
  await loadAuthPayload(ctx);

  return true;
});

/**
 * Ahorization for expired and no jwt only
 */
export const hasNoAuth = rule()(async (_, _args, { req }) => {
  const token = req.get('Authorization');
  if (!token) {
    return true;
  }

  try {
    await verifyToken(token);

    return 'Already logged-in';
    // return e;
  } catch (e) {
    return true;
  }
});

/**
 * Authorize by which given roles
 * @param  {...[String!]} roles params of user roles
 * @example isEitherAuth(isEitherAuth.MEMBER, isEitherAuth.ADMIN)
 */
const isEitherAuth = (...roles) =>
  rule()(async (_, _a, { ctx }) => {
    const payload = await loadAuthPayload(ctx);

    return roles.some(role => role === payload.role);
  });

isEitherAuth.ADMIN = ADMIN;
isEitherAuth.MEMBER = MEMBER;

export { isEitherAuth };

/**
 * Validates input values by provided schema
 * @param {YupObjectSchema} schema schema validator for specified format
 */
export const validate = schema =>
  rule()(async (_, args) => {
    try {
      await schema.validate(args);

      return true;
    } catch (e) {
      return e;
    }
  });
