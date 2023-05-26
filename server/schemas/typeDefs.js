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
    intro: String
    pronouns: String
    reviews: [Review]
    favBreweries: [Brewery]
    wishBreweries: [Brewery]
    friends: [User]
    friendCount: Int
  }

  input UpdateUser {
    _id: ID
    profilePic: String
    postalCode: String
    intro: String
    pronouns: String
  }

  type Brewery {
    breweryId: String!
    avgRating: Int
    reviewCount: Int
  }

  type Review {
    _id: ID
    reviewText: String
    starRating: String!
    createdAt: String
    author: User
    brewery: Brewery
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String): User
    me: User
    breweries: [Brewery]
    brewery(breweryId: String): Brewery
    reviews: [Review]
    breweryReviews(breweryId: String): [Review]
  }

  type Mutation {
    addUser(
      username: String!
      email: String!
      password: String!
      profilePic: String
      birthday: String!
      postalCode: String
      intro: String
      pronouns: String
    ): Auth
    login(email: String!, password: String!): Auth
    editUser(input: UpdateUser!): Auth
    addReview(reviewText: String, starRating: String!, brewery: String): Auth
    editReview(
      reviewId: ID!
      reviewText: String
      starRating: String!
      brewery: String
    ): Review
    addFriend(friendId: ID!): User
    removeFriend(friendId: ID!): User
    addFavBrewery(brewery: String!): User
    removeFavBrewery(brewery: String!): User
    # addWishBrewery(brewery: Brewery!)
    # removeWishBrewery(brewery: Brewery!)
  }
`;

module.exports = typeDefs;
