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

export const GET_USER_INFO = gql`
  query GET_USER_INFO($where: UserWhereUniqueInput!) {
    getUser(where: $where) {
      id
      firstName
      lastName
      asFreelancer {
        id
        website
        location
        socials {
          id
          type
        }
      }
    }
  }
`;

export const GET_USER_FREELANCER_PROFILE = gql`
  query GET_USER_FREELANCER_PROFILE($where: UserWhereUniqueInput!) {
    getUser(where: $where) {
      id
      firstName
      lastName
      accountType
      avatar {
        id
        url
      }
      asFreelancer {
        id
        bio
        website
        location
        timezone
        isPrivate
        isForHire
        socials {
          id
          type
          url
        }
        skills
        portfolio {
          id
          title
          description
          url
          avatar {
            id
            url
          }
        }
      }
    }
  }
`;

// MUTATIONS
// note => mutation must return user as reference for caching
// note => the return user from onboarding mutation replaces the data to apollo cached user
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
