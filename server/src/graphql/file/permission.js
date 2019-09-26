import { allow } from 'graphql-shield';

export default {
  Mutation: {
    uploadImage: allow,
  },
  Query: {
    file: allow,
  },
  File: allow,
};
