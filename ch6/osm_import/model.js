var mongoose = require('mongoose');

var poiSchema = mongoose.Schema({
  _id: Number,
  name: String,
  loc: [Number, Number],
});

poiSchema.index({loc: '2dsphere'});


var Restaurant = mongoose.model('Restaurant', poiSchema);
var Parking = mongoose.model('Parking', poiSchema);

// Exports POI model
exports.Restaurant = Restaurant;
exports.Parking = Parking;



/*
// Another kind of GeoJSON specification
var poiSchema = mongoose.Schema({
  _id: Number,
  name: String,
  type: String,
  geo: { // GeoJSON
    type: {type: String},
    coordinates: [Number, Number],
  }
});

poiSchema.index({geo: '2dsphere'});
*/