import { gql } from 'apollo-boost';

// Queries
export const PAYPAL_CDN = gql`
  query {
    paypalCDN
  }
`;

// Mutations
export const ORDER_CREATE = gql`
  mutation ORDER_CREATE($items: [ID!]!) {
    order(items: $items)
  }
`;

export const ORDER_COMPLETE = gql`
  mutation ORDER_COMPLETE($orderId: String!) {
    completeOrder(orderId: $orderId)
  }
`;
