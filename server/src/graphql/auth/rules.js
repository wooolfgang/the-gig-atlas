import { rule } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const verifyUser = rule()((_, _args, ctx) => {
  const token = ctx.req.get('Authorization');
  try {
    const payload = jwt.verify(token, config.secretUser);

    ctx.user = payload;
  } catch (e) {
    return e;
  }

  return true;
});

export const isAdmin = rule()(
  (_, _args, { user }) => user && user.role === 'ADMIN',
);

export const isAuthenticated = rule()((_, _args, { user }) => !!user);

// export default {
//   verifyUser,
//   isAdmin,
//   isAuthenticated,
// };
