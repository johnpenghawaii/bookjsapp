// 500 Internal Error
// 400 Bad Request
var msg = {
  'OK': {'msg': 'OK', 'http_code': 200},
  'INTERNAL': {'msg': 'Internal server error', 'http_code': 500}, // most general
  'USER_EXISTS': {'msg': 'User already exists', 'http_code': 400},
  'ID_MISSING': {'msg': 'ID missing', 'http_code': 400},
  'NOT_FOUND': {'msg': 'Not found', 'http_code': 400}, // for anything not found
  'SYNTAX': {'msg': 'JSON syntax error', 'http_code': 400}
}

function report(code, payload) {
  var rep = {};
  rep.code = msg[code].http_code;
  rep.message = msg[code].msg;

  if (payload !== undefined) rep.payload = payload;

  return rep;
}

module.exports = report;
