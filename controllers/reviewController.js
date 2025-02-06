const Review = require('./../models/reviewModel');
const apiFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  console.log('getAllReviews');
  const reviews = await Review.find();
  res.status(200).json({
    stats: 'sucess',
    result: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  console.log('createReview');
  console.log(req.body);
  const newReview = await Review.create(req.body);
  console.log(newReview);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});
