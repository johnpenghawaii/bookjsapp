var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var morgan = require('morgan');

// --- other middleware ---
app.use(morgan('short'));
app.use(express.static(__dirname));

// --- routing ---
app.get('/', function(req, res) {
  res.type('text/plain');
  res.end('Hello router!');
});

app.get('/system/kernel', function(req, res) {
  res.type('text/plain');
  res.end("You are in system/kernel");
});

app.get('/system/v', function(req, res) {
  res.type('text/plain');
  res.end("You are in system/v");
});

// --- server ---
var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});
