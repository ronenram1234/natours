const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have a name'],
    trim: true
    // validate: [validator.isAlpha, 'user name must only contain characters']
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
    require: [true, 'please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      }
    },
    message: 'Password are not thte same!'
  }
});

userSchema.pre('save', async function(next) {
  // encrypt password to db

  if (!this.isModified('password')) return next;

  this.password = await bcrypt.hash(this.password, 12);
  // this.password =  bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
