import express from 'express';
import morgan from 'morgan';
import gqlMiddleware from './graphql/middleware';
import config from './config';

async function createApp() {
  const app = express()
    .use(morgan(config.morgan))
    .use('/gql', gqlMiddleware);

  return app;
}

export default createApp;
