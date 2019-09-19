import { rule } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import config from '../../../../config';

const verifyAdmin = rule()(async (_, _args, ctx) => {
  const token = ctx.req.get('Authorization');
  try {
    const payload = jwt.verify(token, config.adminSecret);

    ctx.admin = payload;
  } catch (e) {
    return e;
  }

  return true;
});

export default {
  Mutation: {
    adminSignup: verifyAdmin,
  },
};
