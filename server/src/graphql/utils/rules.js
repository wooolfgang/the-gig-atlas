/* eslint-disable function-paren-newline */
import { rule } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import { header } from '@shared/common';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import * as yup from 'yup';
import config from '../../config';

const { window } = new JSDOM('<!DOCTYPE html>');
const domPurify = DOMPurify(window);

export const ADMIN = 'ADMIN';
export const MEMBER = 'MEMBER';

/**
 * Resolves on valid token
 * @param {String} jwt token from Authorization headers
 */
export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secretUser, (err, payload) =>
      err ? reject(err) : resolve(payload),
    );
  });

/**
 * Loads payload to ctx.user after sucessful jwt verification
 * @param {ResolverContext} ctx graphql resolver's context
 */
const loadAuthPayload = async ctx => {
  const authorization = ctx.req.get('Authorization');
  if (!authorization) {
    throw new Error('Invalid Authorization');
  }

  const token = header.getToken(authorization);

  if (!token) {
    throw new Error('Invalid token');
  }

  try {
    const payload = await verifyToken(token);
    ctx.user = payload;
    ctx.isAuthenticated = true;

    return payload;
  } catch (e) {
    throw new Error('Invalid authentication');
  }
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

  return payload.role === ADMIN;
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
  const authorization = req.get('Authorization');

  if (!authorization) {
    return true;
  }

  try {
    const token = header.getToken(authorization);

    await verifyToken(token);

    return 'Already logged-in';
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
const validate = schema =>
  rule()(async (_, args) => {
    try {
      await schema.validate(args);

      return true;
    } catch (e) {
      return e;
    }
  });

/**
 * add shape for nested input
 */
validate.withShape = shape => validate(yup.object().shape(shape));

export { validate };

export const purify = (fields, object) => {
  const field = fields.shift();

  if (fields.length === 0) {
    if (typeof object[field] !== 'string') {
      throw new Error(
        'Error trying to sanitize an input that is not a valid string',
      );
    }
    // eslint-disable-next-line no-param-reassign
    object[field] = domPurify.sanitize(object[field]);
    return true;
  }

  return purify(fields, object[field]);
};

/**
 * Compares the args object. Uses dot notation
 * @param {String or Array} field
 * Ex: "input.description" compares it to args.input.description and purifies it
 */
export const dompurify = field =>
  rule()(async (_, args) => {
    if (!field) {
      console.warn(
        "No field input in dompurify. Verify if you're using this function correctly",
      );
      return false;
    }

    if (field instanceof Array) {
      return field.every(f => purify(f.split('.'), args) === true);
    }

    if (typeof field === 'string') {
      return purify(field.split('.'), args);
    }

    return false;
  });
