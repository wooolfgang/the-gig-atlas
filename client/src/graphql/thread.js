import { gql } from 'apollo-boost';

export const CREATE_THREAD = gql`
  mutation CREATE_THREAD($input: ThreadInput!) {
    createThread(input: $input) {
      id
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CREATE_COMMENT($input: CommentInput!) {
    createComment(input: $input) {
      id
      text
      postedBy {
        id
        firstName
        avatar {
          id
          url
        }
      }
    }
  }
`;

export const GET_THREADS = gql`
  query GET_THREADS(
    $where: ThreadWhereInput
    $orderBy: ThreadOrderByInput
    $skip: Int
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    threads(
      where: $where
      orderBy: $orderBy
      skip: $skip
      after: $after
      before: $before
      first: $first
      last: $last
    ) {
      id
      createdAt
      title
      body
      commentCount
      upvoteCount
      viewCount
      tags {
        id
        name
      }
      postedBy {
        id
        email
        firstName
      }
      posters {
        id
        firstName
        avatar {
          id
          url
        }
        asFreelancer {
          id
        }
      }
    }
  }
`;

export const GET_THREAD_TAGS = gql`
  query GET_THREAD_TAGS {
    tags(where: { category: { name: "thread" } }) {
      id
      name
      category {
        id
        name
      }
    }
  }
`;

// Discussion for rescursively nested objects on graphql ->
// https://github.com/graphql/graphql-spec/issues/91
export const GET_THREAD = gql`
  fragment CommentFields on Comment {
    id
    text
    isRoot
    parent {
      id
      text
    }
    children {
      id
      text
    }
    postedBy {
      id
      firstName
      avatar {
        id
        url
      }
    }
  }

  query GET_THREAD($where: ThreadWhereUniqueInput!) {
    thread(where: $where) {
      id
      createdAt
      updatedAt
      title
      body
      commentCount
      upvoteCount
      viewCount
      tags {
        id
        name
      }
      postedBy {
        id
        firstName
        lastName
        asFreelancer {
          id
          avatar {
            id
            url
          }
        }
      }
      commentTree {
        ...CommentFields
        children {
          ...CommentFields
          children {
            ...CommentFields
            children {
              ...CommentFields
              children {
                ...CommentFields
                children {
                  ...CommentFields
                  children {
                    ...CommentFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
