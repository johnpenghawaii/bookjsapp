var msg = {
  'OK': {'msg': 'OK', 'http_code': 200},
  'INTERNAL': {'msg': 'Internal server error', 'http_code': 500}, // most general
  'USER_EXISTS': {'msg': 'User already exists', 'http_code': 400},
  'ID_MISSING': {'msg': 'ID missing', 'http_code': 400},
  'NOT_FOUND': {'msg': 'Not found', 'http_code': 400}, // for anything not found
  'SYNTAX': {'msg': 'JSON syntax error', 'http_code': 400},
  'UNAUTHORIZED': {'msg': 'Unauthorized. Please log in with the correct email and password', 'http_code': 401},
  '404': {'msg': '404 not found', 'http_code': 404} // for any unreachable url
}

function report(code, payload) {
  var rep = {};
  rep.code = msg[code].http_code;
  rep.message = msg[code].msg;

  if (payload !== undefined) rep.payload = payload;

  //this.set('Access-Control-Allow-Origin', '*');
  this.type('application/json');
  this.status(rep.code).json(rep);
}

module.exports = function (req, res, next) {
  res.report = report;
  next();
}
