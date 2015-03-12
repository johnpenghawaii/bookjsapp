var passport = require('passport');
module.exports = function (req, res, next)  {
  passport.authenticate('basic', { session: false }, function(err, user, info) {
	if (err) { return next(err); }
	if (!user) { return res.report('UNAUTHORIZED'); }
	req.user = user;
	next();
  })(req, res, next);
};