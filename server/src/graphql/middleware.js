import { importSchema } from 'graphql-import';
import graphHttp from 'express-graphql';
import { fileLoader } from 'merge-graphql-schemas';
import { makeExecutableSchema } from 'graphql-tools';
import config from '../config';
import { prisma } from '../generated/prisma-client';

const typeDefs = importSchema(`${__dirname}/schema.graphql`);
const resolvers = fileLoader('./**/resolver.js');

const schema = makeExecutableSchema({ typeDefs, resolvers });

const middleware = graphHttp((req) => ({
  schema,
  context: { prisma, req },
  graphiql: !!config.hasGraphiQl,
}));

export default middleware;
