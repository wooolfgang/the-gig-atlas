import { allow } from 'graphql-shield';
import { isAuthenticated } from '../utils/rules';

export default {
  Query: {
    paypalCDN: allow,
  },
  Mutation: {
    /**
     * @todo: set isEmployerRule
     */
    order: allow, //isAuthenticated,
  },
};
