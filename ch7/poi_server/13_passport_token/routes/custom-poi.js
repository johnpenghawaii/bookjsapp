var model = require('../model');
var async = require('async');

var CustomPOI = model.CustomPOI;
var router = require('express').Router({ mergeParams: true });

router.route('/')
  .post(function(req, res) {
    var data = CustomPOI.toMongo(req.body.pois[0]);
    data.userId = req.params.userId;
    var poi = new CustomPOI(data);

    poi.save(function(err, results) {
      if (!err) {
        res.report('OK', results);
      } else {
        res.report('INTERNAL');
      }
    });
  })
  .get(function(req, res) {
    CustomPOI.find({userId: req.params.userId}, function(err, results) {
      for (var i = 0; i < results.length; i++) {
        results[i] = results[i].toJObj()
      }

      var ret = {'pois': results};
      if (!err) {
        res.report('OK', ret)
      } else {
        console.error(err);
        res.report('INTERNAL');
      }
    });
  })
  .put(function(req, res) {
    // turn everything into mongo required object
    var data = [];
    for (var i = 0; i < req.body.pois.length; i++) {
      var datum = CustomPOI.toMongo(req.body.pois[i]);
      datum.userId = req.params.userId;
      data.push(datum);
    }

    async.map(data, upsert, function(err, results) {
      if (!err) {
        var ret = {};
        ret.users = results;
        res.report('OK', ret);
      } else {
        res.report(err.code);
      }
    });
  })

router.route('/:id')
  .get(function(req, res) {
    var id = req.params.id;
    CustomPOI.find({_id: id}, function(err, results) {
      if (!err) {
        var ret = {'users':[results[0].toJObj()]};
        res.report('OK', ret);
      } else {
        res.report('INTERNAL');
      }
    });
  })
  .put(function(req, res) {
    var id = req.params.id;
    var data = CustomPOI.toMongo(req.body.pois[0]);
    data._id = id;
    upsert(data, function(err, result) {
      if (!err) res.report('OK', result);
      else res.report(err.code);
    });
  })
  .delete(function(req, res) {
    var id = req.params.id;
    CustomPOI.remove({_id: id}, function(err, result) {
      if (!err && result === 1) res.report('OK');
      else if (result === 0) {
        res.report('ID_MISSING');
      }
      else {
        console.error(err);
        res.report(err.code);
      }
    });
  });

function upsert(data, callback) {
  if (data._id === undefined) {
    var err = new Error('ID is not defined');
    err.code = 'ID_MISSING';
    callback(err, null);
    return;
  }

  CustomPOI.findOneAndUpdate({_id:data._id}, data, {upsert:true}, function (err, result) {
    if (err) {
      console.error('err:', err);
      console.error(err.stack);
    }
    else callback(null, result.toJObj());
  });
}

module.exports = router;
