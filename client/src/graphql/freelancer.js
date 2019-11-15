import { gql } from 'apollo-boost';

export const FREELANCER_ONBOARDING_PERSONAL = gql`
  mutation FREELANCER_ONBOARDING_PERSONAL(
    $input: FreelancerOnboardingPersonal!
  ) {
    freelancerOnboardingPersonal(input: $input)
  }
`;

export const FREELANCER_ONBOARDING_PORTFOLIO = gql`
  mutation FREELANCER_ONBOARDING_PORTFOLIO(
    $input: FreelancerOnboardingPortfolio!
  ) {
    freelancerOnboardingPortfolio(input: $input)
  }
`;

export const SKIP_FREELANCER_ONBOARDING = gql`
  mutation SKIP_FREELANCER_ONBOARDING {
    skipFreelancerOnboarding
  }
`;

// Queries
export const GET_NEWEST_FREELANCERS = gql`
  query GET_NEWEST_FREELANCERS {
    freelancers(
      where: { asUser: { freelancerOnboardingStep: FINISHED } }
      orderBy: createdAt_DESC
      first: 4
    ) {
      id
      asUser {
        id
        firstName
        lastName
      }
      avatar {
        id
        url
      }
      skills
    }
  }
`;
