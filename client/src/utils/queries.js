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
            friendCount
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
        friendCount
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
            brewery
        }
    }
`;

export const BREWERY_REVIEW = gql`
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
            brewery
        }
    }
`;