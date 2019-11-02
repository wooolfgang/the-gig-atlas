/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost';

// QUERIES
export const USER_AUTH = gql`
  query {
    user {
      id
      firstName
      lastName
      email
      role
      isEmailVerified
      asEmployer {
        id
        employerType
        displayName
        email
      }
      asFreelancer {
        id
        isPrivate
        isForHire
      }
    }
  }
`;
