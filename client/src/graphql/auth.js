/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost';

// QUERIES
export const CHECK_VALID_TOKEN = gql`
  query {
    checkValidToken
  }
`;

export const OAUTH_URL = gql`
  query {
    oauthURL {
      google
      github
    }
  }
`;

// MUTATIONS
export const SIGNUP_LOCAL = gql`
  mutation SIGNUP_LOCAL($input: SignupInput!) {
    signup(input: $input) {
      id
      token
    }
  }
`;

export const LOGIN_LOCAL = gql`
  mutation LOGIN_LOCAL($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      token
    }
  }
`;

export const OAUTH = gql`
  mutation OAUTH($input: OAuthInput!) {
    oauth(input: $input) {
      id
      token
      logType
    }
  }
`;
