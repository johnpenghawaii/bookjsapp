var mongoose = require('mongoose');
var extend = require('util')._extend;

// universal toMongo
function toMongo(that) {
  var obj = extend(that);
  if ('id' in obj) {
    obj._id = obj.id;
    delete obj.id;
  }
  return obj;
}

// Connect to MongoDB
var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/lbs');
db.on('error', console.error.bind(console, 'Mongo connection error:'));

var poiSchema = mongoose.Schema({
  _id: Number,
  name: String,
  loc: [Number, Number],
});

poiSchema.index({loc: '2dsphere'});

var customPoiSchema = mongoose.Schema({
  type: {type: String},
  name: String,
  loc: [Number, Number],
  userId: mongoose.Schema.Types.ObjectId
});
customPoiSchema.index({loc: '2dsphere', type: 'name'});

var userSchema = mongoose.Schema({
  name: String,
  type: {type: String},
  email: String,
  password: String,
  name: String,
  gender: String,
  dob: Date,
});

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

poiSchema.static({
  toMongo: toMongo
});

customPoiSchema.method({
  toJObj: function () {
    var obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    delete obj.userId;
    return obj;
  }
});

customPoiSchema.static({
  toMongo: toMongo
});

userSchema.method({
  toJObj: function () {
    var obj = this.toObject();
    obj.id = obj._id;
    if ('dob' in obj) {
      obj.dob = obj.dob.getFullYear() + '/' +
                (obj.dob.getMonth() + 1) + '/' +
                obj.dob.getDate();
    }
    delete obj._id;
    delete obj.__v;
	delete obj.password;
    return obj;
  }
});

userSchema.static({
  toMongo: toMongo
});

var Restaurant = mongoose.model('Restaurant', poiSchema);
var Parking = mongoose.model('Parking', poiSchema);
var User = mongoose.model('User', userSchema);
var CustomPOI = mongoose.model('UserPOI', customPoiSchema);

// Exports POI model
exports.Restaurant = Restaurant;
exports.Parking = Parking;
exports.User = User;
exports.CustomPOI = CustomPOI;
