import { allow } from 'graphql-shield';
import { isAuthenticated } from '../utils/rules';

export default {
  Query: {
    plan: allow,
    listPlans: allow,
    activePlans: allow,
    subscription: allow,
    listSubscriptions: allow,
  },
  Mutation: {
    subscribe: isAuthenticated,
    approveSubscription: isAuthenticated,
    // approve: isAuthenticated,
    // cancel: isAuthenticated,
  },
  PlanSubscription: allow,
  Plan: allow,
  SubscribeResult: allow,
};
