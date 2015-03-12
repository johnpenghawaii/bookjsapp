module.exports = function (req, res, next) {
  res.type('application/json');
  next();
}
