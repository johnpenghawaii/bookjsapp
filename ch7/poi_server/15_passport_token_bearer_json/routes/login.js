var router = require('express').Router();

var randtoken = require('rand-token');
var model = require('../model');
var Token = model.Token;

router.route('/')
  .get(function(req, res) {
    var token = Token({_id: randtoken.generate(256),
                      userId: req.user._id,
                  lastAccess: new Date()});
    token.save(function(err, result) {
      if (err) {
        console.log(err);
        console.log(err.stack);
        res.report('INTERNAL');
      }
      res.report('OK', {'users': [req.user.toJObj()], 'token': token._id});
    });
  });

module.exports = router;