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

  var sabrina = Contact({name: 'Sabrina', email:'sabrina@abc.com', age:17, phone: {'mobile': ['656-1234']}});
  sabrina.save(function (err, sabrina) {
    if (err) console.log(err);
    else console.log(sabrina);
    db.close();
  });
});
