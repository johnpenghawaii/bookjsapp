var model = require('../model');
var async = require('async');

var report = require('../report');

var router = require('express').Router();

router.route('/')
  .get(function (req, res) {
    var query = constructQuery(req.query);
    queryMongo(req.query, query, function (err, results) {
      if (!err) {
        for (var i; i < results.length; i++) {
          results[i] = results[i].toObj()
        }
        res.end(report('OK', results));
      } else {
        console.error(err);
        console.error(err.stack);
        res.end(report('INTERNAL'));
      }
    });
  });

function constructQuery(q) {
  if (q.center && q.radius && q.type) {
    var lonlat = splitCommaAndTrim(q.center);

    return {
              loc: {
                $near: {
                  $geometry : { type : "Point" , coordinates: [ lonlat[0], lonlat[1] ] },
                  $maxDistance : 500
                }
              }
            };
  } else if (q.bbox && q.type) {
    var bbox = splitCommaAndTrim(q.bbox);
    return {
            loc: {
              $geoWithin: {
                $geometry: {
                    type: "Polygon",
                    coordinates: [
                        [[ bbox[0], bbox[1] ], // bottom left
                         [ bbox[2], bbox[1] ], // bottom right
                         [ bbox[2], bbox[3] ], // top right
                         [ bbox[0], bbox[3] ], // top left
                         [ bbox[0], bbox[1] ]] // back to bottom left
                    ]
                }
              }
            }
    };
  }
}

function queryMongo(q, query, callback) {
  var collection = (q.type == 'custom') ? 'UserPOIs' : q.type;
  collection = capitalizeFirstLetter(collection);
  if (q.limit) {
    model[collection].find(query).limit(q.limit).exec(callback);
  } else {
    model[collection].find(query, callback);
  }
}

function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.substring(1);
}

function splitCommaAndTrim(str) {
  var arr = str.split(',');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].trim();
  }
  return arr;
}

module.exports = router;
