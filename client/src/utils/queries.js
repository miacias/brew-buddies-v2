import { gql } from '@apollo/client';

export const GET_ME = gql`
    query Me {
        me {
        _id
        birthday
        email
        favBreweries
        friendCount
        friends {
            _id
        }
        intro
        password
        postalCode
        profilePic
        pronouns
        reviewCount
        reviews {
            _id
        }
        username
        wishBreweries
        }
    }
`;


export const ALL_USERS = gql`
    users {
        _id
        username
        email
        password
        birthday
        friendCount
        intro
        postalCode
        profilePic
        pronouns
        favBreweries
        wishBreweries
        reviewCount
    }
`;

export const GET_USER = gql`
    query oneUser($username: String) {
        user(username: $username) {
        _id
        username
        email
        password
        birthday
        friendCount
        intro
        postalCode
        profilePic
        pronouns
        favBreweries
        reviewCount
        wishBreweries
        friends {
            _id
        }
        reviews {
            _id
        }
        }
    }
`;

export const ALL_REVIEWS = gql`
    query allReviews {
        reviews {
            _id
            reviewText
            starRating
            reviewAuthor
            createdAt
            breweryId
        }
    }
`;

export const BREWERY_REVIEW = gql`
    query Review($breweryId: String) {
        review(breweryId: $breweryId) {
            _id
            reviewAuthor
            createdAt
            reviewText
            starRating
        }
    }
`;