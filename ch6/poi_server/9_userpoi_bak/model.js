var mongoose = require('mongoose');

var poiSchema = mongoose.Schema({
  _id: Number,
  name: String,
  loc: [Number, Number],
});
poiSchema.index({loc: '2dsphere'});

var userPoiSchema = mongoose.Schema({
  type: {type: String},
  name: String,
  loc: [Number, Number],
  userID: mongoose.Schema.Types.ObjectId
});
userPoiSchema.index({loc: '2dsphere', type: 'name'});

var userSchema = mongoose.Schema({
  name: String,
  type: {type: String},
  email: String,
  password: String,
  name: String,
  gender: String,
  dob: Date,
});

// Connect to MongoDB
var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/lbs');
db.on('error', console.error.bind(console, 'Mongo connection error:'));

var Restaurant = mongoose.model('Restaurant', poiSchema);
var Parking = mongoose.model('Parking', poiSchema);
var User = mongoose.model('User', userSchema);
var UserPOI = mongoose.model('UserPOI', userPoiSchema);

// Converter
var extend = require('util')._extend;
UserPOI.prototype.toJObj =
User.prototype.toJObj =
Parking.prototype.toJObj =
Restaurant.prototype.toJObj = function() {
  var obj = this.toObject();
  obj.id = obj._id;
  if ('dob' in obj) {
    obj.dob = obj.dob.getFullYear() + '/' +
              (obj.dob.getMonth() + 1) + '/' +
              obj.dob.getDate();
  }
  delete obj._id;
  delete obj.__v;
  return obj;
}

UserPOI.__proto__.toMongo =
User.__proto__.toMongo =
Parking.__proto__.toMongo =
Restaurant.__proto__.toMongo = function(that) {
  var obj = extend(that);
  if ('id' in obj) {
    obj._id = obj.id;
    delete obj.id;
  }
  return obj;
}

// Exports POI model
exports.Restaurant = Restaurant;
exports.Parking = Parking;
exports.User = User;
exports.UserPOI = UserPOI;
