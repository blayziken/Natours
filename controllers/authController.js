const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.signup = catchAsyncError(async (req, res, next) => {
    // const newUser = await User.create(req.body);  Security flaw, anybody can sign up with admin rights\

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    //JWT.SIGN({PAYLOAD}, SECRET_KEY, )
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });


    res.status('201').json({
        status: 'Created',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email: email }).select('+password');
    //We can write this line with ES6 as User.findOne({email})

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

};