var OSMParser = require('osmparser');
var mongoose = require('mongoose');
var Restaurant = require('./model').Restaurant;
var Parking = require('./model').Parking;

var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/lbs');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  parseOSM();
});

function parseOSM() {
  var parser = new OSMParser();
  parser.on('node', function(node) {
    var poi;
    if (node.type.localeCompare('restaurant') === 0) {
      poi = new Restaurant();
    } else {
      poi = new Parking();
    }
    poi._id = node.id;
    poi.name = node.tags.name;
    poi.type = node.type;
    poi.loc = [node.lon, node.lat];
    poi.save(function(err, poi) {
      if (err) console.error('save error', err);
      else console.log(poi._id, poi.name, 'saved');
    });
  });

  parser.on('error', function(err) {
    console.error('error on', err);
  });

  parser.on('end', function(err) {
    console.log('done!');
    db.close(); // 關閉
	process.exit(0);
  });

  parser.filterNode = function(node, callback) {
    if (tagNodeWanted(node))
      callback(null, node);
    else
      callback(null, null);
  }

  parser.parse('taiwan-latest.osm');
}

function tagNodeWanted(node) {
  if (node.tags['name']) {
    if (node.tags['amenity'] &&
        node.tags['amenity'].localeCompare('restaurant') === 0) {
      node.type = 'restaurant';
      return true;
    }
    if (node.tags['amenity'] &&
       node.tags['amenity'].localeCompare('parking') === 0) {
      node.type = 'parking';
      return true;
    }
  }
  return false;
}
