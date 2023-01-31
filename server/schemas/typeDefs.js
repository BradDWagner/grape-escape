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
        items: [Item]
    }

    type Item {
        _id: ID
        name: String
        description: String
        image: String
        price: Float
        tags: [Tag]
        reviews: [Review]
    }

    type Tag {
        _id: ID
        name: String
        items: [Item]
    }

    type Review {
        _id: ID
        comment: String
        user: User
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
        items: [Item]
        itemsByTag(_id: ID!): [Item]
        item(_id: ID!): Item
        user: User
        order(_id: ID!): Order
        checkout(items: [ID]!): Checkout
    }

    type Mutation {
        addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
        addOrder(items: [ID]!): Order
        updateUser(firstName: String, lastName: String, email: String, password: String): User
        login(email: String!, password: String!): Auth
        addComment(_id: ID!, comment: String!): Item
        likeReview(_id: ID!): Review
    }
`;

module.exports = typeDefs;