var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/node_test');

db.bind('contacts');

db.contacts.find({}, function(err, result) {
  if (err) console.log(err);
  else {
    result.each(function(err, contact) {
      console.log(contact);
    });
  }
});

db.contacts.find({}).toArray(function(err, result) {
  console.log(result);
  db.close();
});

