var mongoose = require('mongoose');

var poiSchema = mongoose.Schema({
  _id: Number,
  name: String,
  loc: [Number, Number],
});

poiSchema.index({loc: '2dsphere'});

// Connect to MongoDB
var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/lbs');
db.on('error', console.error.bind(console, 'Mongo connection error:'));

// Converters
poiSchema.method({
  toJObj: function () {
    var obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
  }
});

var extend = require('util')._extend;
poiSchema.static({
  toMongo: function (that) {
    var obj = extend(that);
    if ('id' in obj) {
      obj._id = obj.id;
      delete obj.id;
    }
    return obj;
  }
});

var Restaurant = mongoose.model('Restaurant', poiSchema);
var Parking = mongoose.model('Parking', poiSchema);

// Exports POI model
exports.Restaurant = Restaurant;
exports.Parking = Parking;
