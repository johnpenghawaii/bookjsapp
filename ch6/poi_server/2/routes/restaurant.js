var model = require('../model');
var Restaurant = model.Restaurant;

var router = require('express').Router();

router.route('/')
  .get(function(req, res) { // get all records
    Restaurant.find({}, function(err, results) {
      for (var i = 0; i < results.length; i++) {
        results[i] = results[i].toJObj()
      }
      var ret = {'code': '200', 'message': 'OK', 'payload': {}};
      ret['payload']['restaurants'] = results;
      res.json(ret);
    });
  })

router.route('/:id')
  .get(function(req, res) {
    var id = parseInt(req.params.id);
    Restaurant.find({_id: id}, function(err, results) {
      for (var i = 0; i < results.length; i++) {
        results[i] = results[i].toJObj()
      }
      var ret = {'code': '200', 'message': 'OK', 'payload': {}};
      ret['payload']['restaurants'] = results;
      res.json(ret);
    });
  });

module.exports = router;
