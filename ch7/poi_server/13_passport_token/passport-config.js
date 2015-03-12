var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('./model').User;


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