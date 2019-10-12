import { allow } from 'graphql-shield';
import { isAdminOnly } from '../utils/rules';

export default {
  Query: {
    products: allow,
    product: allow,
  },
  Mutation: {
    addProduct: isAdminOnly,
  },
  Product: allow,
};
