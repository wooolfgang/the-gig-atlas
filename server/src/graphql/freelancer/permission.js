import { allow } from 'graphql-shield';
import { isAuthenticated } from '../utils/rules';

export default {
  Query: {
    freelancers: isAuthenticated,
  },
  Freelancer: allow,
  PortfolioProject: allow,
  Social: allow,
};
