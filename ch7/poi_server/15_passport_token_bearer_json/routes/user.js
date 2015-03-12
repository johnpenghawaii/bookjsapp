var model = require('../model');
var async = require('async');

var User = model.User;
var router = require('express').Router();

router.route('/')
  .post(function(req, res) {
    var data = User.toMongo(req.body.users[0]);
    var user = new User(data);
    saveIfNewEmail(user, function(err, result) {
      if (!err) {
        var ret = {'users': [result.toJObj()]};
        res.report('OK', ret);
      } else {
        console.error(err);
        res.report(err.code);
      }
    });
  })
  .get(function(req, res) {
    User.find({}, function (err, results) {
      for (var i = 0; i < results.length; i++) {
        results[i] = results[i].toJObj()
      }

      var ret = {'users': results};
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
      for (var i = 0; i < req.body.users.length; i++) {
        data.push(User.toMongo(req.body.users[i]));
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
  .delete(function(req, res) { // message body {"users":[id1, id2, ...]}
    async.map(req.body.users,
      function (id, callback) {
        User.remove({_id:id}, function(err, result) {
          if (!err) {
            if (result !== 0) callback(null, result);
            else { // id not match
              var error = new Error('ID not found');
              error.code = 'NOT_FOUND';
              callback(error);
            }
          } else { // other error
            console.error(err);
            var error = new Error('Some general error');
            error.code = 'INTERNAL';
            callback(err);
          }
        });
      },
      function (err, results) {
        if (!err) {
          res.report('OK');
        }
        else {
          console.error(err);
          res.report(err.code);
        }
      }
    );
  })

router.route('/:id')
  .get(function(req, res) {
    var id = req.params.id;
    User.find({_id: id}, function(err, results) {
      if (!err) {
        var ret = {'users':[results[0].toJObj()]};
        res.report('OK', ret);
      } else {
        console.log(err);
        res.report('INTERNAL');
      }
    });
  })
  .put(function(req, res) {
    var id = req.params.id;
    var data = User.toMongo(req.body.users[0]);
    data._id = id;
    upsert(data, function(err, result) {
      if (!err) res.report('OK', result);
      else res.report(err.code);
    });
  })
  .delete(function(req, res) {
    var id = req.params.id;
    User.remove({_id: id}, function(err, result) {
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

  User.findOneAndUpdate({_id:data._id}, data, {upsert:true}, function (err, result) {
    if (err) console.log('err:', err);
    else callback(null, result.toJObj());
  });
}

function saveIfNewEmail(doc, callback) {
  function checkExistence(callback) {
    User.find({email: doc.email}, function(err, results) {
      if (err) {
        console.error(err);
        var err = new Error('Some error');
        err.code = 'INTERNAL';
        callback(err);
        return;
      }
      if (results.length === 0) { // no duplicate
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  }

  function saveDoc(result, callback) {
    if (result === true) {
      doc.save(function(err, result) {
        if (!err) callback(null, result);
        else {
          console.error(err);
          var err = new Error('Some error');
          err.code = 'INTERNAL';
          callback(err, result);
        }
      });
    }
    else { // user exists
      var err = new Error('User exists');
      err.code = 'USER_EXISTS';
      callback(err, null);
    }
  }

  async.waterfall([checkExistence, saveDoc], function(err, result) {
    callback(err, result)
  });
}

module.exports = router;
