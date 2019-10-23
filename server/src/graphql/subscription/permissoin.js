import { allow } from 'graphql-shield';
import { isAuthenticated } from '../utils/rules';

export default {
  Query: {
    plan: allow,
    listPlan: allow,
    subscription: allow,
    listSubscription: allow,
  },
  Mutation: {
    newSubscription: isAuthenticated,
    approve: isAuthenticated,
    cancel: isAuthenticated,
  },
  Subscription: allow,
  Plan: allow,
};
