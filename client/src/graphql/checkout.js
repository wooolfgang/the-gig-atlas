import { gql } from 'apollo-boost';

// Queries
export const PAYPAL_CDN = gql`
  query {
    paypalCDN
  }
`;

// Mutations
export const ORDER = gql`
  mutation ORDER($items: [ID!]!) {
    order(items: $items)
  }
`;
