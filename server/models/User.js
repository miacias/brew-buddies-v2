const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const brewerySchema = require('./Brewery');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address.'],
    },
    password: {
      type: String,
      required: true,
      min: [8, 'must be at least 8 characters'],
      max: [25, 'must be less than 25 characters'],
    },
    postalCode: {
      type: Number,
      required: false,
      trim: true,
    },
    pronouns: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    intro: {
      type: String,
      required: false,
      minlength: 0,
      maxlength: 250,
      trim: true,
    },
    birthday: {
      type: String,
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    favBreweries: [brewerySchema],
    wishBreweries: [brewerySchema],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

userSchema.virtual('reviewCount').get(function () {
  return this.reviews.length;
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
