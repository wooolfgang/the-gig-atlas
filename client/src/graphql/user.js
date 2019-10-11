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
