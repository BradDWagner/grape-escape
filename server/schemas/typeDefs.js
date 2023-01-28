const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        firstName: String
        lastName: String
        email: String
        orders: [Order]
    }

    type Order {
        _id: ID
        purchaseDate: String
        products: [Product]
    }

    type Product {
        _id: ID
        name: String
        description: String
        image: String
        price: Number
        tags: [Tag]
        reviews: [Review]
    }

    type Tag {
        _id: ID
        name: String
        products: [Product]
    }

    type Review {
        _id: ID
        comment: String
        likes: Int
    }

    type Checkout {
        session: ID
    }

    type Auth {
        token: ID
        user: User
    }

    type Query {
        tags: [Tag]
        products: [Product]
        productsByTag(tag: String!): [Product]
        product(_id: ID!): Product
        user: User
        order(_id: ID!): Order
        checkout(products: [ID]!): Checkout
    }

    type Mutation {
        addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
        addOrder(products: [ID]!): Order
        updateUser(firstName: String, lastName: String, email: String, password: String): User
        login(email: String!, password: String!): Auth
        addComment(_id: ID!, comment: String!): Product
        likeReview(_id: ID!): Review
    }
`;

module.exports = typeDefs;