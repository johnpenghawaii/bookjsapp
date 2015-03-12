var express = require('express');
var app = express();
var http = require('http');

var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});

