import { allow } from 'graphql-shield';

export default {
  Mutation: {
    uploadImage: allow,
    createFile: allow,
  },
  Query: {
    file: allow,
  },
  File: allow,
};
