import { gql } from '@apollo/client';

export const QUERY_TAGS = gql`
    {
        tags {
            _id
            name
        }
    }
`;

export const QUERY_ALL_PRODUCTS = gql`
    {
        products {
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

export const QUERY_PRODUCT_BY_TAG = gql`
    query productsByTag($tagId: ID!) {
        productsByTag(tagId: $tagId) {
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

export const QUERY_SINGLE_PRODUCT = gql`
    query singleProduct($productId: ID!) {
        product(_id: $productId) {
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