const Review = require('./../models/reviewModel');
const catchAsyncError = require('./../utils/catchAsync');
const factory = require('./handlerfactory');

exports.createReview = catchAsyncError(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });

});

// exports.getAllReviews = catchAsyncError(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId }; // To get all reviews of a particular tour

//   const reviews = await Review.find(filter);

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews
//     }
//   });
// });

// GET ALL REVIEWS
exports.getAllReviews = factory.getAll(Review);

// GET A REVIEW
exports.getReview = factory.getOne(Review);

// UPDATE REVIEW
exports.updateReview = factory.updateOne(Review);

// DELETE REVIEW
exports.deleteReview = factory.deleteOne(Review);