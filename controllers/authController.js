// @ts-nocheck
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
// const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log('signup');
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        // user: newUser
        name: req.body.name,
        email: req.body.email
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong'
    });
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //  check email and password exisit
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // check if the user exist && password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // check if every is ok and send message
  const token = signToken(user._id);

  res.status(200).json({
    status: 'sucess',
    token
  });
});

exports.restrictTo = catchAsync(async (req, res, next) => {
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  let decoded;
  let token;
  let freshUser;

  try {
    // console.log(req.headers)
    // getting token and check of it's there
    if (
      req.headers.autorization &&
      req.headers.autorization.startsWith('Bearer')
    ) {
      token = req.headers.autorization.split(' ')[1];
    }
    console.log(token);
    if (!token) {
      return next(
        new AppError(
          'You are not logged in! Please log in to get access⛔',
          401
        )
      );
    }

    // token verfication
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // check if user still exists
    freshUser = await User.findById(decoded.id);
    //     console.log(freshUser);
    if (!freshUser) {
      return next(new AppError('user does not exist ⛔', 401));
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    // check if user changed password after the tooken was issued
  } catch (err) {
    console.log('error in protect function');

    if (!decoded) {
      return next(new AppError('Token decode failed⛔', 401));
    }
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not hav permission to perform the action', 403)
      );
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user best of posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Therer  is no user with email address.', 404));
  }
  // generate token
  const restToken = user.createPasswordResetToken();
  await user.save({ valiteBeforeSave: false });
  // send back email
  const resetURL = `${req.protocol}://${req.get('host' )}/api/v1/user/resetPassword/${restToken}`;

  const message = `Forgot your password? Submit a Patch request wiith your new password and passwordConfirm to ${resetURL}.\n If you didn;t forget your pasword, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your passeord reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
    // console.log('end forgotPassword');
    // next();
  } catch (err) {
    console.log('err', err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ valiteBeforeSave: false });
    console.log('after user.save');
    return next(
      new AppError('There was an error sending th eemail. Try again later'),
      500
    );
  }
});



exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  console.log("start resetPasword")
  const hashedToken = (this.PasswordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex'));
console.log('-----------------')
console.log(`findOne({
  passwordResetToken: ${hashedToken},
  passwordResetExpires: { $gt: ${Date.now()} }})`)
  console.log('-----------------')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  // If token had exoired and ther is user set the new password
  if (!user) {
    return next(new AppError('Token is invalid or had expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  console.log("end  resetPasword")
  const token=signToken(user._id)
  res.status(200).json({
    status: 'success',
    message: 'Token sent to email'
  });
});

