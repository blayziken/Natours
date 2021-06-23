const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = id => {
    //JWT.SIGN({PAYLOAD}, SECRET_KEY, )
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsyncError(async (req, res, next) => {
    // const newUser = await User.create(req.body);  Security flaw, anybody can sign up with admin rights\

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);


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

    //(a) Check if user exists
    const user = await User.findOne({ email: email }).select('+password');
    //We can write this line with ES6 as User.findOne({email})
    //Since the password is hidden with select:false, to get the password from the findOne, we use the select() to select a field from the DB

    if (!user || !await user.correctPassword(password, user.password)) {
        // if (!user || checkIfPasswordIsCorrect == false)
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything is ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });

};