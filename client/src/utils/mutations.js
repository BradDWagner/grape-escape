import { gql } from '@apollo/client';

export const LOGIN = gql`
mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder($products: [ID]!) {
    addOrder(products: $products) {
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        category {
          name
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($_id: ID!, comment: String) {
    addComment(_id: $_id, comment: $comment) {
        _id
        name
        description
        image
        price
        tags {
            _id
            name
        }
        reviews {
            comment
            likes
            user{
                _id
                firstName
                lastName
            }
        }
    }
}
`;

export const LIKE_REVIEW = gql`
    mutation likeReview($_id: ID!) {
        likeReview(_id: $_id) {
            comment
            likes
            user {
                _id
                firstName
                lastName
            }
        }
    }
`;
