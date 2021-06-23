const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsync');

exports.signup = catchAsyncError(async (req, res, next) => {
    // const newUser = await User.create(req.body);  Security flaw, anybody can sign up with admin rights\

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    //JWT.SIGN({PAYLOAD}, SECRET_KEY, )
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);


    res.status('201').json({
        status: 'Created',
        data: {
            user: newUser
        }
    });
});