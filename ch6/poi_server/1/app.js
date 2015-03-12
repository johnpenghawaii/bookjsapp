var express = require('express');
var app = express();
var http = require('http');
var contentType = require('./middlewares/content-type');

// --- middleware ---
app.use(contentType);

// --- variables ---
app.set('json spaces', 2);

// --- routing ---
var restaurantRouter = require('./routes/restaurant');

app.use('/v1/restaurants', restaurantRouter);

// --- server ---
var port = process.env.PORT || 8080;
var server = http.createServer(app).listen(port, function() {
    console.log(server.address().port);
});
