import { allow } from 'graphql-shield';
import { isAuthenticated } from '../utils/rules';

export default {
  Mutation: {
    uploadImage: isAuthenticated,
    createFile: isAuthenticated,
  },
  Query: {
    file: allow,
  },
  File: allow,
};
