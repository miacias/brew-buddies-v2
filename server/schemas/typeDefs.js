const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    birthday: String!
    profilePic: String
    postalCode: String
    bio: String
    pronouns: String
    reviews: [Review]
    reviewCount: Int
    favBreweries: [String]
    wishBreweries: [String]
    friends: [User]
    friendCount: Int
  }

  input UpdateUser {
    _id: ID
    profilePic: String
    postalCode: String
    bio: String
    pronouns: String
  }

  type Brewery {
    breweryId: String!
  }

  type Review {
    _id: ID
    createdAt: String
    author: User
    text: String
    rating: Int!
    brewery: String!
  }

  type ReviewCard {
    review: Review
    author: User
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String): User
    me: User
    allReviews(page: Int): [Review]
    reviewsByBrewery(breweryId: String): [Review]
  }

  type Mutation {
    addUser(
      username: String!
      email: String!
      password: String!
      profilePic: String
      birthday: String!
      postalCode: String
      bio: String
      pronouns: String
    ): Auth
    login(email: String!, password: String!): Auth
    editUser(input: UpdateUser!): Auth
    addReview(text: String, rating: Int!, brewery: String): ReviewCard
    editReview(
      reviewId: ID!
      text: String
      rating: String!
      brewery: String
    ): Review
    addFriend(friendId: ID!): User
    removeFriend(friendId: ID!): User
    addFavBrewery(brewery: String!): User
    removeFavBrewery(brewery: String!): User
    addWishBrewery(brewery: String!): User
    removeWishBrewery(brewery: String!): User
  }
`;

module.exports = typeDefs;
