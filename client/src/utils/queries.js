import { gql } from '@apollo/client';

export const GET_ME = gql`
    query Me {
        me {
        _id
        birthday
        email
        favBreweries
        followsCount
        friends {
            _id
        }
        bio
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
    query allUsers {
        users {
            _id
            username
            email
            password
            birthday
            followsCount
            bio
            postalCode
            profilePic
            pronouns
            favBreweries
            wishBreweries
            reviewCount
        }
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
        followsCount
        bio
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

export const GET_FRIENDS = gql`
    query getFriends($ids: [ID!]!) {
        getFriends(ids: $ids) {
        _id
        profilePic
        username
        reviewCount
        bio
        }
    }
`;

export const ALL_REVIEWS = gql`
    query allReviews {
        allReviews {
            _id
            text
            rating
            author {
                _id
                username
                pronouns
                profilePic
                reviewCount
            }
            createdAt
            updatedAt
            brewery
        }
    }
`;

export const BREWERY_REVIEWS = gql`
    query Review($breweryId: String) {
        reviewsByBrewery(breweryId: $breweryId) {
            _id
            text
            rating
            author {
                _id
                username
                pronouns
                profilePic
                reviewCount
            }
            createdAt
            updatedAt
            brewery
        }
    }
`;

export const REVIEWS_BY_USER = gql`
    query Query($id: ID!) {
        reviewsByAuthor(id: $id) {
            _id
            brewery
            createdAt
            rating
            text
            updatedAt
        }
    }
`;