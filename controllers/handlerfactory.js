const catchAsyncError = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures')

exports.getOne = (Model, popOptions) => catchAsyncError(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const document = await query;

    // const document = await Model.findById(req.params.id).populate('reviews');

    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: document
        }
    });

});


exports.deleteOne = Model => catchAsyncError(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.createOne = Model => catchAsyncError(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: newDocument
        }
    });
});

exports.updateOne = Model => catchAsyncError(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!document) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            document
        }
    });

});

exports.getAll = Model => catchAsyncError(async (req, res, next) => {

    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId }; // To get all reviews of a particular tour

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const document = await features.query;

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: document.length,
        data: {
            data: document
        }
    });

});