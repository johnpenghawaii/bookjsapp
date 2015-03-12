var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var morgan = require('morgan');
var bodyParser = require('body-parser')

// --- other middleware ---
app.use(morgan('short'));
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));

// --- routing ---
var router1 = express.Router();
router1.route('/')
  .get(function(req, res) {
    res.type('text/plain');
    res.end('Hello router!');
  })
  .post(function(req, res) {
    res.type('text/plain');
    console.log('Hello, your favorite food is ', req.body);
    res.end('Hello, your favorite food is ' + req.body.food);
  });
app.use('/', router1);

var router2 = express.Router();
router2.get('/:year/:month/:day/', function(req, res) {
  res.type('text/plain');
  res.end('Accessing blog ' + req.params.year
             + '/' + req.params.month
             + '/' + req.params.day);
});
router2.get('/', function(req, res) {
  res.type('text/plain');
  res.end('Accessing blog ' + req.query.year
             + '/' + req.query.month
             + '/' + req.query.day);
});

app.use('/blog', router2);

// --- server ---
var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});
