import express from 'express';
import { prisma } from '../generated/prisma-client';
import services from './services';

let app;

async function createApp() {
  if (app) {
    return app;
  }

  app = express()
    .use('/users', services.users.usersRoute(prisma))
    .use(services.errors.logErrorHandlers);

  return app;
}

export default createApp;
