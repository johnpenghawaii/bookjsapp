var msg = {
  'OK': {'msg': 'OK', 'http_code': 200},
  'INTERNAL': {'msg': 'Internal server error', 'http_code': 500}, // most general
  'SYNTAX': {'msg': 'JSON syntax error', 'http_code': 400},
  '404': {'msg': '404 not found', 'http_code': 404} // for any unreachable url
}

function report(code, payload) {
  var rep = {};
  rep.code = msg[code].http_code;
  rep.message = msg[code].msg;

  if (payload !== undefined) rep.payload = payload;

  this.type('application/json');
  this.status(rep.code).json(rep);
}

module.exports = function (req, res, next) {
  res.report = report;
  next();
}
