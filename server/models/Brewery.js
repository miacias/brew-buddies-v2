const { Schema } = require('mongoose');

const brewerySchema = new Schema(
  {
    breweryId: {
      // Pull ID from API call
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

brewerySchema.virtual('avgRating').get(function () {
  if (this.reviews.length) {
    let ratingSum = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.reviews.length; i++) {
      ratingSum += this.reviews[i].starRating;
    }
    return (ratingSum / this.reviews.length).toFixed(1);
  }
  return null;
});

brewerySchema.virtual('reviewCount').get(function () {
  return this.reviews.length;
});

// const Brewery = model('Brewery', brewerySchema);

module.exports = brewerySchema;
