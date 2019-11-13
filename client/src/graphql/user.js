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

// note => mutation must return user as reference for chaching
// note => the return user from onboaridng mutation replaces the data to apollo chached user

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

export const ONBOARDING_FREELANCER = gql`
  mutation ONBOARDING_FREELANCER($input: FreelancerOnboardIn!) {
    onboardingFreelancer(input: $input) {
      id
      onboardingStep
      asFreelancer {
        id
      }
    }
  }
`;
