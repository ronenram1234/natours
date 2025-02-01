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

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default:'user'
  },

  password: {
    type: String,
    require: true,
    select: false,
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    require: [true, 'please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      }
    },
    message: 'Password are not thte same!'
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  // encrypt password to db

  if (!this.isModified('password')) return next;

  this.password = await bcrypt.hash(this.password, 12);
  // this.password =  bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePasseord,
  userPasseord
) {
  return await bcrypt.compare(candidatePasseord, userPasseord);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
