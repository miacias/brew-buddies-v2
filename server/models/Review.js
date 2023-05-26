const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const brewerySchema = require('./Brewery');

const reviewSchema = new Schema({
  text: {
    type: String,
    required: false,
    minLength: 1,
    maxLength: 280,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
  brewery: {
    type: brewerySchema,
  },
});

const Review = model('Review', reviewSchema);

module.exports = Review;
