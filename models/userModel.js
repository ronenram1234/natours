const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have a name'],
    trim: true,
    validate: [validator.isAlpha, 'user name must only contain characters']
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email must be valid email']
  },
  photo: String,

  password: { type: String, require: true, minlength: 8 },
  passwordConfirm: {
    type: String,
    require: true
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
