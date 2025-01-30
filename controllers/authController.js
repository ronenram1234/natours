// @ts-nocheck
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
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

exports.protect = catchAsync((req, res, next) => {

// getting token and check of it's there

// verfication tiken

// check i fuser still exists


// check if user changed password after the tooken was issued

  next();
});
