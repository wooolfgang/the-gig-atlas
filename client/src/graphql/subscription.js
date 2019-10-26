import { gql } from 'apollo-boost';

// QUERIES
export const ACTIVE_PLANS = gql`
  query {
    activePlans {
      id
      codename
      name
      description
      cyclePrice
    }
  }
`;

// Mutations
export const SUBSCRIBE = gql`
  mutation SUBSCRIBE($planCode: String!) {
    subscribe(planCode: $planCode) {
      id
      status
    }
  }
`;

export const APPROVE_SUBSCRIPTON = gql`
  mutation APPROVE_SUBSCRIPTON($serviceId: String!, $orderId: String!) {
    approveSubscription(subscriptionId: $subscriptionId, orderId: $orderId)
  }
`;
