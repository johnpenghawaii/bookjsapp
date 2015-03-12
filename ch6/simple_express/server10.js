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
router2.get('/kernel', function(req, res) {
  res.type('text/plain');
  res.end("You are in system/kernel");
});
router2.get('/v', function(req, res) {
  res.type('text/plain');
  res.end("You are in system/v");
});
app.use('/system', router2);

// --- server ---
var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});
