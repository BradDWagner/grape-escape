import { gql } from '@apollo/client';

export const QUERY_TAG = gql`
    {
        tags {
            _id
            name
        }
    }
`;

export const QUERY_ITEMS = gql`
    {
        items {
            _id
            name
            description
            image
            price
            tags {
                _id
                name
            }
        }
    }
`;

export const QUERY_ITEMS_BY_TAG = gql`
    query itemsByTag($tagId: ID!) {
        itemsByTag(tagId: $tagId) {
            _id
            name
            description
            image
            price
            tags {
                _id
                name
            }
        }
    }
`;

export const QUERY_SINGLE_ITEM = gql`
    query singleItem($itemId: ID!) {
        item(_id: $itemId) {
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

export const QUERY_USER = gql`
  {
    user {
      firstName
      lastName
      orders {
        _id
        purchaseDate
        items {
          _id
          name
          description
          price
          quantity
          image
        }
      }
    }
  }
`;

export const QUERY_CHECKOUT = gql`
  query getCheckout($items: [ID]!) {
    checkout(items: $items) {
      session
    }
  }
`;