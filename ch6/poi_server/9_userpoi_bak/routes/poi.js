var model = require('../model');
var async = require('async');
var report = require('../report');

module.exports = function (modelName, keyName) {
  var MModel = model[modelName];

  var router = require('express').Router();

  router.route('/')
    .get(function(req, res) { // get all records
      MModel.find({}, function(err, results) {
        for (var i = 0; i < results.length; i++) {
          results[i] = results[i].toJObj()
        }
        res.end(report('OK', results));
      });
    })
    .put(function(req, res) { // get one record
      // turn everything into mongo required object
      var data = [];
      for (var i = 0; i < req.body[keyName].length; i++) {
        data.push(MModel.toMongo(req.body[keyName][i]));
      }

      async.map(data, upsert, function(err, results) {
        res.end(report('OK', results));
      });
    })
    .delete(function(req, res) {
      async.map(req.body[keyName],
        function (id, callback) {
          MModel.remove(id, function(err, result) {
            callback(null, result);
          });
        },
        function (err, results) {
          if (!err) res.end(report('OK'));
        });
    });

  router.route('/:id')
    .get(function(req, res) { // get one record
      var id = parseInt(req.params.id);
      MModel.find({_id: id}, function(err, results) {
        for (var i = 0; i < results.length; i++) {
          results[i] = results[i].toJObj()
        }
        res.end(report('OK', results));
      });
    })
    .put(function(req, res) { //update or insert new one
      var data = MModel.toMongo(req.body[keyName][0]);
      upsert(data, function(err, result) {
        res.end(report('OK', results));
      });
    })
    .delete(function(req, res) {
      var id = parseInt(req.params.id);
      MModel.remove({_id: id}, function(err, result) {
        if (!err) res.end(report('OK'));
      });
    });

  function upsert(data, callback) {
    MModel.findOneAndUpdate({_id:data._id}, data, {upsert:true}, function (err, result) {
      if (err) console.error('err:', err);
      else callback(null, result.toJObj());
    });
  }

  return router;
}
