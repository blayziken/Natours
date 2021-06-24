const { promisify } = require('util');
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

exports.protect = async (req, res, next) => {
    //1) GET TOKEN AND CHECK IF IT ACTUALLY EXISTS
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    //2) CHECK IF TOKEN IS VALID OR NOT
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3) IF VERIFICATION IS SUCCESSFUL, CHECK IF USER STILL EXISTS
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
        );
    }

    //4) CHECK IF USER CHANGED PASSWORD AFTER TOKEN WAS ISSUED
    //To check if user recently changed password, we will create an instance method available on all documents

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    //FINALLY, IF THE CODE MAKES IT TO THIS POINT, WE GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
}



// .........................................................................
// We can't pass arguments into middleware functions 
// but we need to pass the roles who are allowed to access the resource
// i.e admin and lead guide
// 
// SOLN: Create a wrapper function which will then return the middleware
// function that we actual want to create

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }

        next();
    };
};