const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsync');


exports.signup = catchAsyncError(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status('201').json({
        status: 'Created',
        data: {
            user: newUser
        }
    });
});