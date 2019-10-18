import { gql } from 'apollo-boost';

/* Mutations */

/* Queries */

export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
    }
  }
`;

export const ALL_PRODUCTS = gql`
  query {
    products {
      id
      name
      description
      price
    }
  }
`;
