var UserPOI = require('../model').UserPOI;
var async = require('async');
var report = require('../report');

var router = require('express').Router();

router.route('/')
  .post(function(req, res) {
    console.log('here in the right place', req.params.userID);
    var data = UserPOI.toMongo(req.body['pois'][0]);
    console.log(data);
    var poi = new UserPOI(data);
    console.log(poi);
    poi.save(function (err, result) {
      if (!err) res.end(report('OK', result));
      else {
        console.error(err);
        res.end(report('INTERNAL', result));
      }
    });
  })
  .get(function(req, res) { // get all records
    console.log(req.params.userID);
    UserPOI.find({userID: req.params.userID}, function(err, results) {
      if (!err) {
        if (results.length == 0) { // not found
          res.end(report('NOT_FOUND'));
        }
        for (var i = 0; i < results.length; i++) {
          results[i] = results[i].toJObj()
        }
        res.end(report('OK', results));
      } else {
        res.end(report('INTERNAL', results));
      }
    });
  })
  .put(function(req, res) { // get one record
    // turn everything into mongo required object
    var data = [];
    for (var i = 0; i < req.body['pois'].length; i++) {
      data.push(UserPOI.toMongo(req.body['pois'][i]));
    }

    async.map(data, upsert, function(err, results) {
      res.end(report('OK', results));
    });
  })

router.route('/:id')
  .get(function(req, res) { // get one record
    var id = parseInt(req.params.id);
    UserPOI.find({_id: id}, function(err, results) {
      for (var i = 0; i < results.length; i++) {
        results[i] = results[i].toJObj()
      }
      res.end(report('OK', results));
    });
  })
  .put(function(req, res) { //update or insert new one
    var data = UserPOI.toMongo(req.body['pois'][0]);
    upsert(data, function(err, result) {
      res.end(report('OK', results));
    });
  })
  .delete(function(req, res) {
    var id = parseInt(req.params.id);
    UserPOI.remove({_id: id}, function(err, result) {
      if (!err) res.end(report('OK'));
    });
  });

function upsert(data, callback) {
  UserPOI.findOneAndUpdate({_id:data._id}, data, {upsert:true}, function (err, result) {
    if (err) console.error('err:', err);
    else callback(null, result.toJObj());
  });
}

module.exports = router;
