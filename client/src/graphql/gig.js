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
      }
      media {
        id
        url
      }
    }
  }
`;

export const GET_GIGS = gql`
  query GET_GIGS(
    $where: GigWhereInput
    $orderBy: GigOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    gigs(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
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
        displayName
      }
      media {
        id
        url
      }
    }
  }
`;

export const GIG_SEARCH = gql`
  query GIG_SEARCH(
    $search: String!
    $where: GigWhereInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    searchGigs(
      search: $search
      where: $where
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
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
        displayName
      }
      media {
        id
        url
      }
    }
  }
`;
