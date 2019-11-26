import { allow } from 'graphql-shield';

export default {
  Mutation: {},
  Query: {
    tag: allow,
    tags: allow,
  },
  Tag: allow,
  TagCategory: allow,
};
