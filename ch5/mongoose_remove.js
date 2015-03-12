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
  })
  var Contact = mongoose.model('Contact', contactSchema);

  Contact.remove({name: 'Sabrina'}, function(err, result) {
    if (err) console.log(err);
    else console.log(result);
    db.close();
  });
});
