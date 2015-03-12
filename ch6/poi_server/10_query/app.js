var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var report = require('./middlewares/report');

// --- middleware ---
app.use(report);
app.use(bodyParser.json());

// --- variables ---
app.set('json spaces', 2);

// --- routes ---
var poi = require('./routes/poi');
var user = require('./routes/user');
var customPOI = require('./routes/custom-poi');
var query = require('./routes/query');

app.use('/v1/restaurants', poi('Restaurant', 'restaurants'));
app.use('/v1/parking', poi('Parking', 'parking'));
app.use('/v1/users', user);
app.use('/v1/users/:userId/pois/', customPOI);
app.use('/v1/query', query);

// --- error handling ---
app.use(function(err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  if (err instanceof SyntaxError) {
    res.report('SYNTAX');
  } else { // something else
    res.report('INTERNAL');
  }
});

app.all('*', function(req, res) {
    res.report('404');
});

// --- server ---
var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});

server.on('error', function(err) {
  console.error(err);
  console.error(err.stack);
  process.exit(1);
});
