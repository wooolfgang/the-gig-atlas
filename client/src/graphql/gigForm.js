import { gql } from 'apollo-boost';

export const GET_CLIENT_INFO = gql`
  {
    clientInfo @client {
      firstName
      lastName
      email
      companyName
      companyDescription
      website
      communicationType
      communicationEmail
      communicationWebsite
      avatarId
    }
  }
`;

export const GET_GIG_DETAILS = gql`
  {
    gigDetails @client {
      title
      description
      projectType
      technologies
      paymentType
      minRate
      maxRate
      jobType
      locationAndTimezone
    }
  }
`;
