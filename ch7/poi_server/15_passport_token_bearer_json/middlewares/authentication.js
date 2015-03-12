var passport = require('passport');

module.exports = function(strategy, errReport) {
  return function (req, res, next)  {
    passport.authenticate(strategy, { session: false }, function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.report(errReport); }
      req.user = user;
      next();
    })(req, res, next);
  };
};
