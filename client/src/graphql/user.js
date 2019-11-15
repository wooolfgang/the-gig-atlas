import { gql } from 'apollo-boost';

export const GET_USER = gql`
  query GET_USER($where: UserWhereUniqueInput!) {
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
