const { AuthenticationError } = require('apollo-server-express');
const { User, Review } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // shows all users with attached reviews
    users: async () => User.find().populate(['reviews', 'friends']),
    // shows specific user with attached reviews
    user: async (parent, { username }) =>
      User.findOne({ username }).populate(['reviews', 'friends']),
    // shows specific user who is logged in currently with attached reviews
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate([
          'reviews',
          'friends',
        ]);
      }
      throw new AuthenticationError('Please log in.');
    },
    // shows all reviews from most recent first, 50 at a time
    allReviews: async (page) =>
      Review.find()
        .sort({ createdAt: -1 })
        .skip(page * 50)
        .limit(50),
    // finds all reviews for one brewery by brewery ID
    review: async (parent, { breweryId }) => {
      const reviewSet = await Review.find({
        breweryId,
      }).sort({ createdAt: -1 });
      return reviewSet;
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
        intro,
        pronouns,
      }
    ) => {
      const newUser = await User.create({
        username,
        email,
        password,
        profilePic,
        birthday,
        postalCode,
        intro,
        pronouns,
      });
      const token = signToken(newUser);
      return { token, user: newUser };
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
      const { profilePic, postalCode, intro, pronouns } = input;
      if (context.user) {
        const editedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $set: {
              profilePic,
              postalCode,
              intro,
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
    },
    // adds brewery to user favorites list
    addFavBrewery: async (parent, { breweryId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              favBreweries: breweryId,
            },
          },
          {
            new: true,
          }
        );
      }
    },
    // removes brewery from user favorites list
    removeFavBrewery: async (parent, { breweryId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              favBreweries: breweryId,
            },
          }
        );
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
    // allows user to change review for a brewery
    editReview: async (
      parent,
      { reviewId, reviewText, starRating },
      context
    ) => {
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
    },
    // allows user to add another user as a friend
    addFriend: async (parent, { friendId }, context) => {
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
        return {
          newFriend,
        };
      }
    },
    // removes user from friends list
    removeFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
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
      }
    },
  },
};

module.exports = resolvers;
