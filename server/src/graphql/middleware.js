import graphHttp from 'express-graphql';
import { importSchema } from 'graphql-import';
import { fileLoader } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';
import config from '../config';
import { prisma } from '../generated/prisma-client';

const typeDefs = importSchema(`${__dirname}/schema.graphql`);
const resolvers = fileLoader(`${__dirname}/**/resolver.js`, {
  recursive: true,
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

const middleware = graphHttp(req => ({
  schema,
  context: { prisma, req },
  graphiql: !!config.hasGraphiQl,
  customFormatErrorFn: config.gqlDebugger,
}));

export default middleware;
