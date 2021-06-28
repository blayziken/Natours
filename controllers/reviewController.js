const Review = require('./../models/reviewModel');
const catchAsyncError = require('./../utils/catchAsync');

exports.getAllReviews = catchAsyncError(async (req, res, next) => {
    const reviews = await Review.find();

     // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsyncError(async (req, res, next) => {

    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview 
      }
    });

});