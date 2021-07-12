const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (element) {
                return element === this.password;  //returns true or false, if false then there is a validation error
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// ENCRYPTING USER PASSWORD ON SIGN UP:
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); //If the password has not been modified, exit from this function

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field, we don't need it in the DB
    this.passwordConfirm = undefined;
    next();
});

// CHANGING DATE OF passwordChangedAt after user reset password:
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

//TO CHECK IF PASSWORD DURING SIGN-IN  IS CORRECT:
userSchema.methods.correctPassword = async function (inputPasswood, userPassword) {
    //inputPasswood is not hashed,
    //userPassword is hashed
    console.log(await bcrypt.compare(inputPasswood, userPassword));
    return await bcrypt.compare(inputPasswood, userPassword);
};

// TO CHECK IF USER CHANGED PASSWORD AFTER TOKEN WAS ISSUED
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, //divided by 1000 (milliseconds to seconds)
            10 //base 10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

// CREATING AN INSTANCE METHOD FOR THE PASSWORD RESET TOKEN
userSchema.methods.createPasswordResetToken = function () {
    // Creating token:
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Encrypting token:
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    // Expires after 10 minutes
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 * 60 (for seconds) * 1000 (for milliseconds)

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
