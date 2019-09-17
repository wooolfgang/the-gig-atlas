import express from 'express';
import morgan from 'morgan';
import gqlMiddleware from './graphql/middleware';
import config from './config';

let app;

async function createApp() {
  if (app) {
    return app;
  }

  app = express()
    .use(morgan(config.morgan))
    .use('/gql', gqlMiddleware);

  return app;
}

export default createApp;
