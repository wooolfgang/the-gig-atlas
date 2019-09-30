import express from 'express';
import { getUserData } from '../../serverless/google';

const router = express.Router();

router.get('/googleauth', async (req, res, next) => {
  try {
    const userData = await getUserData(req.query.code);

    /**
     * @todo: setup redirection page and auth
     */
    res.json(userData);
  } catch (e) {
    next(e);
  }
});

export default router;
