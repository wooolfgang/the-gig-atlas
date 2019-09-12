import express from 'express';
import services from './services';
import gqlMiddleware from './graphql/middleware';

let app;

async function createApp() {
  if (app) {
    return app;
  }

  app = express()
    .use('/gql', gqlMiddleware)
    .use(services.errors.logErrorHandlers);

  return app;
}

export default createApp;
