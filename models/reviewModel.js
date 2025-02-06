const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      maxlength: [250, 'reqview can be up to 250 letters'],
      required: [true, 'review can not be empty']
    },
    rating: {
      type: Number,
      // required: [true, 'Please selet rating'],
      min: 1,
      max: 5
    },
    cratedAt: {
      type: Date,
      deafault: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review should belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review should belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
