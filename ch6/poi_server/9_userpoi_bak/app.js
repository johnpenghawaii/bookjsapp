var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var contentType = require('./middlewares/content-type');
var report = require('./report');
require('./utils');

// --- middleware ---
app.use(contentType);
app.use(bodyParser.json());

// --- variables ---
app.set('json spaces', 2);

// --- routes ---
var poi = require('./routes/poi');
var user = require('./routes/user');
var userPoi = require('./routes/user_poi');
var query = require('./routes/query');

app.use('/v1/restaurants', poi('Restaurant', 'restaurants'));
app.use('/v1/parking', poi('Parking', 'parking'));
app.use('/v1/users', user);
app.use('/v1/query', query);

app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError) {
    res.end(report('SYNTAX'));
  } else { // something else
    console.error(err);
    res.end(report('INTERNAL'));
  }
});

// --- server ---
var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});
