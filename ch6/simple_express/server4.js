var express = require('express');
var app = express();
var http = require('http');

app.use('/log/', function(req, res, next) {
  console.log(req.url, req.socket.address().address);
  next();
});

app.use(function(req, res, next) {
  res.type('text/plain');
  res.end('Hello world');
});

var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});
