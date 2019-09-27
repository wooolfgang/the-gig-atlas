import { gql } from 'apollo-boost';

export const GET_IMAGE = gql`
  query GET_IMAGE($id: ID!) {
    file(id: $id) {
      id
      name
      url
    }
  }
`;

export const IMAGE_UPLOAD = gql`
  mutation IMAGE_UPLOAD($file: Upload!) {
    uploadImage(file: $file) {
      id
      name
      url
    }
  }
`;
