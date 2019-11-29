import graphHttp from 'express-graphql';
import { importSchema } from 'graphql-import';
import { fileLoader } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import { shield, deny } from 'graphql-shield';
import assign from 'assign-deep';
import prisma from '@thegigatlas/prisma';
import config from '../config';

const typeDefs = importSchema(`${__dirname}/main.graphql`);
const resolvers = fileLoader(`${__dirname}/**/resolver.js`, {
  recursive: true,
});
const permissions = shield(
  assign(...fileLoader(`${__dirname}/**/permission.js`, { recursive: true })),
  {
    debug: !!config.hasDebug,
    fallbackRule: deny,
  },
);
const schema = applyMiddleware(
  makeExecutableSchema({ typeDefs, resolvers }),
  permissions,
);

const middleware = graphHttp(req => ({
  schema,
  context: { req, config, prisma },
  graphiql: !!config.hasGraphiQl,
  customFormatErrorFn: config.gqlDebugger,
}));

export default middleware;
