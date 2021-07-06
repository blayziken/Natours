const crypto = require('crypto')
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
    //JWT.SIGN({PAYLOAD}, SECRET_KEY, )
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // 90 DAYS TO HOURS (24) TO MINUTES (60) TO SECONDS (60) TO MILLISECONDS(1000)
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);


    //Remove password from POSTMAN output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

exports.signup = catchAsyncError(async (req, res, next) => {
    // const newUser = await User.create(req.body);  Security flaw, anybody can sign up with admin rights\

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        // role
    });

    // const token = signToken(newUser._id);

    // res.status('201').json({
    //     status: 'Created',
    //     token,
    //     data: {
    //         user: newUser
    //     }
    // });
    createSendToken(newUser, 201, res);

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
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
    createSendToken(user, 200, res);

};

exports.protect = async (req, res, next) => {
    //1) GET TOKEN AND CHECK IF IT ACTUALLY EXISTS
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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
// .........................................................................

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    // 1) Get User based on the email sent in the POST REQUEST
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with this email address'), 404);
    }

    // 2) GENERATE A RANDOM RESET TOKEN
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }) // Save document so 'this.passwordResetExpires' can be updated

    // 3) SEND IT TO USER'S EMAIL
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (only valid for 10 mins)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        // Save document so 'this.passwordResetToken' and 'this.passwordResetExpires' can be updated:
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email, try again later'), 500);
    }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user

    // 4) Log the user in, send JWT
    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: 'success',
    //     token
    // });
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    // 1) Get user from the collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};
