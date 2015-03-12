var express = require('express');
var app = express();

var userRouter = express.Router();
// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
//var itemRouter = express.Router({mergeParams: true});
var itemRouter = express.Router();

// you can nest routers by attaching them as middle where:
userRouter.use('/:userId/items', itemRouter);

userRouter.route('/')
    .get(function (req, res) {
        res.status(200)
            .send('hello user');
    });

userRouter.route('/:userId')
    .get(function (req, res) {
        res.status(200)
            .send('hello user ' + req.params.userId);
    });

itemRouter.route('/')
    .get(function (req, res) {
        res.status(200)
            .send('hello item from user ' + req.params.userId);
    });

itemRouter.route('/:itemId')
    .get(function (req, res) {
        res.status(200)
            .send('hello item ' + req.params.itemId + ' from user ' + req.params.userId);
    });

//app.use('/user', userRouter);
app.use('/user/:userId/items', itemRouter);

app.listen(8080);
