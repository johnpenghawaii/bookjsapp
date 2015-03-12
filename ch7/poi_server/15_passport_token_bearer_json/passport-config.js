var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('./model').User;
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = require('./model').Token;

passport.use(new BasicStrategy(
  function(email, password, done) {
    User.findOne({ email: email}, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      user.verifyPassword(password, function(err, result) {
        // result is true or false
        if (err) { done(err); }
        else if (result === true){
          done(null, user);
        } else {
          done(null, false); // user password incorrect
        }
      });
    });
  }
));

passport.use(new BearerStrategy(
  function(tokenValue, done) {
    // return the user based on token here
    Token.findByIdAndUpdate(tokenValue, {$set: {lastAccess: new Date()}}, function(err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }

      User.findById(token.userId, function(err2, user) {
        if (err2) { return done(err2); }
        if (!user) { return done(null, false); }

        return done(null, user);
      });
    });
  })
);