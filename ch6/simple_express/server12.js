var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var morgan = require('morgan');

// --- other middleware ---
app.use(morgan('short'));
app.use(express.static(__dirname));

// --- routing ---
var router1 = express.Router();
router1.get('/', function(req, res) {
  res.type('text/plain');
  res.end('Hello router!');
});
app.use('/', router1);

var router2 = express.Router();
router2.get('/:year/:month/:day/', function(req, res) {
  res.type('text/plain');
  res.end('Accessing blog ' + req.params.year
             + '/' + req.params.month
             + '/' + req.params.day);
});
app.use('/blog', router2);

// --- server ---
var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});
