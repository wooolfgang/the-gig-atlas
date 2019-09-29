import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';

import gqlMiddleware from './graphql/middleware';
import config from './config';
import { auth } from './routes';

async function createApp() {
  const app = express()
    .use(cors(config.cors))
    .use(morgan(config.morgan))
    .use(express.json({ limit: '10mb', extended: true }))
    .use(express.urlencoded({ limit: '10mb', extended: true }))
    .use('/api', auth)
    .use(
      '/gql',
      graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
      gqlMiddleware,
    ).use((err, req, res, next) => {
      console.log("error >>>>>>");
      console.log(err);
      next(err);
    });

  return app;
}

export default createApp;
