import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser(
    $username: String!
    $email: String!
    $password: String!
    $birthday: String!
    $profilePic: String
    $postalCode: String
    $bio: String
    $pronouns: String
  ) {
    addUser(
      username: $username
      email: $email
      password: $password
      birthday: $birthday
      profilePic: $profilePic
      postalCode: $postalCode
      bio: $bio
      pronouns: $pronouns
    ) {
      token
      user {
        _id
        username
        email
        password
        birthday
        bio
        postalCode
        profilePic
        pronouns
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const EDIT_USER = gql`
  mutation editUser($input: UpdateUser!) {
    editUser(input: $input) {
      user {
        _id
        birthday
        email
        followsCount
        bio
        password
        postalCode
        profilePic
        pronouns
        reviewCount
        username
      }
    }
  }
`;

export const ADD_FAV_BREWERY = gql`
  mutation addFavBrewery($brewery: String!) {
    addFavBrewery(brewery: $brewery) {
      _id
      username
      favBreweries
    }
  }
`;

export const REMOVE_FAV_BREWERY = gql`
  mutation removeFavBrewery($brewery: String!) {
    removeFavBrewery(brewery: $brewery) {
      _id
      username
      favBreweries
    }
  }
`;

export const ADD_WISH_BREWERY = gql`
  mutation AddWishBrewery($brewery: String!) {
    addWishBrewery(brewery: $brewery) {
      _id
      username
      wishBreweries
    }
  }
`;

export const REMOVE_WISH_BREWERY = gql`
  mutation RemoveWishBrewery($brewery: String!) {
    removeWishBrewery(brewery: $brewery) {
      _id
      username
      wishBreweries
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation addReview(
    $rating: Int!
    $text: String
    $brewery: String
  ) {
    addReview(
      rating: $rating
      text: $text
      brewery: $brewery
    ) { 
      author {
        _id
        username
      }
      review {
        _id
        text
        rating
        brewery
      }
    }
  }
`;

export const EDIT_REVIEW = gql`
  mutation editReview($reviewId: ID!, $rating: Int, $text: String) {
    editReview(
      reviewId: $reviewId
      rating: $rating
      text: $text
    ) {
      _id
      text
      rating
      author
      createdAt
      brewery
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation follow($friendId: ID!) {
    follow(friendId: $friendId) {
      _id
      username
      followsCount
      friends {
        _id
      }
    }
  }
`;

export const REMOVE_FRIEND = gql`
  mutation unfollow($friendId: ID!) {
    unfollow(friendId: $friendId) {
      _id
      username
      followsCount
      friends {
        _id
        username
      }
    }
  }
`;
