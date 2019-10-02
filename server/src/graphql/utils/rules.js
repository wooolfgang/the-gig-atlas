import { rule } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import config from '../../config';

const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secretUser, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

const loadAuthPayload = async ctx => {
  const token = ctx.req.get('Authorization');
  if (!token) {
    return new Error('No token specified');
  }

  const payload = await verifyToken(token);
  ctx.user = payload;

  return payload;
};

export const isMemberOnly = rule()(async (_, _1, ctx) => {
  const payload = await loadAuthPayload(ctx);
  ctx.isAuthenticated = true;

  return payload.role === 'MEMBER';
});

export const isAdminOnly = rule()(async (_, _1, ctx) => {
  const payload = await loadAuthPayload(ctx);
  ctx.isAuthenticated = true;

  return payload.role === 'ADMIN';
});

export const isAuthenticated = rule()(async (_, _1, ctx) => {
  await loadAuthPayload(ctx);

  return true;
});

export const hasNoAuth = rule()(
  (_, _args, { req }) => !req.get('Authorization'),
);

export const validate = schema =>
  rule()(async (_, args) => {
    try {
      await schema.validate(args);

      return true;
    } catch (e) {
      return e;
    }
  });
