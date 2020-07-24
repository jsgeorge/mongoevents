const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//const jwt = require("jwt-simple");
const jwt = require("jsonwebtoken");
const SALT_I = 10;
const config = require("../config");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    require: true,
    minlength: 5,
  },
  username: {
    type: String,
    require: true,
    trim: true,
    unique: 1,
  },
  timezone: {
    type: String,
    trim: true,
  },
  defaultCity: {
    type: String,
  },
  defaultState: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  const expiresIn = 24 * 60 * 60;

  //var token = jwt.sign(user._id.toHexString(), SECRET_KEY);
  var token = jwt.sign(
    {
      exp: expiresIn,
      id: user.id,
    },
    config.secret
  );
  user.token = token;
  // user.save(function(err, user) {
  //   if (err) return cb(err);
  //   cb(null, user);
  // });
  User.update({ _id: user._id }, user, function (
    err,
    numberAffected,
    rawResponse
  ) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  jwt.verify(token, config.secret, function (err, decode) {
    user.findOne({ _id: decode }, function (err, user) {
      if (err) return cb(err);
      if (user) {
        let curuser = {
          email: user.email,
          timezone: user.timezone,
          defaultCity: user.defaultCity,
        };
        cb(null, curuser);
      }
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
