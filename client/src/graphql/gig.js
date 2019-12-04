import { gql } from 'apollo-boost';

/* Mutations */

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
      tags
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

/* Queries */

export const GET_GIGS_LIST_FOR_LANDING = gql`
  query GET_GIGS_LIST_FOR_LANDING {
    gigsListLanding {
      id
      title
      createdAt
      description
      tags {
        id
        name
      }
      projectType
      paymentType
      minFee
      maxFee
      jobType
      locationRestriction
      communicationType
      communicationEmail
      communicationWebsite
      employer {
        id
        avatar {
          id
          url
        }
      }
    }
  }
`;
