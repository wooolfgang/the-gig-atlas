import express from 'express';

function usersRoute(prisma) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const users = await prisma.users();

    res.json(users);
  });

  return router;
}

export default { usersRoute };
