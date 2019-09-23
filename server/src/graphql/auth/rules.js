import { rule } from 'graphql-shield';
import yup from 'yup';
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

export const verifyUser = rule()(async (_, _args, ctx) => {
  const token = ctx.req.get('Authorization');
  try {
    const payload = await verifyToken(token);

    ctx.user = payload;
  } catch (e) {
    return e;
  }

  return true;
});

export const isAdmin = rule()(
  (_, _args, { user }) => user && user.role === 'ADMIN',
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

export const isAuthenticated = rule()((_, _args, { user }) => !!user);
