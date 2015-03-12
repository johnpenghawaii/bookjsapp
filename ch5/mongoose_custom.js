var mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/node_test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  var tempSchema = mongoose.Schema({
    degree: Number,
  });

  tempSchema.static({
    newTempFromCelsius: function(value, callback) {
      return Temperature({degree: value + 273.15});
    }
  });

  tempSchema.method({
    toCelsius: function(callback) {
      return this.degree - 273.15;
    }
  });

  var Temperature = mongoose.model('Temperature', tempSchema);

  var celcius = 30;
  var t = Temperature.newTempFromCelsius(celcius);
  t.save(function (err, result) {
    console.log(result)
    console.log('Degree in Celsius', t.toCelsius());
    db.close();
  });
});
