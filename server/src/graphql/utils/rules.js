/* eslint-disable operator-linebreak */
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

export const purify = (fields, object, isRequired = true) => {
  const field = fields.shift();

  if (fields.length === 0) {
    const value = object[field];
    if (typeof value === 'string') {
      // eslint-disable-next-line no-param-reassign
      object[field] = domPurify.sanitize(value);

      return true;
    }

    if (value === undefined && !isRequired) {
      return true;
    }

    throw new Error(
      `Sanitazion Error: field '${field}'; value '${value}'. Must be string.`,
    );
  }

  return purify(fields, object[field], isRequired);
};

/**
 * Field
 * @typedef {Object} Field
 * @property {string} name - the field name
 * @property {boolean=} isRequired - [default=true] set field required
 */

/**
 * Compares the args object. Uses dot notation
 * By default field are required and willthrow error
 *  unless isRequired is set to false ({name: 'input.description', isRequired: false })
 * @param {Field|Field[]|string|String[]} field
 * Ex: "input.description" compares it to args.input.description and purifies it
 */
export const dompurify = field => {
  if (field instanceof Array) {
    const fields = field.map(f => {
      if (f instanceof Object && typeof f.name === 'string') {
        return field;
      }

      if (typeof f === 'string') {
        return { name: f };
      }

      throw new Error(`Invalid field, ${f}`);
    });

    return rule()(async (_, args) =>
      fields.every(f => purify(f.name.split('.'), args, f.isRequired) === true),
    );
  }

  if (field instanceof Object && typeof field.name === 'string') {
    return rule()(async (_, args) =>
      purify(field.name.split('.'), args, field.isRequired),
    );
  }

  if (typeof field === 'string') {
    return rule()(async (_, args) => purify(field.split('.'), args, true));
  }

  throw new Error(`Invalid field value: ${field}`);
};
