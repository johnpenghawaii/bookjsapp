var mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect('mongodb://localhost:27017/node_test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  var contactSchema = mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    phone: {'home': [String], 'work': [String], 'mobile': [String]}
  });
  var Contact = mongoose.model('Contact', contactSchema);

Contact.findOne({name: 'Sabrina'}, function(err, results) {
  results.age += 1;
  results.save(function(err2, result2) {
    console.log(result2);
    db.close();
  });;
});
});
