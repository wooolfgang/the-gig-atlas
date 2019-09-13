import express from 'express';
import gqlMiddleware from './graphql/middleware';

let app;

async function createApp() {
  if (app) {
    return app;
  }

  app = express().use('/gql', gqlMiddleware);

  return app;
}

export default createApp;
