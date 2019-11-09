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

// MUTATIONS

export const ONBOARDING_PERSONAL = gql`
  mutation ONBOARDING_PERSONAL($input: PersonalInput!) {
    onboardingPersonal(input: $input) {
      id
      onboardingStep
    }
  }
`;

export const ONBOARDING_EMPLOYER = gql`
  mutation ONBOARDING_EMPLOYER($input: EmployerOnboardbIn!) {
    onboardingEmployer(input: $input) {
      id
      onboardingStep
      asEmployer {
        id
        employerType
        displayName
        email
      }
    }
  }
`;
