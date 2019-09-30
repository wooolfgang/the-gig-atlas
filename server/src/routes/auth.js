import express from 'express';
import { getUserData } from '../../serverless/google';
import { prisma } from '../generated/prisma-client';
import { createUser, createAuth } from '../graphql/auth/resolver';

const router = express.Router();

router.get('/googleauth', async (req, res, next) => {
  try {
    const { email, firstName, lastName } = await getUserData(req.query.code);
    const user = await prisma
      .user({ email })
      .$fragment('fragment Login on User { id role password }');

    // create new user
    if (!user) {
      const create = {
        email,
        firstName,
        lastName,
      };

      const authPayload = await createUser(create, prisma);

      /**
       * @todo: redirect to form fillup
       */
      res.json(authPayload);
      next();
      return;
    }

    const authPayload = await createAuth(user.id, user.role);

    // login user
    /**
     * @todo: setup redirection page and auth
     */
    res.json(authPayload);
  } catch (e) {
    // errors must be pass to next
    next(e);
  }
});

export default router;
