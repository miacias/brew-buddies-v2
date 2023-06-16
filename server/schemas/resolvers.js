const { AuthenticationError } = require('apollo-server-express');
const { User, Review } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // shows all users with attached reviews
    users: async () => {
      try {
        const allUsers = await User.find().populate(['reviews', 'friends']);
        return allUsers;
      } catch (err) {
        console.error(err);
      }
    },
    // shows specific user with attached reviews
    user: async (parent, { username }) => {
      try {
        const oneUser = await User.findOne({ username }).populate([
          'reviews',
          'friends',
        ]);
        return oneUser;
      } catch (err) {
        console.error(err);
      }
    },
    // shows specific user who is logged in currently with attached reviews
    me: async (parent, args, context) => {
      try {
        if (context.user) {
          const me = await User.findOne({ _id: context.user._id }).populate([
            'reviews',
            'friends',
          ]);
          return me;
        }
        throw new AuthenticationError('Please log in.');
      } catch (err) {
        console.error(err);
      }
    },
    // gets list of friends for one user
    getFriends: async (parent, { ids }) => {
      try {
        if (ids && ids.length) {
          const friendsList = await User.find({ _id: { $in: ids } });
          return friendsList;
        }
        return [];
      } catch (err) {
        console.error(err);
        throw new Error('Failed to fetch friends list.');
      }
    },
    // shows all reviews from most recent first, 50 at a time
    // this is currently only used on the homepage
    allReviews: async () => {
      try {
        const fiftyReviews = await Review.find()
          .sort({ createdAt: -1 })
          .populate('author');
        return fiftyReviews;
      } catch (err) {
        console.error(err);
      }
    },

    // allReviews: async (page) => {
    //   try {
    //     const fiftyReviews = await Review.find()
    //       .sort({ createdAt: -1 })
    //       .skip(page * 50)
    //       .limit(50);
    //     return fiftyReviews;
    //   } catch (err) {
    //     console.error(err);
    //   }
    // },

    // finds all reviews for one brewery by brewery ID
    reviewsByBrewery: async (parent, { breweryId }) => {
      try {
        const reviewSet = await Review.find({
          brewery: breweryId,
        })
          .sort({ createdAt: -1 })
          .populate('author');
        return reviewSet;
      } catch (err) {
        console.error(err);
      }
    },
    // finds all reviews written by one user
    reviewsByAuthor: async (parent, { id }) => {
      try {
        const reviewSet = await Review.find({
          author: id,
        }).sort({ createdAt: -1 });
        return reviewSet;
      } catch (err) {
        console.error(err);
      }
    },
  },
  Mutation: {
    // creates new user and connects user to site
    addUser: async (
      parent,
      {
        username,
        email,
        password,
        profilePic,
        birthday,
        postalCode,
        bio,
        pronouns,
      }
    ) => {
      try {
        const newUser = await User.create({
          username,
          email,
          password,
          profilePic,
          birthday,
          postalCode,
          bio,
          pronouns,
        });
        const token = signToken(newUser);
        return { token, user: newUser };
      } catch (err) {
        console.error(err);
      }
    },
    // connects returning user to site
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with that email address.');
      }
      const passCheck = await user.isCorrectPassword(password);
      if (!passCheck) {
        throw new AuthenticationError(
          'Incorrect credentials. Please try again.'
        );
      }
      const token = signToken(user);
      return { token, user };
    },
    // allows the user to change their information
    editUser: async (parent, { input }, context) => {
      const { profilePic, postalCode, bio, pronouns } = input;
      try {
        if (context.user) {
          const editedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $set: {
                profilePic,
                postalCode,
                bio,
                pronouns,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );
          return { user: editedUser };
        }
        throw new AuthenticationError('You need to be logged in!');
      } catch (err) {
        console.error(err);
      }
    },
    // allows user to add another user as a friend
    follow: async (parent, { friendId }, context) => {
      try {
        if (context.user) {
          const newFriend = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: {
                friends: friendId,
              },
            },
            {
              new: true,
            }
          );
          return newFriend;
        }
      } catch (err) {
        console.error(err);
      }
    },
    // removes user from friends list
    unfollow: async (parent, { friendId }, context) => {
      try {
        if (context.user) {
          const removeFriend = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $pull: {
                friends: friendId,
              },
            },
            {
              new: true,
            }
          );
          return removeFriend;
        }
      } catch (err) {
        console.error(err);
      }
    },
    // adds brewery to user favorites list
    addFavBrewery: async (parent, { brewery }, context) => {
      try {
        if (context.user) {
          const newFavBrewery = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: {
                favBreweries: brewery,
              },
            },
            {
              new: true,
            }
          );
          return newFavBrewery;
        }
      } catch (err) {
        console.error(err);
      }
    },
    // removes brewery from user favorites list
    removeFavBrewery: async (parent, { brewery }, context) => {
      try {
        if (context.user) {
          const delFavBrewery = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $pull: {
                favBreweries: brewery,
              },
            },
            {
              new: true,
            }
          );
          return delFavBrewery;
        }
      } catch (err) {
        console.error(err);
      }
    },
    // adds brewery to user wish list
    addWishBrewery: async (parent, { brewery }, context) => {
      try {
        if (context.user) {
          const newWishBrewery = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: {
                wishBreweries: brewery,
              },
            },
            {
              new: true,
            }
          );
          return newWishBrewery;
        }
      } catch (err) {
        console.error(err);
      }
    },
    // removes brewery from user wish list
    removeWishBrewery: async (parent, { brewery }, context) => {
      try {
        if (context.user) {
          const delWishBrewery = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $pull: {
                wishBreweries: brewery,
              },
            },
            {
              new: true,
            }
          );
          return delWishBrewery;
        }
      } catch (err) {
        console.error(err);
      }
    },
    // adds review to User and Review models
    addReview: async (parent, { brewery, rating, text }, context) => {
      try {
        if (context.user) {
          const newReview = await Review.create({
            text,
            rating: parseInt(rating),
            author: context.user._id,
            brewery,
          });
          const newUserRev = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: {
                reviews: newReview._id,
              },
            },
            {
              new: true,
            }
          );
          return {
            review: newReview,
            author: newUserRev,
          };
        }
      } catch (err) {
        console.error(err);
      }
    },
    // allows user to modify review for a brewery
    editReview: async (
      parent,
      { reviewId, reviewText, starRating },
      context
    ) => {
      try {
        if (context.user) {
          // edits Review model
          const revEdit = await Review.findOneAndUpdate(
            { _id: reviewId },
            {
              reviewText: reviewText ? `Edited: ${reviewText}` : reviewText,
              starRating,
            },
            {
              new: true,
            }
          );
          return revEdit;
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};

module.exports = resolvers;
