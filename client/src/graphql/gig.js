import { gql } from 'apollo-boost';

export const GET_CLIENT_INFO = gql`
  {
    employerData @client {
      displayName
      website
      introduction
      email
      employerType
      avatarFileId
    }
  }
`;

export const GET_GIG_DETAILS = gql`
  {
    gigData @client {
      title
      description
      technologies
      projectType
      paymentType
      minFee
      maxFee
      jobType
      locationRestriction
      communicationType
      communicationEmail
      communicationWebsite
    }
  }
`;

export const CREATE_GIG = gql`
  mutation CREATE_GIG($gig: GigInput!, $employer: EmployerInput!) {
    createGig(gig: $gig, employer: $employer) {
      id
    }
  }
`;
