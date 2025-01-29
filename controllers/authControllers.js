const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = async (req, res, next) => {
  try {
    // Try to create a new user
    const newUser = await User.create(req.body);

    // If user creation is successful, send a response
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });

    // Optionally, you can call createSendToken to send a JWT or token after signup.
    // createSendToken(newUser, 201, res);
  } catch (err) {
    // If any error occurs during user creation, handle the error directly
    res.status(500).json({
      status: 'error',
      message: err.message || 'Something went wrong'
    });
  }
};

// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       user: newUser
//     }
//   });

//   // createSendToken(newUser, 201, res);
//   next();
// });
